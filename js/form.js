// модуль, который работает с формой объявления
'use strict';

(function () {
  var RulesRoomsCapacities = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0'],
  };
  var SAVE_URL = 'https://js.dump.academy/keksobooking';
  var submitForm = document.querySelector('.ad-form');
  var allFieldset = submitForm.querySelectorAll('fieldset');
  var mapElement = document.querySelector('.map');
  var mapFilters = document.querySelector('.map__filters');
  var formReset = submitForm.querySelector('.ad-form__reset');
  var typesAllowEnter = ['submit', 'reset'];
  var successTemplate = document.querySelector('#success').content;
  var successElement = '.success';
  var errorTemplate = document.querySelector('#error').content;
  var errorElement = '.error';
  var mainPin = mapElement.querySelector('.map__pin--main');
  var typeSelect = submitForm.querySelector('[name="type"]');
  var priceInput = submitForm.querySelector('[name="price"]');
  var timeInSelect = submitForm.querySelector('[name="timein"]');
  var timeOutSelect = submitForm.querySelector('[name="timeout"]');
  var roomsSelect = submitForm.querySelector('[name="rooms"]');
  var capacitySelect = submitForm.querySelector('[name="capacity"]');


  // Заполняем поле адреса после открытия страницы
  function updateAddress(isActiveMap) {
    var addressInput = document.querySelector('[name="address"]');
    var mainPinLocation = window.pin.getMainPinLocation(isActiveMap);
    addressInput.value = mainPinLocation.x + ', ' + mainPinLocation.y;
  }

  function activateForm(form, fieldset) {
    // Убираем затемнение формы
    form.classList.remove('ad-form--disabled');
    // submitForm.classList.remove('ad-form--disabled');

    // Разблокировка полей формы
    fieldset.forEach(function (field) {
      field.disabled = false;
    });

    // Это нужно, чтобы валидация работала правильно,
    // если пользователь не будет изменять эти поля
    updateAddress(true);
    setMinPrice(typeSelect.value, priceInput);
    checkRoomsCapacity(roomsSelect, capacitySelect, RulesRoomsCapacities);
  }

  // Деактивация формы
  function deactivateForm(form, fields, map, pin, filters) {
    // Сброс полей формы
    form.reset();
    // Блокировка полей формы
    fields.forEach(function (field) {
      field.disabled = true;
    });

    window.map.deactivateMap(map, pin, filters);
    // Добавляем затемнение формы
    form.classList.add('ad-form--disabled');
    updateAddress(false);
  }

  function setMinPrice(propertyType, priceField) {
    var MinPrices = {
      'flat': window.constants.FLAT_PRICE,
      'house': window.constants.HOUSE_PRICE,
      'palace': window.constants.PALACE_PRICE,
    };
    priceField.setAttribute('min', MinPrices[propertyType] || 0);
    priceField.setAttribute('placeholder', MinPrices[propertyType] || 0);
  }

  // Синхронизирует значения селектов.
  function syncFields(select1, select2) {
    var value1 = select1.value;
    var options = select2.options;
    for (var i = 0; i < options.length; i++) {
      if (options[i].value === value1) {
        select2.selectedIndex = i;
      }
    }
  }

  // Поле «Количество комнат» синхронизировано с полем «Количество гостей»
  function checkRoomsCapacity(rooms, capacity, rules) {
    var allowedCapacities = rules[rooms.value];

    // Ограничиваем возможность выбора неправильных вариантов
    for (var i = 0; i < capacity.options.length; i++) {
      capacity.options[i].disabled = (allowedCapacities.indexOf(capacity.options[i].value) === -1);
    }

    // Добавляем / убираем сообщение об ошибке
    return allowedCapacities.indexOf(capacity.value) === -1 ? capacity.setCustomValidity('Выберите другое количество мест') : capacity.setCustomValidity('');

  }


  // Валидация поля ввода цены
  priceInput.addEventListener('invalid', function (evt) {
    if (evt.target.validity.rangeOverflow) {
      var maxPrice = evt.target.getAttribute('max') || '1 000 000';
      evt.target.setCustomValidity('Цена не должна превышать ' + maxPrice + ' руб.');

    } else if (evt.target.validity.rangeUnderflow) {
      var minPrice = evt.target.getAttribute('min') || '0';
      evt.target.setCustomValidity('Для этого типа жилья цена не должна быть ниже ' + minPrice + ' руб.');

    } else if (evt.target.validity.valueMissing) {
      evt.target.setCustomValidity('Обязательное поле');

    } else {
      evt.target.setCustomValidity('');
    }
  });

  priceInput.addEventListener('change', function (evt) {
    evt.target.setCustomValidity('');
  });

  // Поля «Время заезда» и «Время выезда» синхронизированы:
  timeInSelect.addEventListener('change', function () {
    syncFields(timeInSelect, timeOutSelect);
  });

  timeOutSelect.addEventListener('change', function () {
    syncFields(timeOutSelect, timeInSelect);
  });

  // Поле «Тип жилья» влияет на минимальное значение поля «Цена за ночь»:
  typeSelect.addEventListener('change', function (evt) {
    setMinPrice(evt.target.value, priceInput);
  });

  // Нажатие на кнопку .form__reset сбрасывает страницу в исходное неактивное состояние:
  formReset.addEventListener('click', function (evt) {
    evt.preventDefault();
    deactivateForm(submitForm, allFieldset, mapElement, mainPin, mapFilters);

  });

  submitForm.addEventListener('keydown', function (evt) {
    window.utils.isEnterEvent(evt, function () {
      if (typesAllowEnter.indexOf(evt.target.type) === -1) {
        evt.preventDefault();
      }
    });
  });

  submitForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(submitForm);
    window.backend.save(formData, function () {
      window.messages.renderStatusMessage(successTemplate, successElement);
      deactivateForm(submitForm, allFieldset, mapElement, mainPin, mapFilters);
    }, function () {
      window.messages.renderStatusMessage(errorTemplate, errorElement);
    }, window.map.TIMEOUT, window.map.STATUS, SAVE_URL);
  });

  roomsSelect.addEventListener('change', function () {
    checkRoomsCapacity(roomsSelect, capacitySelect, RulesRoomsCapacities);
  });

  capacitySelect.addEventListener('change', function () {
    checkRoomsCapacity(roomsSelect, capacitySelect, RulesRoomsCapacities);
  });


  // Заполняем поле адреса после открытия страницы
  updateAddress(false);


  window.form = {
    activateForm: activateForm,
    updateAddress: updateAddress,
    errorTemplate: errorTemplate,
    errorElement: errorElement,
  };

})();
