// модуль, который создаёт данные;
'use strict';

(function () {
  function generatePopupFragment(apartment) {
    var similarPopupTemplate = document.querySelector('#card').content;
    var popupElement = similarPopupTemplate.cloneNode(true);
    popupElement.querySelector('.popup__avatar').setAttribute('src', apartment.author.avatar);
    popupElement.querySelector('.popup__title').textContent = apartment.offer.title;
    popupElement.querySelector('.popup__text--address').textContent = apartment.offer.address;
    popupElement.querySelector('.popup__text--price').innerHTML = apartment.offer.price + '₽/ночь';
    popupElement.querySelector('.popup__type').textContent = getOfferTypeInRussian(apartment.offer.type);
    popupElement.querySelector('.popup__text--capacity').textContent = apartment.offer.rooms + ' комнаты для ' + apartment.offer.guests + ' гостей';
    popupElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + apartment.offer.checkin + ', выезд до ' + apartment.offer.checkout;
    popupElement.querySelector('.popup__description').textContent = apartment.offer.description;

    return popupElement;
  }

  function generateFeaturesFragment(apartment) {
    var postTemplate = document.querySelector('.popup__features');
    postTemplate.innerHTML = '';

    var fragmentOfFeatures = document.createDocumentFragment();

    apartment.offer.features.forEach(function (feature, i) {
      var featureListItem = document.createElement('li');
      featureListItem.classList.add('popup__feature', 'popup__feature--' + apartment.offer.features[i]);
      fragmentOfFeatures.appendChild(featureListItem);
    });

    return fragmentOfFeatures;
  }

  function generatePhotoFragment(apartment) {
    var popupElement = document.querySelector('.popup__photos');
    var popupPhoto = document.querySelector('.popup__photo');

    var imagesList = popupElement.removeChild(popupPhoto);

    var fragmentOfPhotos = document.createDocumentFragment();

    apartment.offer.photos.forEach(function (photo, i) {
      imagesList.src = apartment.offer.photos[i];
      var elementPhoto = imagesList.cloneNode(true);
      fragmentOfPhotos.appendChild(elementPhoto);
    });

    return fragmentOfPhotos;
  }

  function getOfferTypeInRussian(type) {
    if (type === 'palace') {
      return 'Дворец';
    } else if (type === 'flat') {
      return 'Квартира';
    } else if (type === 'house') {
      return 'Дом';
    }
    return 'Бунгало';
  }

  window.data = {
    generatePopupFragment: generatePopupFragment,
    generateFeaturesFragment: generateFeaturesFragment,
    generatePhotoFragment: generatePhotoFragment,
  };

})();
