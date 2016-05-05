'use strict';

module.exports = {
  Filter: {
    'POPULAR': 'filter-popular',
    'NEW': 'filter-new',
    'DISCUSSED': 'filter-discussed'
  },
  /** @return {Array.<Object>} pictures */
  getFilteredPictures: function(image, filter) {
    var picturesToFilter = image.slice(0);
    switch (filter) {
      case this.Filter.DISCUSSED:
        picturesToFilter.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
      case this.Filter.NEW:
        picturesToFilter.sort(function(a, b) {
          return b.date - a.date;
        });
        break;
      case this.Filter.POPULAR:
        picturesToFilter.sort(function(a, b) {
          return b.likes - a.likes;
        });
        break;
      default:
        break;
    }
    return picturesToFilter;
  },

    /** @return {boolean} */
  isBottomReached: function() {
    var bodyElement = document.querySelector('body');
    var bodyPosition = bodyElement.getBoundingClientRect();
    return bodyPosition.bottom - window.innerHeight - 100 <= 0;
  },
  storageAvailable: function(type) {
    try {
      var storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch(e) {
      return false;
    }
  },
  /**
   * @param {Array} pictures
   * @param {number} page
   * @param {number} pageSize
   * @return {boolean}
   */
  isNextPageAvailable: function(pic, page, pageSize) {
    return page < Math.floor(pic.length / pageSize);
  },
  inherit: function(Child, Parent) {
    function Ctor() {}
    Ctor.prototype = Parent.prototype;
    Child.prototype = new Ctor();
  }
};

