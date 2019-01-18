// Сообщение в модальном окне
'use strict';

(function () {
  var AVATAR_DEFAULT_SRC = 'img/muffin-grey.svg';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var ImageSize = {
    WIDTH: 70,
    HEIGHT: 70,
  };
  var avatarChooser = document.querySelector('#avatar');
  var imagesChooser = document.querySelector('#images');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var imagesContainer = document.querySelector('.ad-form__photo-container');
  var photoPreview = document.querySelector('.ad-form__photo');


  // Функция, отрисовывающая аватар
  function renderAvatar(src) {
    avatarPreview.src = src;
  }

  function renderImages(src) {
    var newPhotoPreview = photoPreview.cloneNode();
    var image = document.createElement('img');
    image.src = src;
    image.width = ImageSize.WIDTH;
    image.height = ImageSize.HEIGHT;
    newPhotoPreview.appendChild(image);
    imagesContainer.insertBefore(newPhotoPreview, photoPreview);
  }

  // Обработчик события для аватарки
  function avatarChangeHandler(evt) {
    displayImages(evt.target.files, renderAvatar, window.form.errorTemplate, window.form.errorElement);
  }

  // Обработчик события для фото жилья
  function imagesChangeHandler(evt) {
    displayImages(evt.target.files, renderImages, window.form.errorTemplate, window.form.errorElement);
  }

  // Функция, отображающая изображения на странице
  function displayImages(files, renderFunction, template, element) {
    Array.from(files).forEach(function (item) {
      var fileName = item.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });
      if (matches) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          renderFunction(reader.result);
        });

        reader.addEventListener('error', function () {
          window.messages.renderStatusMessage(template, element);
        });

        reader.readAsDataURL(item);
      }
    });
  }

  // Сброс всех добавленных на страницу изображений
  function resetImages(avatar, defaultAvatar) {
    var photos = document.querySelectorAll('.ad-form__photo:not(:last-child)');
    photos.forEach(function (item) {
      item.remove();
    });
    avatar.src = defaultAvatar;
  }


  imagesChooser.addEventListener('change', imagesChangeHandler);
  avatarChooser.addEventListener('change', avatarChangeHandler);

  window.images = {
    resetImages: resetImages,
    avatarPreview: avatarPreview,
    AVATAR_DEFAULT_SRC: AVATAR_DEFAULT_SRC
  };

})();
