// модуль, который отвечает за создание пина — метки на карте
'use strict';

(function () {

  var mapBlock = document.querySelector('.map');
  var filtersBlock = mapBlock.querySelector('.map__filters-container');
  var filtersForm = filtersBlock.querySelector('.map__filters');
  var Filters = {
    'housing': {
      'type': filtersForm.querySelector('#housing-type').value,
      'price': filtersForm.querySelector('#housing-price').value,
      'rooms': filtersForm.querySelector('#housing-rooms').value,
      'guests': filtersForm.querySelector('#housing-guests').value,
    },
    'features': {
      'wifi': filtersForm.querySelector('#filter-wifi').checked,
      'dishwasher': filtersForm.querySelector('#filter-dishwasher').checked,
      'parking': filtersForm.querySelector('#filter-parking').checked,
      'washer': filtersForm.querySelector('#filter-washer').checked,
      'elevator': filtersForm.querySelector('#filter-elevator').checked,
      'conditioner': filtersForm.querySelector('#filter-conditioner').checked,
    },
  };

  // Отрисовывает метки на карте
  function renderPins() {
    var PINS_NUM = 5;
    window.map.cleanMap();
    var fragmentPin = document.createDocumentFragment();
    var similarPinElement = document.querySelector('.map__pins');

    var filteredApartments = window.constants.APARTMENTS.slice()
      .filter(checkFilters);

    var num = Math.min(filteredApartments.length, PINS_NUM);

    for (var i = 0; i < num; i++) {
      fragmentPin.appendChild(generatePinImage(filteredApartments[i]));
    }
    similarPinElement.appendChild(fragmentPin);
  }

  function checkFilters(apartment) {
    // Проверяем основные параметры жилья
    for (var property in Filters.housing) {
      if (Filters.housing.hasOwnProperty(property)) {
        var hotelPropValue = apartment.offer[property];
        if (property === 'price') {
          hotelPropValue = getPriceCategory(hotelPropValue);
        }
        if ((Filters.housing[property] !== 'any') && (hotelPropValue.toString() !== Filters.housing[property])) {
          return false;
        }
      }
    }
    // Проверяем удобства
    for (var feature in Filters.features) {
      if (Filters.features.hasOwnProperty(feature)) {
        if (Filters.features[feature] === true && apartment.offer.features.indexOf(feature) === -1) {
          return false;
        }
      }
    }
    return true;
  }

  function getPriceCategory(price) {
    if (price < 10000) {
      return 'low';
    } else if (price >= 50000) {
      return 'high';
    } else {
      return 'middle';
    }
  }

  function getMainPinLocation(isActive) {
    var pinCorrection = isActive ? window.constants.MAIN_PIN_CORRECTION : 0;

    var locationX = window.map.mainPin.offsetLeft + pinCorrection;
    var locationY = window.map.mainPin.offsetTop;

    return {x: locationX, y: locationY};
  }

  var generatePinImage = function (apartment) {
    var pinTemplate = document.querySelector('#pin').content;
    var pinBlock = pinTemplate.querySelector('.map__pin');
    var pinElement = pinBlock.cloneNode(true);
    pinElement.style.left = (apartment.location.x) + 'px';
    pinElement.style.top = (apartment.location.y) + 'px';

    pinElement.querySelector('img').setAttribute('src', apartment.author.avatar);
    pinElement.querySelector('img').setAttribute('alt', apartment.offer.title);


    pinElement.addEventListener('click', function () {
      if (!pinElement.classList.contains('map__pin--selected')) {
        pinClickHandler(pinElement, apartment);
      }
    });

    return pinElement;
  };

  // События по клику на метку

  function pinClickHandler(selectedPinElement, selectedPinData) {
    // Переключает класс
    toggleSelectedPin(selectedPinElement);

    // Отрисовывает карточку для выбранной метки
    window.card.renderCard(selectedPinData);
  }


  // Добавляет класс --selected выбранной метке
  // удаляет этот класс с выбранной ранее метки

  function toggleSelectedPin(selectedPin) {
    var pins = document.querySelectorAll('.map__pin');

    for (var i = 0; i < pins.length; i++) {
      pins[i].classList.remove('map__pin--selected');
    }

    selectedPin.classList.add('map__pin--selected');
  }

  window.pin = {
    renderPins: renderPins,
    getMainPinLocation: getMainPinLocation,
    Filters: Filters,
  };

})();
