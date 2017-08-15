//  Copyright (C) 2011 Matsukei Co.,Ltd.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

goog.provide('thin.core.ImageFile');

goog.require('goog.Disposable');


/**
 * @param {string} data DataURI data
 * @constructor
 * @extends {goog.Disposable}
 *
 * FIXME: The appropriate class name is `thin.core.Image`
 */
thin.core.ImageFile = function(data) {
  /**
   * @type {string}
   * @private
   */
  this.data_ = data;

  this.initSize_();
  goog.base(this);
};
goog.inherits(thin.core.ImageFile, goog.Disposable);


/**
 * @type {number}
 * @private
 */
thin.core.ImageFile.prototype.width_;


/**
 * @type {number}
 * @private
 */
thin.core.ImageFile.prototype.height_;


/**
 * @param {Object.<Function>} callbacks
 */
thin.core.ImageFile.openDialog = function(callbacks) {
  thin.callAppHandler('imageOpen', {
    onSuccess: function (loadedData) {
      var image = new thin.core.ImageFile(/** @type {string} */(loadedData));
      callbacks.success(image);
    },
    onCancel: function () {
      callbacks.cancel();
    }
  });
};


thin.core.ImageFile.prototype.initSize_ = function() {
  var tmpImg = new Image();
  tmpImg.src = this.data_;

  this.width_ = tmpImg.width;
  this.height_ = tmpImg.height;

  tmpImg = null;
};


/**
 * @return {number}
 */
thin.core.ImageFile.prototype.getWidth = function() {
  return this.width_;
};


/**
 * @return {number}
 */
thin.core.ImageFile.prototype.getHeight = function() {
  return this.height_;
};


/**
 * @return {string?}
 */
thin.core.ImageFile.prototype.getContent = function() {
  return this.data_;
};


/**
 * @return {thin.core.ImageFile}
 */
thin.core.ImageFile.prototype.clone = function() {
  return new thin.core.ImageFile(this.data_);
};


/** @inheritDoc */
thin.core.ImageFile.prototype.disposeInternal = function() {
  this.data_ = null;
  goog.base(this, 'disposeInternal');
};
