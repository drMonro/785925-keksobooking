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
var APARTMENTS = [];


var generateApartment = function (amount, titles, topXmin, topXmax, topYmin, topYmax, minPrice, maxPrice, housingTypes, minRoomCount, maxRoomCount, minGuestsCount, maxGuestsCount, checkPoints, houseFeatures, housePhotos) {
  return {
    author: {
      avatar: generateAvatarLink(amount),
    },
    offer: {
      title: getAndRemoveRandomTitle(titles),
      address: getRandomIntFromRange(topXmin, topXmax) + ', ' + getRandomIntFromRange(topYmin, topYmax),
      price: getRandomIntFromRange(minPrice, maxPrice),
      type: housingTypes[getRandomIntFromRange(0, housingTypes.length - 1)],
      rooms: getRandomIntFromRange(minRoomCount, maxRoomCount),
      guests: getRandomIntFromRange(minGuestsCount, maxGuestsCount),
      checkin: checkPoints[getRandomIntFromRange(0, checkPoints.length - 1)],
      checkout: checkPoints[getRandomIntFromRange(0, checkPoints.length - 1)],
      features: generateRandomFeatures(houseFeatures),
      description: '',
      photos: shuffleArray(housePhotos),
    },
    location: {
      x: getRandomIntFromRange(topXmin, topXmax),
      y: getRandomIntFromRange(topYmin, topYmax),
    },
  };
};

var generateAvatarLink = function (amount) {
  var DECADE = 8;
  return (amount > DECADE) ? 'img/avatars/user' + ++amount + '.png' : 'img/avatars/user0' + ++amount + '.png';
};

var getAndRemoveRandomTitle = function (array) {
  var indexRandom = getRandomIntFromRange(0, array.length - 1);
  var titleRandom = array[indexRandom];
  array.splice(indexRandom, 1);

  return titleRandom;
};

var getRandomIntFromRange = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var generateRandomFeatures = function (arr) {
  var newArr = [];
  var cloneArr = arr.slice(0);
  var randomArrLength = getRandomIntFromRange(1, arr.length);

  for (var i = 0; i < randomArrLength; i++) {
    var randomIndex = getRandomIntFromRange(0, cloneArr.length - 1);
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
    randomIndex = Math.floor(Math.random() * currentIndex);
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


for (var i = 0; i < APARTMENTS_AMOUNT; i++) {
  APARTMENTS.push(generateApartment(i, OFFER_TITLES, AVATAR_COORDINATE_X_MIN, AVATAR__COORDINATE_X_MAX, AVATAR__COORDINATE_Y_MIN, AVATAR__COORDINATE_Y_MAX, APARTMENT_PRICE_MIN, APARTMENT_PRICE_MAX, APARTMENT_TYPES, ROOMS_AMOUNT_MIN, ROOMS_AMOUNT_MAX, GUESTS_AMOUNT_MIN, GUESTS_AMOUNT_MAX, CHECK_POINTS, APARTMENT_FEATURES, APARTMENT_PHOTOS));
}

showMap();

var fragmentPin = document.createDocumentFragment();
var similarPinElement = document.querySelector('.map__pins');

for (var j = 0; j < APARTMENTS.length; j++) {
  fragmentPin.appendChild(generatePinImage(APARTMENTS[j], PICTURE_WIDTH, PICTURE_HEIGHT));
}
similarPinElement.appendChild(fragmentPin);


var fragmentPopup = document.createDocumentFragment();
var MapTemplate = document.querySelector('.map');

fragmentPopup.appendChild(generatePopupFragment(APARTMENTS[0]));
MapTemplate.appendChild(fragmentPopup);


var popupFeaturesElement = document.querySelector('.popup__features');
popupFeaturesElement.appendChild(generateFeaturesFragment(APARTMENTS[0]));


var popupElement = document.querySelector('.popup__photos');
popupElement.appendChild(generatePhotosFragment(APARTMENTS[0]));
