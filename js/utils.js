'use strict';

(function () {

  function isSomeEvent(evt, codeOfKey, action) {
    if (evt.keyCode === codeOfKey) {
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
    isSomeEvent: isSomeEvent,
    cleanNode: cleanNode
  };
})();
