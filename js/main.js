'use strict';

var NUMBER_OF_APARTMENTS = 8;
var NUMBER_OF_FEATURES = 6;
var PIC_COORDINATE_X_MIN = 270;
var PIC_COORDINATE_X_MAX = 1100;
var PIC_COORDINATE_Y_MIN = 130;
var PIC_COORDINATE_Y_MAX = 630;
var APARTMENT_PRICE_MIN = 1000;
var APARTMENT_PRICE_MAX = 1000000;
var APARTMENT_ROOMS_MIN = 1;
var APARTMENT_ROOMS_MAX = 5;
var APARTMENT_GUESTS_MIN = 2;
var APARTMENT_GUESTS_MAX = 7;
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
var HOUSING_TYPES = [
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
var APPARTMENT_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];
var APPARTMENT_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
];
var PIC_WIDTH = 40;
var PIC_HEIGHT = 40;
var APPARTMENTS = [];


var getApartment = function (i) {
  return {
    author: {
      avatar: 'img/avatars/user0' + (i + 1) + '.png',
    },
    offer: {
      title: OFFER_TITLES[i],
      address: getRandomIntFromRange(PIC_COORDINATE_X_MIN, PIC_COORDINATE_X_MAX) + ', ' + getRandomIntFromRange(PIC_COORDINATE_Y_MIN, PIC_COORDINATE_Y_MAX),
      price: getRandomIntFromRange(APARTMENT_PRICE_MIN, APARTMENT_PRICE_MAX),
      type: HOUSING_TYPES[getRandomIntFromRange(0, HOUSING_TYPES.length - 1)],
      rooms: getRandomIntFromRange(APARTMENT_ROOMS_MIN, APARTMENT_ROOMS_MAX),
      guests: getRandomIntFromRange(APARTMENT_GUESTS_MIN, APARTMENT_GUESTS_MAX),
      checkin: CHECK_POINTS[getRandomIntFromRange(0, CHECK_POINTS.length - 1)],
      checkout: CHECK_POINTS[getRandomIntFromRange(0, CHECK_POINTS.length - 1)],
      features: getRandomApartmentFeatures(APPARTMENT_FEATURES),
      description: '',
      photos: shuffle(APPARTMENT_PHOTOS),
    },
    location: {
      x: getRandomIntFromRange(PIC_COORDINATE_X_MIN, PIC_COORDINATE_X_MAX),
      y: getRandomIntFromRange(PIC_COORDINATE_Y_MIN, PIC_COORDINATE_Y_MAX),
    },
  };
};
var getRandomIntFromRange = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getRandomApartmentFeatures = function (arr) {
  var newArr = [];
  var cloneArr = arr.slice(0);
  var randomArrLength = getRandomIntFromRange(1, arr.length);

  for (var m = 0; m < randomArrLength; m++) {
    var randomIndex = getRandomIntFromRange(0, cloneArr.length - 1);
    newArr.push(cloneArr[randomIndex]);
    cloneArr.splice(randomIndex, 1);
  }
  return newArr;
};

var shuffle = function (array) {
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

var showMap = function (hiddenBlock) {
  var setupDialog = document.querySelector(hiddenBlock);
  setupDialog.classList.remove('map--faded');
};

var similarPicElement = document.querySelector('.map__pins');
var similarPicTemplate = document.querySelector('#pin').content;
var renderPic = function (apartment) {
  var picElement = similarPicTemplate.cloneNode(true);
  picElement.querySelector('button').setAttribute('style', 'left: ' + (apartment.location.x - PIC_WIDTH / 2) + 'px; top: ' + (apartment.location.y - PIC_HEIGHT) + 'px;');
  picElement.querySelector('img').setAttribute('src', apartment.author.avatar);
  picElement.querySelector('img').setAttribute('alt', apartment.offer.title);
  return picElement;
};
var fragmentPic = document.createDocumentFragment();

var similarMapTemplate = document.querySelector('#card').content;
var MapTemplate = document.querySelector('.map');
var renderMap = function () {
  var mapElement = similarMapTemplate.cloneNode(true);
  mapElement.querySelector('.popup__avatar').setAttribute('src', APPARTMENTS[0].author.avatar);
  mapElement.querySelector('.popup__title').textContent = APPARTMENTS[0].offer.title;
  mapElement.querySelector('.popup__text--address').textContent = APPARTMENTS[0].offer.address;
  mapElement.querySelector('.popup__text--price').innerHTML = APPARTMENTS[0].offer.price + '₽/ночь';
  mapElement.querySelector('.popup__type').textContent = getOfferTypeInRussian(APPARTMENTS[0].offer.type);
  mapElement.querySelector('.popup__text--capacity').textContent = APPARTMENTS[0].offer.rooms + ' комнаты для ' + APPARTMENTS[0].offer.guests + ' гостей';
  mapElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + APPARTMENTS[0].offer.checkin + ', выезд до ' + APPARTMENTS[0].offer.checkout;
  mapElement.querySelector('.popup__description').textContent = APPARTMENTS[0].offer.description;
  var parentPhotoElement = mapElement.querySelector('.popup__photos');
  var popupPhoto = mapElement.querySelector('.popup__photo');
  parentPhotoElement.removeChild(popupPhoto);
  var parentFeaturesElement = mapElement.querySelector('.popup__features');
  var popapWifi = mapElement.querySelector('.popup__feature--wifi');
  var popapDishwasher = mapElement.querySelector('.popup__feature--dishwasher');
  var popapParking = mapElement.querySelector('.popup__feature--parking');
  var popapWasher = mapElement.querySelector('.popup__feature--washer');
  var popapElevator = mapElement.querySelector('.popup__feature--elevator');
  var popapConditioner = mapElement.querySelector('.popup__feature--conditioner');
  var renderPhoto = function (popupPhotoElement, apartment, i) {
    popupPhotoElement.setAttribute('src', apartment.offer.photos[i]);
    return popupPhotoElement.cloneNode(true);
  };

  var getPopapFeatures = function (feature) {
    var cloneElement;
    if (feature === 'wifi') {
      cloneElement = popapWifi;
    } else if (feature === 'dishwasher') {
      cloneElement = popapDishwasher;
    } else if (feature === 'parking') {
      cloneElement = popapParking;
    } else if (feature === 'washer') {
      cloneElement = popapWasher;
    } else if (feature === 'elevator') {
      cloneElement = popapElevator;
    } else {
      cloneElement = popapConditioner;
    }
    return parentFeaturesElement.appendChild(cloneElement.cloneNode(true));
  };

  for (var i = 0; i < APPARTMENT_PHOTOS.length; i++) {
    parentPhotoElement.appendChild(renderPhoto(popupPhoto, APPARTMENTS[0], i));
  }
  for (var j = NUMBER_OF_FEATURES; j > 0; j--) {
    var childrenFeatures = parentFeaturesElement.children[j - 1];
    childrenFeatures.remove();
  }
  for (var k = 0; k < APPARTMENTS[0].offer.features.length; k++) {
    getPopapFeatures(APPARTMENTS[0].offer.features[k]);
  }
  return mapElement;
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

var fragmentMap = document.createDocumentFragment();


for (var i = 0; i < NUMBER_OF_APARTMENTS; i++) {
  APPARTMENTS.push(getApartment(i));
}
showMap('.map');
for (var j = 0; j < APPARTMENTS.length; j++) {
  fragmentPic.appendChild(renderPic(APPARTMENTS[j]));
}
similarPicElement.appendChild(fragmentPic);
fragmentMap.appendChild(renderMap());
MapTemplate.appendChild(fragmentMap);
