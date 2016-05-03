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

  this.forHide = function() {
    location.hash = '';
  }
  this.forShow = function(index) {
    location.hash = 'photo/' + self.galleryPictures[index].url;
  }
  /**
   * Показ следующей картинки и закрытие галереи при клике на черный оверлей и кнопку закрытия
   */
  this._onPhotoClick = function(evt) {
    if (evt.target.classList.contains('gallery-overlay') || evt.target.classList.contains('gallery-overlay-close')) {
      self.forHide();
    } else {
      if (self.indexOfArray < self.galleryPictures.length - 1) {
        self.forShow(++self.indexOfArray);
      }
    }
  };
  /**
   * Закрытие галереи при нажатии на ESC
   * @param {Event} evt
   */
  this._onDocumentKeyDown = function(evt) {
    if(evt.keyCode === 27) {
      self.forHide();
    }
    if(evt.keyCode === 39) {
      if (self.indexOfArray < self.galleryPictures.length - 1) {
        self.forShow(++self.indexOfArray);
      }
    }
    if(evt.keyCode === 37) {
      if (self.indexOfArray > 0) {
        self.forShow(--self.indexOfArray);
      }
    }
  };
  /**
   * Показ галереи при клике на картинку
   * @param {string} _locatHash
   */
  this.showGallery = function(_locatHash) {
    var index = 0;
    while(this.galleryPictures[index].url !== _locatHash) {
      index++;
    }
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
  this.restoredHash = function() {
    var _locationHash = location.hash.match(/#photo\/(\S+)/);
    if ( _locationHash !== null) {
      self.showGallery(_locationHash[1]);
    } else {
      self.hideGallery();
    }
  };
  this.onHashChange = function() {
    self.restoredHash();
  };
  window.addEventListener('hashchange', this.onHashChange);
};
module.exports = new Gallery();
