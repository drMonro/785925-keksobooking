// модуль, который создаёт данные;
'use strict';

(function () {
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
    generatePopupFragment: generatePopupFragment,
    generateFeaturesFragment: generateFeaturesFragment,
    generatePhotosFragment: generatePhotosFragment
  };

})();
