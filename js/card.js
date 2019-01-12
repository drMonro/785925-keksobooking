// модуль, который отвечает за создание карточки объявлений
'use strict';

(function () {

  // Создает объявление по шаблону и вставляет в DOM

  function renderCard(cardData) {
    // Удаляем открытую карточку
    var existingCard = document.querySelector('.map__card');
    if (existingCard) {
      existingCard.remove();
    }

    var fragmentPopup = document.createDocumentFragment();
    var MapTemplate = document.querySelector('.map');

    fragmentPopup.appendChild(window.data.generatePopupFragment(cardData));
    MapTemplate.appendChild(fragmentPopup);


    var popupFeaturesElement = document.querySelector('.popup__features');
    popupFeaturesElement.appendChild(window.data.generateFeaturesFragment(cardData));

    var popupElement = document.querySelector('.popup__photos');
    popupElement.appendChild(window.data.generatePhotosFragment(cardData));

    document.querySelector('.popup__close').addEventListener('click', closeCard);

    document.addEventListener('keydown', onEscPress);

  }

  function closeCard() {
    document.querySelector('.map__card').remove();
    document.querySelector('.map__pin--selected').classList.remove('map__pin--selected');
    document.removeEventListener('keydown', onEscPress);
  }

  function onEscPress(evt) {
    window.utils.isEscEvent(evt, closeCard);
  }

  window.card = {
    renderCard: renderCard
  };

})();
