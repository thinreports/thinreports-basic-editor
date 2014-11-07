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

goog.provide('thin.editor.ImageFile');

goog.require('goog.Disposable');
goog.require('thin.core.File');
goog.require('thin.core.platform');
goog.require('thin.core.platform.File');


/**
 * @param {thin.core.File} file
 * @constructor
 * @extends {goog.Disposable}
 */
thin.editor.ImageFile = function(file) {
  this.file_ = file;
  this.setSize();

  goog.base(this);
};
goog.inherits(thin.editor.ImageFile, goog.Disposable);


/**
 * @type {Array.<string>}
 * @private
 */
thin.editor.ImageFile.EXT_NAME_ = ['jpg', 'png'];


/**
 * @type {string}
 * @private
 */
thin.editor.ImageFile.EXT_DESCRIPTION_ = 'Images';


/**
 * @type {Array.<string>}
 * @private
 */
thin.editor.ImageFile.MIMETYPE_ = ['image/jpeg', 'image/png'];


/**
 * @type {Array.<Object>}
 * @private
 */
thin.editor.ImageFile.ACCEPTS_ = [{
  'extensions': thin.editor.ImageFile.EXT_NAME_,
  'description': thin.editor.ImageFile.EXT_DESCRIPTION_,
  'mimeTypes': thin.editor.ImageFile.MIMETYPE_
}];


/**
 * @type {thin.core.File}
 * @private
 */
thin.editor.ImageFile.prototype.file_;


/**
 * @type {number}
 * @private
 */
thin.editor.ImageFile.prototype.width_;


/**
 * @type {number}
 * @private
 */
thin.editor.ImageFile.prototype.height_;


/**
 * @param {Object.<Function>} callbacks
 */
thin.editor.ImageFile.openDialog = function(callbacks) {
  thin.core.platform.File.open(thin.editor.ImageFile.ACCEPTS_, {
    success: function(entry) {
      thin.editor.ImageFile.handleSelectFileToOpen(callbacks, entry);
    },
    cancel: function() {
      thin.editor.ImageFile.handleCancelFileToOpen(callbacks);
    },
    error: goog.nullFunction
  });
};


/**
 * @param {Object.<Function>} callbacks
 */
thin.editor.ImageFile.handleCancelFileToOpen = function(callbacks) {
  callbacks.cancel();
};


/**
 * @param {Object.<Function>} callbacks
 * @param {FileEntry} entry
 */
thin.editor.ImageFile.handleSelectFileToOpen = function(callbacks, entry) {
  entry.file(function(file) {
    var fileReader = new FileReader();
    fileReader.onload = function(e) {
      thin.core.platform.File.getPath(entry, function(path) {
        var coreFile = new thin.core.File(entry, path, e.target.result);
        callbacks.success(new thin.editor.ImageFile(coreFile));
      });
    };
    fileReader.onerror = callbacks.error;
    fileReader.readAsDataURL(file);
  });
};


/**
 * @param {Element} element
 * @return {thin.editor.ImageFile}
 */
thin.editor.ImageFile.createFromElement = function(element) {
  var entry = thin.core.File.createDummyEntry('DummyImageFile');
  var coreFile = new thin.core.File(entry, '', element.href.baseVal);

  return new thin.editor.ImageFile(coreFile);
};


/**
 * @return {string}
 */
thin.editor.ImageFile.prototype.getPath = function() {
  return this.file_.getPath();
};


thin.editor.ImageFile.prototype.setSize = function() {
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
thin.editor.ImageFile.prototype.getWidth = function() {
  return this.width_;
};


/**
 * @return {number}
 */
thin.editor.ImageFile.prototype.getHeight = function() {
  return this.height_;
};


/**
 * @return {string?}
 */
thin.editor.ImageFile.prototype.getContent = function() {
  return this.file_.getContent();
};


/**
 * @return {thin.editor.ImageFile}
 */
thin.editor.ImageFile.prototype.clone = function() {
  return new thin.editor.ImageFile(this.file_.clone());
};


/** @inheritDoc */
thin.editor.ImageFile.prototype.disposeInternal = function() {
  this.file_.dispose();
  delete this.file_;

  goog.base(this, 'disposeInternal');
};
