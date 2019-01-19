// модуль, который отвечает за создание пина — метки на карте
'use strict';

(function () {

  var mapElement = document.querySelector('.map');
  var filtersElement = mapElement.querySelector('.map__filters-container');
  var filtersForm = filtersElement.querySelector('.map__filters');
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
  function renderPins(pinsCount, map, pins) {

    window.map.cleanMap(map, pins);
    var fragmentPin = document.createDocumentFragment();
    var similarPinElement = document.querySelector('.map__pins');

    var filteredApartments = window.constants.APARTMENTS.slice()
      .filter(checkFilters);

    var num = Math.min(filteredApartments.length, pinsCount);

    for (var i = 0; i < num; i++) {
      fragmentPin.appendChild(generatePinImage(filteredApartments[i], map));
    }
    similarPinElement.appendChild(fragmentPin);
  }

  function checkFilters(apartment) {
    // Проверяем основные параметры жилья
    for (var property in Filters.housing) {
      if (Filters.housing.hasOwnProperty(property)) {
        var apartmentPropertyValue = apartment.offer[property];
        if (property === 'price') {
          apartmentPropertyValue = getPriceCategory(apartmentPropertyValue);
        }
        if ((Filters.housing[property] !== 'any') && (apartmentPropertyValue.toString() !== Filters.housing[property])) {
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

  function setDefaultFilters() {
    for (var property in Filters.housing) {
      if (Filters.housing.hasOwnProperty(property)) {
        if ((Filters.housing[property] !== 'any')) {
          Filters.housing[property] = 'any';
        }
      }
    }
    for (var feature in Filters.features) {
      if (Filters.features.hasOwnProperty(feature)) {
        if ((Filters.features[feature] === true)) {
          Filters.features[feature] = false;
        }
      }
    }
  }

  function getPriceCategory(price) {
    if (price < window.constants.LOW_PRICE) {
      return 'low';
    } else if (price >= window.constants.HIGH_PRICE) {
      return 'high';
    }

    return 'middle';
  }

  function getMainPinLocation(isActive) {
    var pinCorrectionX = isActive ? window.constants.MAIN_PIN_WIDTH / 2 : 0;
    var pinCorrectionY = isActive ? window.constants.MAIN_PIN_HEIGHT : 0;

    var locationX = window.map.mainPin.offsetLeft + pinCorrectionX;
    var locationY = window.map.mainPin.offsetTop + pinCorrectionY;

    return {x: locationX, y: locationY};
  }

  function generatePinImage(apartment, map) {
    var pinTemplate = document.querySelector('#pin').content;
    var pinElement = pinTemplate.querySelector('.map__pin');
    var pin = pinElement.cloneNode(true);
    pin.style.left = (apartment.location.x) + 'px';
    pin.style.top = (apartment.location.y) + 'px';

    pin.querySelector('img').setAttribute('src', apartment.author.avatar);
    pin.querySelector('img').setAttribute('alt', apartment.offer.title);


    pin.addEventListener('click', function () {
      if (!pin.classList.contains('map__pin--selected')) {
        pinClickHandler(pin, apartment, map);
      }
    });

    return pin;
  }

  // События по клику на метку
  function pinClickHandler(selectedPinElement, selectedPinData, map) {
    // Переключает класс
    toggleSelectedPin(selectedPinElement);
    // Отрисовывает карточку для выбранной метки
    window.card.renderCard(selectedPinData, map);
  }

  // Добавляет класс --selected выбранной метке
  // удаляет этот класс с выбранной ранее метки
  function toggleSelectedPin(selectedPin) {
    var pins = document.querySelectorAll('.map__pin');

    pins.forEach(function (pin) {
      pin.classList.remove('map__pin--selected');
    });

    selectedPin.classList.add('map__pin--selected');
  }

  window.pin = {
    renderPins: renderPins,
    getMainPinLocation: getMainPinLocation,
    Filters: Filters,
    setDefaultFilters: setDefaultFilters,
  };

})();
