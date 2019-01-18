// модуль, который управляет карточками объявлений и пинами: добавляет на страницу нужную карточку, отрисовывает пины и осуществляет взаимодействие карточки и метки на карте
'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var mainPin = mapElement.querySelector('.map__pin--main');
  var filtersElement = mapElement.querySelector('.map__filters-container');
  var filtersForm = filtersElement.querySelector('.map__filters');
  var submitForm = document.querySelector('.ad-form');
  var allFieldset = submitForm.querySelectorAll('fieldset');
  var pinsElement = document.querySelector('.map__pins');
  var TIMEOUT = 10000;
  var STATUS = 200;
  var DATA_URL = 'https://js.dump.academy/keksobooking/data';


  // Переводит карту в активное состояние
  function activateMap(map, form, fieldset, filters, timeout, status, url) {
    map.classList.remove('map--faded');
    window.form.activateForm(form, fieldset);
    window.backend.load(function (response) {
      window.constants.APARTMENTS = response;
      window.pin.renderPins();
      activateFilters(filters);
    }, function () {
      window.messages.renderStatusMessage(window.form.errorTemplate, window.form.errorElement);
    }, timeout, status, url);
  }

  // Переводит карту в неактивное состояние
  function deactivateMap(map, form, pin, filters) {
    cleanMap();
    deactivateFilters(filters);
    window.images.resetImages(window.images.avatarPreview, window.images.AVATAR_DEFAULT_SRC);

    pin.style.top = '50%';
    pin.style.left = '50%';

    map.classList.add('map--faded');
  }

  // Удаляет элементы из карты
  function cleanMap() {
    window.utils.cleanNode(mapElement, '.map__card');
    window.utils.cleanNode(pinsElement, '.map__pin:not(.map__pin--main)');
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
      activateMap(mapElement, submitForm, allFieldset, filtersForm, TIMEOUT, STATUS, DATA_URL);
    }
    var StartCoordinate = {
      X: evt.clientX,
      Y: evt.clientY,
    };

    var CoordinatesLimit = {
      MIN_X: 0,
      MAX_X: mapElement.offsetWidth - 62,
      MIN_Y: 130,
      MAX_Y: 630,
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var CoordinatesShift = {
        X: StartCoordinate.X - moveEvt.clientX,
        Y: StartCoordinate.Y - moveEvt.clientY,
      };

      StartCoordinate = {
        X: moveEvt.clientX,
        Y: moveEvt.clientY,
      };

      var pinX = Math.min(Math.max((mainPin.offsetLeft - CoordinatesShift.X), CoordinatesLimit.MIN_X), CoordinatesLimit.MAX_X);
      var pinY = Math.min(Math.max((mainPin.offsetTop - CoordinatesShift.Y), CoordinatesLimit.MIN_Y), CoordinatesLimit.MAX_Y);

      mainPin.style.left = pinX + 'px';
      mainPin.style.top = pinY + 'px';

      window.form.updateAddress(isActive);
      window.debounce(window.pin.renderPins());
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
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

    window.debounce(window.pin.renderPins());
  });

  window.map = {
    deactivateMap: deactivateMap,
    mainPin: mainPin,
    cleanMap: cleanMap,
    TIMEOUT: TIMEOUT,
    STATUS: STATUS,
  };

})();
