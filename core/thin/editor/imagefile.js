//  Copyright (C) 2010 Matsukei Co.,Ltd.
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
goog.require('thin.core.File.Mode');
goog.require('thin.core.platform');
goog.require('thin.core.platform.File');
goog.require('thin.core.platform.Image');


/**
 * @param {thin.core.File} file
 * @constructor
 * @extends {goog.Disposable}
 */
thin.editor.ImageFile = function(file) {
  
  /**
   * @type {thin.core.File}
   * @private
   */
  this.file_ = file;

  goog.Disposable.call(this);
};
goog.inherits(thin.editor.ImageFile, goog.Disposable);


/**
 * @type {string}
 * @private
 */
thin.editor.ImageFile.lastPath_ = thin.core.File.HOME_PATH;


/**
 * @type {Array.<string>}
 * @private
 */
thin.editor.ImageFile.EXT_NAME_ = ['jpg', 'png'];


/**
 * @type {string}
 * @private
 */
thin.editor.ImageFile.EXT_DESCRIPTION_ = 'image file';


/**
 * @type {Array.<string>}
 * @private
 */
thin.editor.ImageFile.MIMETYPE_ = ['image/jpeg', 'image/png'];


/**
 * @type {string?}
 * @private
 */
thin.editor.ImageFile.prototype.content_;


/**
 * @param {string} path
 * @return {number}
 * @private
 */
thin.editor.ImageFile.getMimeTypeIndex_ = function(path) {
  var fileType = thin.core.platform.File.getFileType(path).toLowerCase();
  return goog.array.findIndex(thin.editor.ImageFile.EXT_NAME_, function(imageType) {
    return fileType === imageType;
  });
};


/**
 * @param {string} path
 * @param {string} base64String
 * @return {string?}
 * @private
 */
thin.editor.ImageFile.createDataURIScheme_ = function(path, base64String) {
  if (!!base64String) {
    var mymeTypeIndex = thin.editor.ImageFile.getMimeTypeIndex_(path);
    var mimeType = thin.editor.ImageFile.MIMETYPE_[mymeTypeIndex];
    return goog.string.buildString('data:', mimeType, ';base64,', base64String);
  } else {
    return null;
  }
};


/**
 * @return {string}
 */
thin.editor.ImageFile.getLastAccessedPath = function() {
  return thin.editor.ImageFile.lastPath_;
};


/**
 * @param {string} path
 */
thin.editor.ImageFile.setLastAccessedPath = function(path) {
  thin.editor.ImageFile.lastPath_ = path;
};


/**
 * @param {string=} opt_path
 * @return {string}
 */
thin.editor.ImageFile.getOpenDirPath = function(opt_path) {
  var lastPath = thin.editor.ImageFile.getLastAccessedPath();
  if (!!opt_path) {
    return thin.core.platform.File.getPathDirName(opt_path);
  } else if (!!lastPath) {
    return thin.core.platform.File.getPathDirName(lastPath);
  } else {
    // homepath
    return thin.core.File.HOME_PATH;
  }
};


/**
 * @param {string=} opt_path
 * @return {thin.editor.ImageFile?}
 */
thin.editor.ImageFile.openDialog = function(opt_path) {
  var path = thin.core.platform.File.getOpenFileName('画像を開く', 
                 thin.editor.ImageFile.getOpenDirPath(opt_path),
                 thin.core.platform.File.createFilter(
                    [thin.editor.ImageFile.EXT_DESCRIPTION_], 
                    [thin.editor.ImageFile.EXT_NAME_]));

  if (!!path) {
    thin.editor.ImageFile.setLastAccessedPath(path);
    return new thin.editor.ImageFile(thin.core.File.open(
                  path, thin.core.File.Mode.IMAGE));
  }
  return null;
};


/**
 * @return {string}
 */
thin.editor.ImageFile.prototype.getPath = function() {
  return this.file_.getPath();
};


/**
 * @param {string?} content
 */
thin.editor.ImageFile.prototype.setContent = function(content) {
  this.content_ = content;
};


/**
 * @return {string?}
 */
thin.editor.ImageFile.prototype.getContent = function() {
  if (!goog.isDef(this.content_)) {
    var file = this.file_;
    this.setContent(thin.editor.ImageFile.createDataURIScheme_(
          file.getPath(), file.read()));
  }
  return this.content_;
};


/**
 * @return {boolean}
 */
thin.editor.ImageFile.prototype.isValid = function() {
  return !goog.isNull(this.getContent());
};


/**
 * @return {thin.editor.ImageFile}
 */
thin.editor.ImageFile.prototype.clone = function() {
  var file = new thin.editor.ImageFile(
                    thin.core.File.open(this.getPath(), 
                    thin.core.File.Mode.IMAGE));
  file.setContent(this.getContent());
  return file;
};


/** @inheritDoc */
thin.editor.ImageFile.prototype.disposeInternal = function() {
  if (goog.isDef(this.file_)) {
    this.file_.dispose();
    delete this.file_;
  }
  thin.editor.ImageFile.superClass_.disposeInternal.call(this);
};