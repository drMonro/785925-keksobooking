// модуль, который работает с формой объявления
'use strict';

(function () {
  var form = document.querySelector('.ad-form');
  var fieldsets = form.querySelectorAll('fieldset');

  // Заполняем поле адреса после открытия страницы
  updateAddress(false);

  // // Заполняем поле адреса после открытия страницы
  function updateAddress(isActiveMap) {
    var addressInput = form.querySelector('[name="address"]');
    var mainPinLocation = window.pin.getMainPinLocation(isActiveMap);
    addressInput.value = mainPinLocation.x + ', ' + mainPinLocation.y;
  }

  function activateForm() {
    // Убираем затемнение формы
    form.classList.remove('ad-form--disabled');

    // Разблокировка полей формы
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = false;
    }

    // Это нужно, чтобы валидация работала правильно,
    // если пользователь не будет изменять эти поля
    updateAddress(true);
    setMinPrice(typeSelect.value);
    checkRoomsCapacity(roomsSelect, capacitySelect, rulesRoomsCapacity);
  }

  // Нажатие на кнопку .form__reset сбрасывает страницу в исходное неактивное состояние:
  var formReset = form.querySelector('.ad-form__reset');

  formReset.addEventListener('click', function (evt) {
    evt.preventDefault();
    deactivateForm();
  });

  var typesAllowEnter = ['submit', 'reset', 'file'];
  form.addEventListener('keydown', function (evt) {
    window.utils.isEnterEvent(evt, function () {
      if (typesAllowEnter.indexOf(evt.target.type) === -1) {
        evt.preventDefault();
      }
    });
  });

  var successBlock = '.success';
  var errorBlock = '.error';
  var successTemplate = document.querySelector('#success').content;
  var errorTemplate = document.querySelector('#error').content;

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var formData = new FormData(form);

    window.backend.save(formData, function () {
      window.statusMessage(successTemplate, successBlock);
      deactivateForm();
    }, function () {
      window.statusMessage(errorTemplate, errorBlock);
    });
  });

  // Деактивация формы
  function deactivateForm() {
    // Сброс полей формы
    form.reset();
    // Блокировка полей формы
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = true;
    }

    // Добавляем затемнение формы
    form.classList.add('ad-form--disabled');

    window.map.deactivateMap();
    updateAddress(false);
  }

  // Поле «Тип жилья» влияет на минимальное значение поля «Цена за ночь»:

  var typeSelect = form.querySelector('[name="type"]');

  typeSelect.addEventListener('change', function (evt) {
    setMinPrice(evt.target.value);
  });

  function setMinPrice(propertyType) {
    var minPrices = {
      'flat': 1000,
      'house': 5000,
      'palace': 10000,
    };
    priceInput.setAttribute('min', minPrices[propertyType] || 0);
    priceInput.setAttribute('placeholder', minPrices[propertyType] || 0);
  }


  // Валидация поля ввода заголовка объявления
  var titleInput = form.querySelector('[name="title"]');

  titleInput.addEventListener('invalid', function () {
    if (titleInput.validity.tooShort) {
      titleInput.setCustomValidity('Заголовок объявления должен состоять минимум из 30 символов');
    } else if (titleInput.validity.tooLong) {
      titleInput.setCustomValidity('Заголовок объявления не должен превышать 100 символов');
    } else if (titleInput.validity.valueMissing) {
      titleInput.setCustomValidity('Обязательное поле');
    } else {
      titleInput.setCustomValidity('');
    }
  });

  // Валидация поля ввода цены
  var priceInput = form.querySelector('[name="price"]');

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

  var timeInSelect = form.querySelector('[name="timein"]');
  var timeOutSelect = form.querySelector('[name="timeout"]');

  timeInSelect.addEventListener('change', function () {
    syncFields(timeInSelect, timeOutSelect);
  });

  timeOutSelect.addEventListener('change', function () {
    syncFields(timeInSelect, timeOutSelect);
  });

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
  var roomsSelect = form.querySelector('[name="rooms"]');
  var capacitySelect = form.querySelector('[name="capacity"]');
  var rulesRoomsCapacity = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0'],
  };

  function checkRoomsCapacity(rooms, capacity, rules) {
    var allowedCapacity = rules[rooms.value];

    // Ограничиваем возможность выбора неправильных вариантов
    for (var i = 0; i < capacity.options.length; i++) {
      capacity.options[i].disabled = (allowedCapacity.indexOf(capacity.options[i].value) === -1);
    }

    // Добавляем / убираем сообщение об ошибке
    if (allowedCapacity.indexOf(capacity.value) === -1) {
      capacity.setCustomValidity('Выберите другое количество мест');
    } else {
      capacity.setCustomValidity('');
    }
  }

  roomsSelect.addEventListener('change', function () {
    checkRoomsCapacity(roomsSelect, capacitySelect, rulesRoomsCapacity);
  });

  capacitySelect.addEventListener('change', function () {
    checkRoomsCapacity(roomsSelect, capacitySelect, rulesRoomsCapacity);
  });


  window.form = {
    activateForm: activateForm,
    updateAddress: updateAddress,
  };

})();
