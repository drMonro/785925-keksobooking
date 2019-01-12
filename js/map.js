// модуль, который управляет карточками объявлений и пинами: добавляет на страницу нужную карточку, отрисовывает пины и осуществляет взаимодействие карточки и метки на карте
'use strict';

(function () {

  var MAP_ELEMENT = document.querySelector('.map');
  var MAP_MAIN_PIN = MAP_ELEMENT.querySelector('.map__pin--main');
  var MAP_PINS_ELEMENT = MAP_ELEMENT.querySelector('.map__pins');
  var MAP_FILTERS_ELEMENT = MAP_ELEMENT.querySelector('.map__filters-container');
  var MAP_FILTERS = MAP_FILTERS_ELEMENT.querySelector('.map__filters');


  // Переводит карту в активное состояние
  function activateMap() {
    MAP_ELEMENT.classList.remove('map--faded');
    window.form.activateForm();
    window.data.generateAvatarLinks(window.constants.AVATAR_LINKS, window.constants.APARTMENTS_AMOUNT);
    for (var i = 0; i < window.constants.APARTMENTS_AMOUNT; i++) {
      window.constants.APARTMENTS.push(window.data.generateApartment(window.constants.AVATAR_LINKS, window.constants.OFFER_TITLES, window.constants.AVATAR_COORDINATE_X_MIN, window.constants.AVATAR__COORDINATE_X_MAX, window.constants.AVATAR__COORDINATE_Y_MIN, window.constants.AVATAR__COORDINATE_Y_MAX, window.constants.APARTMENT_PRICE_MIN, window.constants.APARTMENT_PRICE_MAX, window.constants.APARTMENT_TYPES, window.constants.ROOMS_AMOUNT_MIN, window.constants.ROOMS_AMOUNT_MAX, window.constants.GUESTS_AMOUNT_MIN, window.constants.GUESTS_AMOUNT_MAX, window.constants.CHECK_POINTS, window.constants.APARTMENT_FEATURES, window.constants.APARTMENT_PHOTOS));
    }
    window.pin.renderPins();
    activateFilters();
  }

  // Перетаскивание главной метки
  MAP_MAIN_PIN.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    // Первое перемещение метки переводит страницу в активное состояние
    var isActive = !(MAP_ELEMENT.classList.contains('map--faded'));
    if (!isActive) {
      activateMap();
    }

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY,
    };

    var limitCoords = {
      MIN_X: 0,
      MAX_X: MAP_ELEMENT.offsetWidth - 80,
      MIN_Y: 130 - window.constants.MAIN_PIN_CORRECTION,
      MAX_Y: MAP_FILTERS_ELEMENT.offsetTop - window.constants.MAIN_PIN_CORRECTION,
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY,
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      var pinX = Math.min(Math.max((MAP_MAIN_PIN.offsetLeft - shift.x), limitCoords.MIN_X), limitCoords.MAX_X);
      var pinY = Math.min(Math.max((MAP_MAIN_PIN.offsetTop - shift.y), limitCoords.MIN_Y), limitCoords.MAX_Y);

      MAP_MAIN_PIN.style.left = pinX + 'px';
      MAP_MAIN_PIN.style.top = pinY + 'px';

      window.form.updateAddress(isActive);
      // window.debounce(renderPins);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Переводит карту в неактивное состояние
  function deactivateMap() {
    cleanMap();
    deactivateFilters();

    MAP_MAIN_PIN.style.top = '50%';
    MAP_MAIN_PIN.style.left = '50%';

    MAP_ELEMENT.classList.add('map--faded');
  }

  // Удаляет элементы из карты
  function cleanMap() {
    window.utils.cleanNode(MAP_ELEMENT, '.map__card');
    window.utils.cleanNode(MAP_PINS_ELEMENT, '.map__pin:not(.map__pin--main)');
  }


  // Блокировка фильтров
  function deactivateFilters() {
    for (var i = 0; i < MAP_FILTERS.children.length; i++) {
      MAP_FILTERS.children[i].disabled = true;
    }
  }


  // Разблокировка фильтров
  function activateFilters() {
    for (var i = 0; i < MAP_FILTERS.children.length; i++) {
      MAP_FILTERS.children[i].disabled = false;
    }
  }

  window.map = {
    deactivateMap: deactivateMap,
    MAP_ELEMENT: MAP_ELEMENT,
    MAP_MAIN_PIN: MAP_MAIN_PIN,
    cleanMap: cleanMap
  };

})();