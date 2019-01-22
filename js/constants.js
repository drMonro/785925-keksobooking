'use strict';

(function () {
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

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var MAIN_PIN_HEIGHT = 82;
  var MAIN_PIN_WIDTH = 62;
  var MAP_WIDTH = 1200;

  var FLAT_PRICE = 1000;
  var HOUSE_PRICE = 5000;
  var PALACE_PRICE = 10000;
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 10000;

  window.constants = {
    AVATAR_LINKS: AVATAR_LINKS,
    APARTMENTS: APARTMENTS,
    APARTMENTS_AMOUNT: APARTMENTS_AMOUNT,
    AVATAR_COORDINATE_X_MIN: AVATAR_COORDINATE_X_MIN,
    AVATAR__COORDINATE_X_MAX: AVATAR__COORDINATE_X_MAX,
    AVATAR__COORDINATE_Y_MIN: AVATAR__COORDINATE_Y_MIN,
    AVATAR__COORDINATE_Y_MAX: AVATAR__COORDINATE_Y_MAX,
    APARTMENT_PRICE_MIN: APARTMENT_PRICE_MIN,
    APARTMENT_PRICE_MAX: APARTMENT_PRICE_MAX,
    ROOMS_AMOUNT_MIN: ROOMS_AMOUNT_MIN,
    ROOMS_AMOUNT_MAX: ROOMS_AMOUNT_MAX,
    GUESTS_AMOUNT_MIN: GUESTS_AMOUNT_MIN,
    GUESTS_AMOUNT_MAX: GUESTS_AMOUNT_MAX,
    OFFER_TITLES: OFFER_TITLES,
    APARTMENT_TYPES: APARTMENT_TYPES,
    CHECK_POINTS: CHECK_POINTS,
    APARTMENT_FEATURES: APARTMENT_FEATURES,
    APARTMENT_PHOTOS: APARTMENT_PHOTOS,
    MAIN_PIN_HEIGHT: MAIN_PIN_HEIGHT,
    MAIN_PIN_WIDTH: MAIN_PIN_WIDTH,
    MAP_WIDTH: MAP_WIDTH,
    FLAT_PRICE: FLAT_PRICE,
    HOUSE_PRICE: HOUSE_PRICE,
    PALACE_PRICE: PALACE_PRICE,
    LOW_PRICE: LOW_PRICE,
    HIGH_PRICE: HIGH_PRICE,
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE
  };

})();
