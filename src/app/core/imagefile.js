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
goog.require('thin.File');
goog.require('thin.platform');
goog.require('thin.platform.File');


/**
 * @param {thin.File} file
 * @constructor
 * @extends {goog.Disposable}
 */
thin.core.ImageFile = function(file) {
  this.file_ = file;
  this.setSize();

  goog.base(this);
};
goog.inherits(thin.core.ImageFile, goog.Disposable);


/**
 * @type {Array.<string>}
 * @private
 */
thin.core.ImageFile.EXT_NAME_ = ['jpg', 'png'];


/**
 * @type {string}
 * @private
 */
thin.core.ImageFile.EXT_DESCRIPTION_ = 'Images';


/**
 * @type {Array.<string>}
 * @private
 */
thin.core.ImageFile.MIMETYPE_ = ['image/jpeg', 'image/png'];


/**
 * @type {Array.<Object>}
 * @private
 */
thin.core.ImageFile.ACCEPTS_ = [{
  'extensions': thin.core.ImageFile.EXT_NAME_,
  'description': thin.core.ImageFile.EXT_DESCRIPTION_,
  'mimeTypes': thin.core.ImageFile.MIMETYPE_
}];


/**
 * @type {thin.File}
 * @private
 */
thin.core.ImageFile.prototype.file_;


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
  thin.platform.File.open(thin.core.ImageFile.ACCEPTS_, {
    success: function(entry) {
      thin.core.ImageFile.handleSelectFileToOpen(callbacks, entry);
    },
    cancel: function() {
      thin.core.ImageFile.handleCancelFileToOpen(callbacks);
    },
    error: goog.nullFunction
  });
};


/**
 * @param {Object.<Function>} callbacks
 */
thin.core.ImageFile.handleCancelFileToOpen = function(callbacks) {
  callbacks.cancel();
};


/**
 * @param {Object.<Function>} callbacks
 * @param {FileEntry} entry
 */
thin.core.ImageFile.handleSelectFileToOpen = function(callbacks, entry) {
  entry.file(function(file) {
    var fileReader = new FileReader();
    fileReader.onload = function(e) {
      thin.platform.File.getPath(entry, function(path) {
        var coreFile = new thin.File(entry, path, e.target.result);
        callbacks.success(new thin.core.ImageFile(coreFile));
      });
    };
    fileReader.onerror = callbacks.error;
    fileReader.readAsDataURL(file);
  });
};


/**
 * @return {string}
 */
thin.core.ImageFile.prototype.getPath = function() {
  return this.file_.getPath();
};


thin.core.ImageFile.prototype.setSize = function() {
  var tmpImg = new Image();
  tmpImg.src = this.file_.getContent();

  this.width_ = tmpImg.width;
  this.height_ = tmpImg.height;

  // cannot be deleted in ES5 strict mode
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
  return this.file_.getContent();
};


/**
 * @return {thin.core.ImageFile}
 */
thin.core.ImageFile.prototype.clone = function() {
  return new thin.core.ImageFile(this.file_.clone());
};


/** @inheritDoc */
thin.core.ImageFile.prototype.disposeInternal = function() {
  this.file_.dispose();
  delete this.file_;

  goog.base(this, 'disposeInternal');
};
