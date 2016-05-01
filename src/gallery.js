'use strict';
var Gallery = function() {
  var self = this;
  this.galleryContainer = document.querySelector('.gallery-overlay');
  this.galleryContainerPreview = this.galleryContainer.querySelector('.gallery-overlay-preview');

  /** @type {number} */
  this.indexOfArray = 0;

  /**
   * функция закрытия галереи
   */
  this.hideGallery = function() {
    self.galleryContainer.classList.add('invisible');
    self.galleryContainer.removeEventListener('click', self._onPhotoClick);
    document.removeEventListener('keydown', self._onDocumentKeyDown);
  };

  /** @type {Array.<Object>} */
  this.galleryPictures = [];

  /**
   * Показ следующей картинки и закрытие галереи при клике на черный оверлей и кнопку закрытия
   */
  this._onPhotoClick = function(evt) {
    if (evt.target.classList.contains('gallery-overlay') || evt.target.classList.contains('gallery-overlay-close')) {
      location.hash = '';
    } else {
      if (self.indexOfArray < self.galleryPictures.length - 1) {
        location.hash = 'photo/' + self.galleryPictures[++self.indexOfArray].url;
      }
    }
  };
  /**
   * Закрытие галереи при нажатии на ESC
   * @param {Event} evt
   */
  this._onDocumentKeyDown = function(evt) {
    if(evt.keyCode === 27) {
      location.hash = '';
    }
    if(evt.keyCode === 39) {
      if (self.indexOfArray < self.galleryPictures.length - 1) {
        location.hash = 'photo/' + self.galleryPictures[++self.indexOfArray].url;
      }
    }
    if(evt.keyCode === 37) {
      if (self.indexOfArray > 0) {
        location.hash = 'photo/' + self.galleryPictures[--self.indexOfArray].url;
      }
    }
  };
  /**
   * Показ галереи при клике на картинку
   * @param {number} index
   */
  this.showGallery = function(_locatHash) {
    var index = 0;
    self.galleryPictures.forEach(function(galleryImage, i) {
      if (galleryImage.url === _locatHash) {
        index = i;
      }
    });
    self.indexOfArray = index;
    self.galleryContainer.classList.remove('invisible');
    var imgagePreview = self.galleryContainerPreview.querySelector('img');
    self.galleryContainerPreview.querySelector('.likes-count').textContent = self.galleryPictures[index].likes;
    self.galleryContainerPreview.querySelector('.comments-count').textContent = self.galleryPictures[index].comments;
    var galleryImage = new Image();
    var galleryLoadTimeout;

    galleryImage.onload = function() {
      clearTimeout(galleryLoadTimeout);
      self.galleryContainerPreview.replaceChild(galleryImage, imgagePreview);
    };
    galleryImage.src = self.galleryPictures[index].url;
    galleryImage.onerror = function() {
      galleryImage.src = '../img/file-not-found.jpg';
    };
    galleryLoadTimeout = setTimeout(function() {
      galleryImage.src = '';
    }, 10000);
    self.galleryContainer.addEventListener('click', self._onPhotoClick);
    document.addEventListener('keydown', self._onDocumentKeyDown);
  };
  this.setPictureGallery = function(pictures) {
    self.galleryPictures = pictures;
  };
  this.restoreFromHash = function() {
    var _locationHash = location.hash.match(/#photo\/(\S+)/);
    if(_locationHash !== null) {
      self.showGallery(_locationHash[1]);
    } else {
      self.hideGallery();
    }
  };
  this.hashChange = function() {
    self.restoreFromHash();
  };
  window.addEventListener('hashchange', this.hashChange);
};
module.exports = new Gallery();
