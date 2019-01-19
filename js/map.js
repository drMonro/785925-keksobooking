// модуль, который управляет карточками объявлений и пинами: добавляет на страницу нужную карточку, отрисовывает пины и осуществляет взаимодействие карточки и метки на карте
'use strict';

(function () {
  var TIMEOUT = 10000;
  var STATUS = 200;
  var DATA_URL = 'https://js.dump.academy/keksobooking/data';
  var PINS_COUNT = 5;
  var mapElement = document.querySelector('.map');
  var mainPin = mapElement.querySelector('.map__pin--main');
  var filtersElement = mapElement.querySelector('.map__filters-container');
  var filtersForm = filtersElement.querySelector('.map__filters');
  var submitForm = document.querySelector('.ad-form');
  var allFieldset = submitForm.querySelectorAll('fieldset');
  var pinsElement = document.querySelector('.map__pins');


  // Переводит карту в активное состояние
  function activateMap(map, form, fieldset, filters, timeout, status, url, pinsCount, pins) {
    map.classList.remove('map--faded');
    window.form.activateForm(form, fieldset);
    window.backend.load(function (response) {
      window.constants.APARTMENTS = response;
      window.pin.renderPins(pinsCount, map, pins);
      activateFilters(filters);
    }, function () {
      window.messages.renderStatusMessage(window.form.errorTemplate, window.form.errorElement);
    }, timeout, status, url);
  }

  // Переводит карту в неактивное состояние
  function deactivateMap(map, pin, filters, pins) {
    cleanMap(map, pins);
    deactivateFilters(filters);
    window.images.resetImages(window.images.avatarPreview, window.images.AVATAR_DEFAULT_SRC);

    pin.style.top = '50%';
    pin.style.left = '50%';

    map.classList.add('map--faded');
  }

  // Удаляет элементы из карты
  function cleanMap(map, pins) {
    window.utils.cleanNode(map, '.map__card');
    window.utils.cleanNode(pins, '.map__pin:not(.map__pin--main)');
  }

  // Блокировка фильтров
  function deactivateFilters(filters) {
    window.pin.setDefaultFilters();
    filters.reset();
    for (var i = 0; i < filters.children.length; i++) {
      filters.children[i].disabled = true;
    }
  }

  // Разблокировка фильтров
  function activateFilters(filters) {
    for (var i = 0; i < filters.children.length; i++) {
      filters.children[i].disabled = false;
    }
  }


  // Первое перемещение метки переводит страницу в активное состояние
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var isActive = !(mapElement.classList.contains('map--faded'));
    if (!isActive) {
      activateMap(mapElement, submitForm, allFieldset, filtersForm, TIMEOUT, STATUS, DATA_URL, PINS_COUNT, pinsElement);
    }
    var StartCoordinate = {
      x: evt.clientX,
      y: evt.clientY,
    };

    var CoordinatesLimit = {
      xMinimum: 0,
      xMaximum: mapElement.offsetWidth - window.constants.MAIN_PIN_WIDTH,
      yMinimum: 130,
      yMaximum: 630 - window.constants.MAIN_PIN_HEIGHT,
    };

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var CoordinatesShift = {
        x: StartCoordinate.x - moveEvt.clientX,
        y: StartCoordinate.y - moveEvt.clientY,
      };

      StartCoordinate = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      var pinX = Math.min(Math.max((mainPin.offsetLeft - CoordinatesShift.x), CoordinatesLimit.xMinimum), CoordinatesLimit.xMaximum);
      var pinY = Math.min(Math.max((mainPin.offsetTop - CoordinatesShift.y), CoordinatesLimit.yMinimum), CoordinatesLimit.yMaximum);

      mainPin.style.left = pinX + 'px';
      mainPin.style.top = pinY + 'px';

      window.form.updateAddress(isActive);
      window.debounce(window.pin.renderPins(PINS_COUNT, mapElement, pinsElement));
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Изменение фильтров
  filtersForm.addEventListener('change', function (evt) {
    if (evt.target.name === 'features') {
      window.pin.Filters.features[evt.target.value] = evt.target.checked;
    } else {
      var key = evt.target.name.split('-')[1];
      window.pin.Filters.housing[key] = evt.target.value;
    }

    window.debounce(window.pin.renderPins(PINS_COUNT, mapElement, pinsElement));
  });

  window.map = {
    deactivateMap: deactivateMap,
    mainPin: mainPin,
    cleanMap: cleanMap,
    TIMEOUT: TIMEOUT,
    STATUS: STATUS,
  };

})();
