'use strict';
var imageTo = require('./pictures');
/**
 * @param {Object} data
 * @constructor
 */
var PhotoInfo = function(data) {
  this.setLikesCount = function(element) {
    element.textContent = ++data.likes;
  };
};
/**
 * @param {Object} data
 * @param {Node} container
 * @constructor
 */
var Photo = function(data, container) {
  this.data = data;
  this.PhotoInfo = new PhotoInfo(data);
  this.element = imageTo.getPictureElement(this.data, container);
  this.pictureLikes = this.element.querySelector('.picture-likes');
  this.container = container;
  this.container.appendChild(this.element);
  this.pictureLikes.addEventListener('click', this.likesClick.bind(this));
};
Photo.prototype.remove = function() {
  this.container.removeChild(this.element);
  this.pictureLikes.removeEventListener('click', this.likesClick.bind(this));
};
Photo.prototype.likesClick = function(evt) {
  evt.preventDefault();
  this.PhotoInfo.setLikesCount(this.pictureLikes);
};
module.exports = Photo;

