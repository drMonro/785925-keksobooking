'use strict';

var AVATAR_LINKS = [];
var APARTMENTS = [];
var APARTMENTS_AMOUNT = 8;
var AVATAR_COORDINATE_X_MIN = 270;
var AVATAR__COORDINATE_X_MAX = 1100;
var AVATAR__COORDINATE_Y_MIN = 130;
var AVATAR__COORDINATE_Y_MAX = 630;
var APARTMENT_PRICE_MIN = 1000;
var APARTMENT_PRICE_MAX = 1000000;
var ROOMS_AMOUNT_MIN = 1;
var ROOMS_AMOUNT_MAX = 5;
var GUESTS_AMOUNT_MIN = 2;
var GUESTS_AMOUNT_MAX = 7;
var OFFER_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде',
];
var APARTMENT_TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo',
];
var CHECK_POINTS = [
  '12:00',
  '13:00',
  '14:00',
];
var APARTMENT_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];
var APARTMENT_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
];
var PICTURE_WIDTH = 40;
var PICTURE_HEIGHT = 40;

var MAIN_PIN_CORRECTION = 48;

var MAP_ELEMENT = document.querySelector('.map');
var MAP_MAIN_PIN = MAP_ELEMENT.querySelector('.map__pin--main');
var form = document.querySelector('.ad-form');
var fieldsets = form.querySelectorAll('fieldset');
var MAP_PINS_ELEMENT = MAP_ELEMENT.querySelector('.map__pins');
var MAP_FILTERS_ELEMENT = MAP_ELEMENT.querySelector('.map__filters-container');
var MAP_FILTERS = MAP_FILTERS_ELEMENT.querySelector('.map__filters');


// // Заполняем поле адреса после открытия страницы
// updateAddress(false);

function updateAddress(isActiveMap) {
  var addressInput = form.querySelector('[name="address"]');
  var mainPinLocation = getMainPinLocation(isActiveMap);
  addressInput.value = mainPinLocation.x + ', ' + mainPinLocation.y;
}

function getMainPinLocation(isActive) {
  var pinCorrection = isActive ? MAIN_PIN_CORRECTION : 0;

  var locationX = MAP_MAIN_PIN.offsetLeft;
  var locationY = MAP_MAIN_PIN.offsetTop + pinCorrection;

  return {x: locationX, y: locationY};
}

// Перетаскивание главной метки
MAP_MAIN_PIN.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  // Первое перемещение метки переводит страницу в активное состояние
  var isActive = !(MAP_ELEMENT.classList.contains('map--faded'));
  if (!isActive) {
    activateMap();
  }
  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    // document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mouseup', onMouseUp);
});

// Переводит карту в активное состояние

function activateMap() {
  MAP_ELEMENT.classList.remove('map--faded');
  activateForm();
  generateAvatarLinks(AVATAR_LINKS, APARTMENTS_AMOUNT);
  for (var i = 0; i < APARTMENTS_AMOUNT; i++) {
    APARTMENTS.push(generateApartment(AVATAR_LINKS, OFFER_TITLES, AVATAR_COORDINATE_X_MIN, AVATAR__COORDINATE_X_MAX, AVATAR__COORDINATE_Y_MIN, AVATAR__COORDINATE_Y_MAX, APARTMENT_PRICE_MIN, APARTMENT_PRICE_MAX, APARTMENT_TYPES, ROOMS_AMOUNT_MIN, ROOMS_AMOUNT_MAX, GUESTS_AMOUNT_MIN, GUESTS_AMOUNT_MAX, CHECK_POINTS, APARTMENT_FEATURES, APARTMENT_PHOTOS));
  }
  renderPins();
  activateFilters();
}

function activateForm() {
  // Убираем затемнение формы
  form.classList.remove('ad-form--disabled');

  // Разблокировка полей формы
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = false;
  }

}

function generateAvatarLinks(avatarLinks, linksCount) {
  for (var i = 1; i <= linksCount; i++) {
    var link = 'img/avatars/user' + leadingZeroes(i, 2) + '.png';
    avatarLinks.push(link);
  }
  return avatarLinks;
}

function leadingZeroes(number, length) {
  var link = '' + number;
  while (link.length < length) {
    link = '0' + link;
  }
  return link;
}

var generateApartment = function (avatars, titles, topXmin, topXmax, topYmin, topYmax, minPrice, maxPrice, housingTypes, minRoomCount, maxRoomCount, minGuestsCount, maxGuestsCount, checkPoints, houseFeatures, housePhotos) {
  return {
    author: {
      avatar: getAndRemoveRandomElement(avatars),
    },
    offer: {
      title: getAndRemoveRandomElement(titles),
      address: getRandomIntegerFromRange(topXmin, topXmax) + ', ' + getRandomIntegerFromRange(topYmin, topYmax),
      price: getRandomIntegerFromRange(minPrice, maxPrice),
      type: housingTypes[getRandomIntegerFromRange(0, housingTypes.length - 1)],
      rooms: getRandomIntegerFromRange(minRoomCount, maxRoomCount),
      guests: getRandomIntegerFromRange(minGuestsCount, maxGuestsCount),
      checkin: checkPoints[getRandomIntegerFromRange(0, checkPoints.length - 1)],
      checkout: checkPoints[getRandomIntegerFromRange(0, checkPoints.length - 1)],
      features: generateRandomFeatures(houseFeatures),
      description: '',
      photos: shuffleArray(housePhotos),
    },
    location: {
      x: getRandomIntegerFromRange(topXmin, topXmax),
      y: getRandomIntegerFromRange(topYmin, topYmax),
    },
  };
};

var getAndRemoveRandomElement = function (array) {
  var indexRandom = getRandomIntegerFromRange(0, array.length - 1);
  var elementRandom = array[indexRandom];
  array.splice(indexRandom, 1);

  return elementRandom;
};

var getRandomIntegerFromRange = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var generateRandomFeatures = function (arr) {
  var newArr = [];
  var cloneArr = arr.slice(0);
  var randomArrLength = getRandomIntegerFromRange(1, arr.length);

  for (var i = 0; i < randomArrLength; i++) {
    var randomIndex = getRandomIntegerFromRange(0, cloneArr.length - 1);
    newArr.push(cloneArr[randomIndex]);
    cloneArr.splice(randomIndex, 1);
  }
  return newArr;
};

var shuffleArray = function (array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;
  while (currentIndex !== 0) {
    randomIndex = getRandomIntegerFromRange(0, array.length - 1);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

// Отрисовывает метки на карте

function renderPins() {
  cleanMap();

  var fragmentPin = document.createDocumentFragment();
  var similarPinElement = document.querySelector('.map__pins');

  for (var j = 0; j < APARTMENTS.length; j++) {
    fragmentPin.appendChild(generatePinImage(APARTMENTS[j], PICTURE_WIDTH, PICTURE_HEIGHT));
  }
  similarPinElement.appendChild(fragmentPin);
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
  renderCard(selectedPinData);
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


// Создает объявление по шаблону и вставляет в DOM

function renderCard(cardData) {
  // Удаляем открытую карточку
  var existingCard = document.querySelector('.map__card');
  if (existingCard) {
    existingCard.remove();
  }

  var fragmentPopup = document.createDocumentFragment();
  var MapTemplate = document.querySelector('.map');

  fragmentPopup.appendChild(generatePopupFragment(cardData));
  MapTemplate.appendChild(fragmentPopup);


  var popupFeaturesElement = document.querySelector('.popup__features');
  popupFeaturesElement.appendChild(generateFeaturesFragment(cardData));

  var popupElement = document.querySelector('.popup__photos');
  popupElement.appendChild(generatePhotosFragment(cardData));

  document.querySelector('.popup__close').addEventListener('click', closeCard);

  document.addEventListener('keydown', onEscPress);

}

function closeCard() {
  document.querySelector('.map__card').remove();
  document.querySelector('.map__pin--selected').classList.remove('map__pin--selected');
  document.removeEventListener('keydown', onEscPress);
}

function onEscPress(evt) {
  isEscEvent(evt, closeCard);
}

function isEscEvent(evt, action) {
  var ESC_KEYCODE = 27;
  if (evt.keyCode === ESC_KEYCODE) {
    action();
  }
}

var generatePopupFragment = function (firstApartment) {
  var similarPopupTemplate = document.querySelector('#card').content;
  var popupElement = similarPopupTemplate.cloneNode(true);
  popupElement.querySelector('.popup__avatar').setAttribute('src', firstApartment.author.avatar);
  popupElement.querySelector('.popup__title').textContent = firstApartment.offer.title;
  popupElement.querySelector('.popup__text--address').textContent = firstApartment.offer.address;
  popupElement.querySelector('.popup__text--price').innerHTML = firstApartment.offer.price + '₽/ночь';
  popupElement.querySelector('.popup__type').textContent = getOfferTypeInRussian(firstApartment.offer.type);
  popupElement.querySelector('.popup__text--capacity').textContent = firstApartment.offer.rooms + ' комнаты для ' + firstApartment.offer.guests + ' гостей';
  popupElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + firstApartment.offer.checkin + ', выезд до ' + firstApartment.offer.checkout;
  popupElement.querySelector('.popup__description').textContent = firstApartment.offer.description;

  return popupElement;
};

var generateFeaturesFragment = function (firstApartment) {
  var postTemplate = document.querySelector('.popup__features');
  postTemplate.innerHTML = ' ';

  var fragmentOfFeatures = document.createDocumentFragment();

  for (var i = 0; i < firstApartment.offer.features.length; i++) {
    var featureListItem = document.createElement('li');
    featureListItem.classList.add('popup__feature', 'popup__feature--' + firstApartment.offer.features[i]);
    fragmentOfFeatures.appendChild(featureListItem);
  }

  return fragmentOfFeatures;
};

var generatePhotosFragment = function (firstApartment) {
  var popupElement = document.querySelector('.popup__photos');
  var popupPhoto = document.querySelector('.popup__photo');

  var imagesList = popupElement.removeChild(popupPhoto);

  var fragmentOfPhotos = document.createDocumentFragment();

  for (var i = 0; i < firstApartment.offer.photos.length; i++) {
    imagesList.src = firstApartment.offer.photos[i];
    var elementPhoto = imagesList.cloneNode(true);
    fragmentOfPhotos.appendChild(elementPhoto);
  }
  return fragmentOfPhotos;
};

var getOfferTypeInRussian = function (type) {
  if (type === 'palace') {
    return 'Дворец';
  } else if (type === 'flat') {
    return 'Квартира';
  } else if (type === 'house') {
    return 'Дом';
  }
  return 'Бунгало';
};


// Нажатие на кнопку .form__reset сбрасывает страницу в исходное неактивное состояние:
var formReset = form.querySelector('.ad-form__reset');

formReset.addEventListener('click', function (evt) {
  evt.preventDefault();
  deactivateForm();
});

var typesAllowEnter = ['submit', 'reset', 'file'];
form.addEventListener('keydown', function (evt) {
  isEnterEvent(evt, function () {
    if (typesAllowEnter.indexOf(evt.target.type) === -1) {
      evt.preventDefault();
    }
  });
});

function isEnterEvent(evt, action) {
  var ENTER_KEYCODE = 13;
  if (evt.keyCode === ENTER_KEYCODE) {
    action();
  }
}

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

  deactivateMap();
  updateAddress(false);
}


// Переводит карту в неактивное состояние

function deactivateMap() {
  cleanMap();
  deactivateFilters();

  // MAP_MAIN_PIN.style.top = '';
  // MAP_MAIN_PIN.style.left = '';

  MAP_ELEMENT.classList.add('map--faded');
}

// Удаляет элементы из карты

function cleanMap() {
  cleanNode(MAP_ELEMENT, '.map__card');
  cleanNode(MAP_PINS_ELEMENT, '.map__pin:not(.map__pin--main)');
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

// Удаляет потомков из элемента

function cleanNode(parent, selector) {
  var children = [];
  if (selector) {
    children = parent.querySelectorAll(selector);
  } else {
    children = parent.children;
  }

  for (var i = children.length - 1; i >= 0; i--) {
    parent.removeChild(children[i]);
  }
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
    'palace': 10000
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

// Поле «Количество комнат» синхронизировано с полем «Количество гостей»,

var roomsSelect = form.querySelector('[name="rooms"]');
var capacitySelect = form.querySelector('[name="capacity"]');
var rulesRoomsCapacity = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
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

// Заполняем поле адреса после открытия страницы
updateAddress(false);
