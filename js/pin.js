// модуль, который отвечает за создание пина — метки на карте
'use strict';

(function () {

  var MAP_ELEMENT = document.querySelector('.map');
  var MAP_FILTERS_ELEMENT = MAP_ELEMENT.querySelector('.map__filters-container');
  var MAP_FILTERS = MAP_FILTERS_ELEMENT.querySelector('.map__filters');

  var filters = {
    'housing': {
      'type': MAP_FILTERS.querySelector('#housing-type').value,
      'price': MAP_FILTERS.querySelector('#housing-price').value,
      'rooms': MAP_FILTERS.querySelector('#housing-rooms').value,
      'guests': MAP_FILTERS.querySelector('#housing-guests').value
    },
    'features': {
      'wifi': MAP_FILTERS.querySelector('#filter-wifi').checked,
      'dishwasher': MAP_FILTERS.querySelector('#filter-dishwasher').checked,
      'parking': MAP_FILTERS.querySelector('#filter-parking').checked,
      'washer': MAP_FILTERS.querySelector('#filter-washer').checked,
      'elevator': MAP_FILTERS.querySelector('#filter-elevator').checked,
      'conditioner': MAP_FILTERS.querySelector('#filter-conditioner').checked
    }
  };

  // Отрисовывает метки на карте
  function renderPins() {
    window.map.cleanMap();
    var fragmentPin = document.createDocumentFragment();
    var similarPinElement = document.querySelector('.map__pins');

    var filteredApartments = window.constants.APARTMENTS.slice()
      .filter(checkFilters);

    for (var i = 0; i < filteredApartments.length; i++) {
      fragmentPin.appendChild(generatePinImage(filteredApartments[i], window.constants.PICTURE_WIDTH, window.constants.PICTURE_HEIGHT));
    }
    similarPinElement.appendChild(fragmentPin);
  }

  function checkFilters(hotel) {
    // Проверяем основные параметры жилья
    for (var prop in filters.housing) {
      if (filters.housing.hasOwnProperty(prop)) {
        var hotelPropValue = hotel.offer[prop];
        if ((filters.housing[prop] !== 'any') && (hotelPropValue.toString() !== filters.housing[prop])) {
          return false;
        }
      }
    }
    // Проверяем удобства
    for (var feat in filters.features) {
      if (filters.features.hasOwnProperty(feat)) {
        if (filters.features[feat] === true && hotel.offer.features.indexOf(feat) === -1) {
          return false;
        }
      }
    }
    return true;
  }

  function getMainPinLocation(isActive) {
    var pinCorrection = isActive ? window.constants.MAIN_PIN_CORRECTION : 0;

    var locationX = window.map.MAP_MAIN_PIN.offsetLeft;
    var locationY = window.map.MAP_MAIN_PIN.offsetTop + pinCorrection;

    return {x: locationX, y: locationY};
  }

  var generatePinImage = function (apartment) {
    var TEMPLATE = document.querySelector('#pin').content;
    var PIN_TEMPLATE = TEMPLATE.querySelector('.map__pin');
    var PIN_HEIGHT = 70;
    var pinElement = PIN_TEMPLATE.cloneNode(true);
    pinElement.style.left = (apartment.location.x) + 'px';
    pinElement.style.top = (apartment.location.y - PIN_HEIGHT / 2) + 'px';

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

  };

})();
