// Сообщение в модальном окне
'use strict';

(function () {
  window.statusMessage = function (statusTemplate, statusBlock) {
    var fragment = document.createDocumentFragment();
    var statusElement = statusTemplate.cloneNode(true);

    fragment.appendChild(statusElement);

    var statusFragment = fragment.querySelector(statusBlock);

    statusFragment.addEventListener('click', function (evt) {
      evt.currentTarget.remove();
    });

    document.querySelector('main').appendChild(statusFragment);

    setTimeout(function () {
      document.querySelector(statusBlock).remove();
    }, 5000);
  };
})();
