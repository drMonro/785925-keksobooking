'use strict';

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
var COORDINATE_SHIFT_X = 31;
var COORDINATE_SHIFT_Y = 44;
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
var AVATAR_LINKS = [];
var APARTMENTS = [];


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

var showMap = function () {
  var setupDialog = document.querySelector('.map');
  setupDialog.classList.remove('map--faded');
};

var similarPinTemplate = document.querySelector('#pin').content;

var generatePinImage = function (apartments, pictureWidth, pictureHeight) {
  var pinImage = similarPinTemplate.cloneNode(true);
  pinImage.querySelector('button').setAttribute('style', 'left: ' + (apartments.location.x - pictureWidth / 2) + 'px; top: ' + (apartments.location.y - pictureHeight) + 'px;');
  pinImage.querySelector('img').setAttribute('src', apartments.author.avatar);
  pinImage.querySelector('img').setAttribute('alt', apartments.offer.title);

  return pinImage;
};

var similarPopupTemplate = document.querySelector('#card').content;

var generatePopupFragment = function (firstApartment) {
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


var addDisabledAttribute = function (selector) {
  var elementDisabled = document.querySelectorAll(selector);
  for (var i = 0; i < elementDisabled.length; i++) {
    elementDisabled[i].disabled = true;
  }

  return elementDisabled;
};

var removeDisabledAttribute = function (selector) {
  var elementEnabled = document.querySelectorAll(selector);
  for (var i = 0; i < elementEnabled.length; i++) {
    elementEnabled[i].disabled = false;
  }
  return elementEnabled;
};

var calculateMainPinCoordinate = function (mainPin) {
  var coordinates = {};
  coordinates.x = Math.round(mainPin.offsetLeft + COORDINATE_SHIFT_X);
  coordinates.y = Math.round(mainPin.offsetTop + COORDINATE_SHIFT_Y);
  return coordinates;
};

var writeCoordinateToAddressField = function (mainPin) {
  var addressField = document.getElementById('address');
  addressField.value = calculateMainPinCoordinate(mainPin).x + ', ' + calculateMainPinCoordinate(mainPin).y;
  return addressField;
};

var removeClass = function (selector, removableClass) {
  var element = document.querySelector(selector);
  element.classList.remove(removableClass);
  return element;
};

var switchToActiveMode = function () {
  var mapPin = document.querySelector('.map__pin--main');

  showMap();
  removeClass('.ad-form', 'ad-form--disabled');
  removeDisabledAttribute('.ad-form-header');
  removeDisabledAttribute('.ad-form__element');
  removeDisabledAttribute('.map__filter');
  removeDisabledAttribute('.map__features');
  mapPin.removeEventListener('mouseup', switchToActiveMode);

  var fragmentPin = document.createDocumentFragment();
  var similarPinElement = document.querySelector('.map__pins');

  for (var j = 0; j < APARTMENTS.length; j++) {
    fragmentPin.appendChild(generatePinImage(APARTMENTS[j], PICTURE_WIDTH, PICTURE_HEIGHT));
  }
  similarPinElement.appendChild(fragmentPin);


  // Создаю массив со всеми пинами
  var popupOpenPins = document.querySelectorAll('.map__pin');

  // Навешиваю обработчик на каждый элемент массива.
  // Здесь у меня видимо проавал в теории - грызу https://learn.javascript.ru/events-and-interfaces
  for (var k = 0; k < popupOpenPins.length; k++) {
    popupOpenPins[k].addEventListener('click', showCheckedPopup(APARTMENTS[k]));
  }
};

var showCheckedPopup = function (focusedApartment) {

  var fragmentPopup = document.createDocumentFragment();
  var MapTemplate = document.querySelector('.map');

  fragmentPopup.appendChild(generatePopupFragment(focusedApartment));
  MapTemplate.appendChild(fragmentPopup);


  var popupFeaturesElement = document.querySelector('.popup__features');
  popupFeaturesElement.appendChild(generateFeaturesFragment(focusedApartment));

  var popupElement = document.querySelector('.popup__photos');
  popupElement.appendChild(generatePhotosFragment(focusedApartment));
};


generateAvatarLinks(AVATAR_LINKS, APARTMENTS_AMOUNT);

for (var i = 0; i < APARTMENTS_AMOUNT; i++) {
  APARTMENTS.push(generateApartment(AVATAR_LINKS, OFFER_TITLES, AVATAR_COORDINATE_X_MIN, AVATAR__COORDINATE_X_MAX, AVATAR__COORDINATE_Y_MIN, AVATAR__COORDINATE_Y_MAX, APARTMENT_PRICE_MIN, APARTMENT_PRICE_MAX, APARTMENT_TYPES, ROOMS_AMOUNT_MIN, ROOMS_AMOUNT_MAX, GUESTS_AMOUNT_MIN, GUESTS_AMOUNT_MAX, CHECK_POINTS, APARTMENT_FEATURES, APARTMENT_PHOTOS));
}


addDisabledAttribute('.ad-form-header');
addDisabledAttribute('.ad-form__element');
addDisabledAttribute('.map__filter');
addDisabledAttribute('.map__features');


var mainMapPin = document.querySelector('.map__pin--main');

writeCoordinateToAddressField(mainMapPin);

//  Переход в активное состояние
window.mainMapPin.addEventListener('mouseup', switchToActiveMode);

