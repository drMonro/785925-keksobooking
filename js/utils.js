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

  window.utils = {
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    cleanNode: cleanNode
  };
})();
