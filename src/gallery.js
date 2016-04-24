'use strict';

var galleryContainer = document.querySelector('.gallery-overlay');
var galleryContainerClose = galleryContainer.querySelector('.gallery-overlay-close');
var galleryContainerPreview = document.querySelector('.gallery-overlay-preview');

/** @type {number} */
var indexOfArray;

/**
 * функция закрытия галереи
 */
var hideGallery = function() {
  galleryContainerPreview.classList.remove('pictures-failure');
  galleryContainer.classList.add('invisible');
};

/** @type {Array.<Object>} */
var galleryPictures = [];

/**
 * Показ следующей картинки
 */
galleryContainerPreview.addEventListener('click', function(evt) {
  evt.stopPropagation();
  if (indexOfArray < galleryPictures.length - 1) {
    galleryContainerPreview.classList.remove('pictures-failure');
    showGallery(++indexOfArray);
  }
});
/**
 * Закрытие галереи при клике на черный оверлей
 */
galleryContainer.addEventListener('click', function() {
  hideGallery();
});
/**
 * Закрытие галереи при клике на кнопку закрытия
 */
galleryContainerClose.addEventListener('click', function() {
  hideGallery();
});
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
    galleryImage.src = '../img/icon-warning.png';
    galleryImage.width = 400;
    galleryImage.height = 400;
    galleryContainerPreview.classList.add('pictures-failure');
  };
  galleryLoadTimeout = setTimeout(function() {
    galleryImage.src = '';
    galleryContainerPreview.classList.add('pictures-failure');
  }, 10000);
};
var setPictureGallery = function(pictures) {
  galleryPictures = pictures;
};
module.exports = {
  showGallery: showGallery,
  setPictureGallery: setPictureGallery
};

