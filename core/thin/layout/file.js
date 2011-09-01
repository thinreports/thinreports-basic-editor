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

goog.provide('thin.layout.File');

goog.require('goog.Disposable');
goog.require('thin.core.File');
goog.require('thin.core.File.Mode');
goog.require('thin.core.platform');
goog.require('thin.core.platform.File');


/**
 * @param {thin.core.File=} opt_file
 * @constructor
 * @extends {goog.Disposable}
 */
thin.layout.File = function(opt_file) {
  if (opt_file) {
    this.file_ = opt_file;
  }
  
  goog.Disposable.call(this);
};
goog.inherits(thin.layout.File, goog.Disposable);


/**
 * @type {string}
 * @private
 */
thin.layout.File.EXT_NAME_ = 'tlf';


/**
 * @type {string}
 * @private
 */
thin.layout.File.EXT_DESCRIPTION_ = 'ThinReports Layout Format';


/**
 * @type {thin.core.File}
 * @private
 */
thin.layout.File.prototype.file_;


/**
 * @return {string}
 */
thin.layout.File.getLastAccessedPath = function() {
  return thin.settings.get('last_layout_path') || thin.core.File.HOME_PATH;
};


/**
 * @param {string} path
 */
thin.layout.File.setLastAccessedPath = function(path) {
  thin.settings.set('last_layout_path', path);
};


/**
 * @param {string=} opt_path
 * @return {string}
 * @private
 */
thin.layout.File.getOpenDirPath = function(opt_path) {
  var lastPath = thin.layout.File.getLastAccessedPath();
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
 * @return {string}
 * @private
 */
thin.layout.File.getSaveAsDirPath = function(opt_path) {
  var lastPath = thin.layout.File.getLastAccessedPath();
  if (!!opt_path) {
    return opt_path;
  } else if (!!lastPath) {
    return thin.core.platform.File.getPathDirName(lastPath);
  } else {
    // homepath
    return thin.core.File.HOME_PATH;
  }
};


/**
 * @param {string=} opt_path
 * @return {thin.layout.File?}
 */
thin.layout.File.openDialog = function(opt_path) {
  var path = thin.core.platform.File.getOpenFileName('ファイルを開く', 
                 thin.layout.File.getOpenDirPath(opt_path),
                 thin.core.platform.File.createFilter(
                    thin.layout.File.EXT_DESCRIPTION_, 
                    [thin.layout.File.EXT_NAME_], true));

  if (!!path) {
    thin.layout.File.setLastAccessedPath(path);
    return new thin.layout.File(thin.core.File.open(path));
  }
  return null;
};


/**
 * @return {boolean}
 */
thin.layout.File.prototype.isNew = function() {
  return !this.file_;
};


/**
 * @return {string}
 */
thin.layout.File.prototype.getPath = function() {
  return this.file_.getPath();
};


/**
 * @param {string} content
 */
thin.layout.File.prototype.save = function(content) {
  this.file_.write(content);
};


/**
 * @return {string}
 */
thin.layout.File.prototype.getContent = function() {
  return this.file_.read();
};


/**
 * @param {string=} opt_path
 * @return {boolean}
 */
thin.layout.File.prototype.saveAs = function(opt_path) {
  var path = thin.core.platform.File.getSaveFileName('ファイルを保存', 
                 thin.layout.File.getSaveAsDirPath(opt_path),
                 thin.core.platform.File.createFilter(
                    thin.layout.File.EXT_DESCRIPTION_, [thin.layout.File.EXT_NAME_]));

  var isExistPath = !!path;
  if (isExistPath) {
    if (this.file_) {
      this.file_.dispose();
    }
    thin.layout.File.setLastAccessedPath(path);
    this.file_ = thin.core.File.open(path);
  }
  return isExistPath;
};


/** @inheritDoc */
thin.layout.File.prototype.disposeInternal = function() {
  if (this.file_) {
    this.file_.dispose();
    delete this.file_;
  }
  thin.layout.File.superClass_.disposeInternal.call(this);
};