'use strict';

(function () {
  function isEscEvent(evt, action) {
    var ESC_KEYCODE = 27;
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  }

  function isEnterEvent(evt, action) {
    var ENTER_KEYCODE = 13;
    if (evt.keyCode === ENTER_KEYCODE) {
      action();
    }
  }

  // Удаляет потомков из элемента
  function cleanNode(parent, selector) {
    var children = [];
    if (selector) {
      children = parent.querySelectorAll(selector);
    } else {
      children = parent.children;
    }

    for (var i = children.length - 1; i >= 0; i--) {
      parent.removeChild(children[i]);
    }
  }

  function getFileUrl(file, cb) {
    var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        cb(reader.result);
      });

      reader.readAsDataURL(file);
    }
  }

  window.utils = {
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    getFileUrl: getFileUrl,
    cleanNode: cleanNode
  };
})();
