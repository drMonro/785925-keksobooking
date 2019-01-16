// модуль, который управляет карточками объявлений и пинами: добавляет на страницу нужную карточку, отрисовывает пины и осуществляет взаимодействие карточки и метки на карте
'use strict';

(function () {

  var mapBlock = document.querySelector('.map');
  var mainPin = mapBlock.querySelector('.map__pin--main');
  var filtersBlock = mapBlock.querySelector('.map__filters-container');
  var filtersForm = filtersBlock.querySelector('.map__filters');
  var submitForm = document.querySelector('.ad-form');
  var allFieldset = submitForm.querySelectorAll('fieldset');

  // Переводит карту в активное состояние
  function activateMap(map, form, fieldset, filters) {
    map.classList.remove('map--faded');
    window.form.activateForm(form, fieldset);
    window.backend.load(function (response) {
      window.constants.APARTMENTS = response;
      window.pin.renderPins(filters);
      activateFilters(filters);
    }, function () {
      window.messages.renderStatusMessage(window.form.errorTemplate, window.form.errorBlock);
    });
  }

  // Перетаскивание главной метки
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    // Первое перемещение метки переводит страницу в активное состояние
    var isActive = !(mapBlock.classList.contains('map--faded'));
    if (!isActive) {
      activateMap(mapBlock, submitForm, allFieldset, filtersForm);
    }

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var CoordinatesLimits = {
      MIN_X: 0,
      MAX_X: mapBlock.offsetWidth - 62,
      MIN_Y: 130,
      MAX_Y: 630,
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

      var pinX = Math.min(Math.max((mainPin.offsetLeft - shift.x), CoordinatesLimits.MIN_X), CoordinatesLimits.MAX_X);
      var pinY = Math.min(Math.max((mainPin.offsetTop - shift.y), CoordinatesLimits.MIN_Y), CoordinatesLimits.MAX_Y);

      mainPin.style.left = pinX + 'px';
      mainPin.style.top = pinY + 'px';

      window.form.updateAddress(isActive);
      window.debounce(window.pin.renderPins(filtersForm));
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // // Изменение фильтров
  filtersForm.addEventListener('change', function (evt) {
    if (evt.target.name === 'features') {
      window.pin.Filters.features[evt.target.value] = evt.target.checked;
    } else {
      var key = evt.target.name.split('-')[1];
      window.pin.Filters.housing[key] = evt.target.value;
    }
    window.debounce(window.pin.renderPins(filtersForm));
  });

  // Переводит карту в неактивное состояние
  function deactivateMap(map, form, pin, filters) {
    form.reset();
    cleanMap();
    deactivateFilters(filters);
    window.images.resetImages();

    pin.style.top = '50%';
    pin.style.left = '50%';

    map.classList.add('map--faded');

  }

  var map = document.querySelector('.map');
  var pinsBlock = document.querySelector('.map__pins');

  // Удаляет элементы из карты
  function cleanMap() {

    window.utils.cleanNode(map, '.map__card');
    window.utils.cleanNode(pinsBlock, '.map__pin:not(.map__pin--main)');
  }


  // Блокировка фильтров
  function deactivateFilters(filters) {
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

  window.map = {
    deactivateMap: deactivateMap,
    mainPin: mainPin,
    cleanMap: cleanMap
  };

})();
