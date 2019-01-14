// модуль, который создаёт данные;

'use strict';

(function () {

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

  function generateApartment(avatars, titles, topXmin, topXmax, topYmin, topYmax, minPrice, maxPrice, housingTypes, minRoomCount, maxRoomCount, minGuestsCount, maxGuestsCount, checkPoints, houseFeatures, housePhotos) {
    return {
      author: {
        avatar: window.utils.getAndRemoveRandomElement(avatars),
      },
      offer: {
        title: window.utils.getAndRemoveRandomElement(titles),
        address: window.utils.getRandomIntegerFromRange(topXmin, topXmax) + ', ' + window.utils.getRandomIntegerFromRange(topYmin, topYmax),
        price: window.utils.getRandomIntegerFromRange(minPrice, maxPrice),
        type: housingTypes[window.utils.getRandomIntegerFromRange(0, housingTypes.length - 1)],
        rooms: window.utils.getRandomIntegerFromRange(minRoomCount, maxRoomCount),
        guests: window.utils.getRandomIntegerFromRange(minGuestsCount, maxGuestsCount),
        checkin: checkPoints[window.utils.getRandomIntegerFromRange(0, checkPoints.length - 1)],
        checkout: checkPoints[window.utils.getRandomIntegerFromRange(0, checkPoints.length - 1)],
        features: generateRandomFeatures(houseFeatures),
        description: '',
        photos: shuffleArray(housePhotos),
      },
      location: {
        x: window.utils.getRandomIntegerFromRange(topXmin, topXmax),
        y: window.utils.getRandomIntegerFromRange(topYmin, topYmax),
      },
    };
  }

  var generateRandomFeatures = function (arr) {
    var newArr = [];
    var cloneArr = arr.slice(0);
    var randomArrLength = window.utils.getRandomIntegerFromRange(1, arr.length);

    for (var i = 0; i < randomArrLength; i++) {
      var randomIndex = window.utils.getRandomIntegerFromRange(0, cloneArr.length - 1);
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
      randomIndex = window.utils.getRandomIntegerFromRange(0, array.length - 1);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

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

  window.data = {
    generateAvatarLinks: generateAvatarLinks,
    generateApartment: generateApartment,
    generatePopupFragment: generatePopupFragment,
    generateFeaturesFragment: generateFeaturesFragment,
    generatePhotosFragment: generatePhotosFragment
  };

})();
