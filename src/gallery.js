'use strict';

var galleryContainer = document.querySelector('.gallery-overlay');
var galleryContainerPreview = document.querySelector('.gallery-overlay-preview');

/** @type {number} */
var indexOfArray;

/**
 * функция закрытия галереи
 */
var hideGallery = function() {
  galleryContainer.classList.add('invisible');
  galleryContainer.removeEventListener('click', _onPhotoClick);
  document.removeEventListener('keydown', _onDocumentKeyDown);
};

/** @type {Array.<Object>} */
var galleryPictures = [];

/**
 * Показ следующей картинки и закрытие галереи при клике на черный оверлей и кнопку закрытия
 */
function _onPhotoClick(evt) {
  if (evt.target.classList.contains('gallery-overlay') || evt.target.classList.contains('gallery-overlay-close')) {
    hideGallery();
  } else {
    if (indexOfArray < galleryPictures.length - 1) {
      showGallery(++indexOfArray);
    }
  }
}
/**
 * Закрытие галереи при нажатии на ESC
 * @param {Event} evt
 */
function _onDocumentKeyDown(evt) {
  if(evt.keyCode === 27) {
    hideGallery();
  }
  if(evt.keyCode === 39) {
    if (indexOfArray < galleryPictures.length - 1) {
      showGallery(++indexOfArray);
    }
  }
  if(evt.keyCode === 37) {
    if (indexOfArray > 0) {
      showGallery(--indexOfArray);
    }
  }
}
/**
 * Показ галереи при клике на картинку
 * @param {number} index
 */
var showGallery = function(index) {
  indexOfArray = index;
  galleryContainer.classList.remove('invisible');
  var imgagePreview = galleryContainerPreview.querySelector('img');
  galleryContainerPreview.querySelector('.likes-count').textContent = galleryPictures[index].likes;
  galleryContainerPreview.querySelector('.comments-count').textContent = galleryPictures[index].comments;
  var galleryImage = new Image();
  var galleryLoadTimeout;

  galleryImage.onload = function() {
    clearTimeout(galleryLoadTimeout);
    galleryContainerPreview.replaceChild(galleryImage, imgagePreview);
  };
  galleryImage.src = galleryPictures[index].url;
  galleryImage.onerror = function() {
    galleryImage.src = '../img/file-not-found.jpg';
  };
  galleryLoadTimeout = setTimeout(function() {
    galleryImage.src = '';
  }, 10000);
  galleryContainer.addEventListener('click', _onPhotoClick);
  document.addEventListener('keydown', _onDocumentKeyDown);
};
var setPictureGallery = function(pictures) {
  galleryPictures = pictures;
};
module.exports = {
  showGallery: showGallery,
  setPictureGallery: setPictureGallery
};

