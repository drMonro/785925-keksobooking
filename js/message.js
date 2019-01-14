
// Сообщение в модальном окне
'use strict';

(function () {
  window.successMessage = function () {
    var successTemplate = document.querySelector('#success').content;

    var fragment = document.createDocumentFragment();
    var successElement = successTemplate.cloneNode(true);

    fragment.appendChild(successElement);

    var success = fragment.querySelector('.success');

    success.addEventListener('click', function (evt) {
      evt.currentTarget.remove();
    });

    document.querySelector('main').appendChild(fragment);

    setTimeout(function () {
      document.querySelector('.success').remove();
    }, 5000);

  };

  window.errorMessage = function () {
    var successTemplate = document.querySelector('#error').content;

    var fragment = document.createDocumentFragment();
    var successElement = successTemplate.cloneNode(true);

    fragment.appendChild(successElement);

    var success = fragment.querySelector('.error');

    success.addEventListener('click', function (evt) {
      evt.currentTarget.remove();
    });

    document.querySelector('main').appendChild(fragment);

    setTimeout(function () {
      document.querySelector('.error').remove();
    }, 5000);

  };
})();
