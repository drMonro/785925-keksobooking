// Создает сообщение об ошибке или успехе
'use strict';

(function () {
  function renderStatusMessage(template, element) {
    var mainContainer = document.querySelector('main');
    var messageFragment = document.createDocumentFragment();
    var messageElement = template.cloneNode(true);

    messageFragment.appendChild(messageElement);

    var statusElement = messageFragment.querySelector(element);

    mainContainer.insertBefore(statusElement, mainContainer.firstChild);
    document.querySelector(element).addEventListener('click', closeMessage);
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
    window.utils.isSomeEvent(evt, window.constants.ESC_KEYCODE, closeMessage);
  }

  window.messages = {
    renderStatusMessage: renderStatusMessage
  };

})();

