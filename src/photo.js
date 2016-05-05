'use strict';
var imageTo = require('./pictures');
var utilities = require('./utilities');
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
 * @param {Node} element
 * @constructor
 */
var BaseComponent = function(element) {
  this.element = element;
};
BaseComponent.prototype.remove = function() {
  this.element.parentNode.removeChild(this.element);
};
/**
 * @param {Node} container
 */
BaseComponent.prototype.add = function(container) {
  container.appendChild(this.element);
};
/**
 * @param {Object} data
 * @param {Node} container
 * @constructor
 */
var Photo = function(data, container) {
  this.data = data;
  this.PhotoInfo = new PhotoInfo(data);
  BaseComponent.call(this, imageTo.getPictureElement(this.data));
  this.pictureLikes = this.element.querySelector('.picture-likes');
  BaseComponent.prototype.add.call(this, container);
  this.pictureLikes.addEventListener('click', this.likesClick.bind(this));
};
utilities.inherit(Photo, BaseComponent);
Photo.prototype.remove = function() {
  BaseComponent.prototype.remove.call(this);
  this.pictureLikes.removeEventListener('click', this.likesClick.bind(this));
};
Photo.prototype.likesClick = function(evt) {
  evt.preventDefault();
  this.PhotoInfo.setLikesCount(this.pictureLikes);
};
module.exports = Photo;

