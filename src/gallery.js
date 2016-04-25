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
};

/** @type {Array.<Object>} */
var galleryPictures = [];

/**
 * Показ следующей картинки
 */
galleryContainerPreview.addEventListener('click', function() {
  if (indexOfArray < galleryPictures.length - 1) {
    showGallery(++indexOfArray);
  }
});
/**
 * Закрытие галереи при клике на черный оверлей и кнопку закрытия
 */
galleryContainer.addEventListener('click', function() {
  hideGallery();
}, true);
/**
 * Закрытие галереи при нажатии на ESC
 */
document.addEventListener('keydown', function(evt) {
  if(evt.keyCode === 27) {
    hideGallery();
  }
});
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
};
var setPictureGallery = function(pictures) {
  galleryPictures = pictures;
};
module.exports = {
  showGallery: showGallery,
  setPictureGallery: setPictureGallery
};

