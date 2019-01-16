// Сообщение в модальном окне
'use strict';

(function () {
  // Создает сообщение об ошибке или успехе
  function renderStatusMessage(statusTemplate, statusElement) {

    var mainContainer = document.querySelector('main');
    var messageFragment = document.createDocumentFragment();
    var messageBlock = statusTemplate.cloneNode(true);

    messageFragment.appendChild(messageBlock);

    var statusBlock = messageFragment.querySelector(statusElement);

    mainContainer.insertBefore(statusBlock, mainContainer.firstChild);
    document.querySelector(statusElement).addEventListener('click', closeMessage);
    document.addEventListener('keydown', onEscPress);
    setTimeout(function () {
      mainContainer.firstChild.remove();
    }, 5000);

  }

  function closeMessage() {
    var container = document.querySelector('main');
    container.firstChild.remove();
    document.removeEventListener('keydown', onEscPress);
  }

  function onEscPress(evt) {
    window.utils.isEscEvent(evt, closeMessage);
  }

  window.messages = {
    renderStatusMessage: renderStatusMessage
  };

})();

