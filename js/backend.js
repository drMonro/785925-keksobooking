// Модуль для загрузки и отправки данных
'use strict';

(function () {
  function load(onLoad, onError, timeout, status, url) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = timeout;

    xhr.addEventListener('load', function () {
      if (xhr.status === status) {
        onLoad(xhr.response);
      } else {
        onError('Данные не загрузились. Причина: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open('GET', url);
    xhr.send();
  }

  function save(data, onLoad, onError, timeout, status, url) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = timeout;

    xhr.addEventListener('load', function () {
      if (xhr.status === status) {
        onLoad();
      } else {
        onError('Данные не сохранились. Причина: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open('POST', url);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    save: save,
  };
})();
