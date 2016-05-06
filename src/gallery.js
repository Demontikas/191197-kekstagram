'use strict';
var Gallery = function() {
  this.galleryContainer = document.querySelector('.gallery-overlay');
  this.galleryContainerPreview = this.galleryContainer.querySelector('.gallery-overlay-preview');

  /** @type {number} */
  this.indexOfArray = 0;

  /** @type {Array.<Object>} */
  this.galleryPictures = [];
  window.addEventListener('hashchange', this.onHashChange.bind(this));
  this.galleryContainer.addEventListener('click', this._onPhotoClick.bind(this));
  document.addEventListener('keydown', this._onDocumentKeyDown.bind(this));
};
/**
 * Закрытие галереи при нажатии на ESC
 * @param {Event} evt
 */
Gallery.prototype._onDocumentKeyDown = function(evt) {
  if(evt.keyCode === 27) {
    this.forHide();
  }
  if(evt.keyCode === 39) {
    if (this.indexOfArray < this.galleryPictures.length - 1) {
      this.indexOfArray++;
      this.forShow(this.indexOfArray);
    }
  }
  if(evt.keyCode === 37) {
    if (this.indexOfArray > 0) {
      this.indexOfArray--;
      this.forShow(this.indexOfArray);
    }
  }
};
/**
 * Показ следующей картинки и закрытие галереи при клике на черный оверлей и кнопку закрытия
 */
Gallery.prototype._onPhotoClick = function(evt) {
  if (evt.target.classList.contains('gallery-overlay') || evt.target.classList.contains('gallery-overlay-close')) {
    this.forHide();
  } else if(evt.target.classList.contains('likes-count')) {
    window.dispatchEvent(new CustomEvent('clickLikes', {detail: { data: this.galleryPictures[this.indexOfArray]}}));
    evt.target.textContent = this.galleryPictures[this.indexOfArray].likes;
  } else if (this.indexOfArray < this.galleryPictures.length - 1) {
    this.indexOfArray++;
    this.forShow(this.indexOfArray);
  }
};
Gallery.prototype.forHide = function() {
  location.hash = '';
};
Gallery.prototype.forShow = function(index) {
  location.hash = 'photo/' + this.galleryPictures[index].url;
};
/**
 * функция закрытия галереи
 */
Gallery.prototype.hideGallery = function() {
  this.galleryContainer.classList.add('invisible');
  this.galleryContainer.removeEventListener('click', this._onPhotoClick);
  document.removeEventListener('keydown', this._onDocumentKeyDown);
};
Gallery.prototype.restoredHash = function() {
  var _locationHash = location.hash.match(/#photo\/(\S+)/);
  if ( _locationHash !== null) {
    this.showGallery(_locationHash[1]);
  } else {
    this.hideGallery();
  }
};
Gallery.prototype.onHashChange = function() {
  this.restoredHash();
};
Gallery.prototype.setPictureGallery = function(pictures) {
  this.galleryPictures = pictures;
};
/**
 * Показ галереи при клике на картинку
 * @param {string} _locatHash
 */
Gallery.prototype.showGallery = function(_locatHash) {
  var self = this;
  var index = 0;
  while(this.galleryPictures[index].url !== _locatHash) {
    index++;
  }
  this.indexOfArray = index;
  this.galleryContainer.classList.remove('invisible');
  var imgagePreview = this.galleryContainerPreview.querySelector('img');
  this.galleryContainerPreview.querySelector('.likes-count').textContent = this.galleryPictures[index].likes;
  this.galleryContainerPreview.querySelector('.comments-count').textContent = this.galleryPictures[index].comments;
  var galleryImage = new Image();
  var galleryLoadTimeout;

  galleryImage.onload = function() {
    clearTimeout(galleryLoadTimeout);
    self.galleryContainerPreview.replaceChild(galleryImage, imgagePreview);
  };
  galleryImage.src = this.galleryPictures[index].url;
  galleryImage.onerror = function() {
    galleryImage.src = '../img/file-not-found.jpg';
  };
  galleryLoadTimeout = setTimeout(function() {
    galleryImage.src = '';
  }, 10000);
};
module.exports = new Gallery();
