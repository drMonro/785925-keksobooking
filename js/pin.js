// модуль, который отвечает за создание пина — метки на карте
'use strict';

(function () {

  // Отрисовывает метки на карте
  function renderPins() {
    window.map.cleanMap();
    var fragmentPin = document.createDocumentFragment();
    var similarPinElement = document.querySelector('.map__pins');

    for (var j = 0; j < window.constants.APARTMENTS.length; j++) {
      fragmentPin.appendChild(generatePinImage(window.constants.APARTMENTS[j], window.constants.PICTURE_WIDTH, window.constants.PICTURE_HEIGHT));
    }
    similarPinElement.appendChild(fragmentPin);
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
