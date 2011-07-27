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

goog.provide('thin.core.File');
goog.provide('thin.core.File.Mode');

goog.require('goog.Disposable');
goog.require('goog.string');
goog.require('thin.core');
goog.require('thin.core.platform');
goog.require('thin.core.platform.File');
goog.require('thin.core.platform.Image');


/**
 * @param {string} path
 * @param {thin.core.File.Mode=} opt_mode
 * @constructor
 * @extends {goog.Disposable}
 */
thin.core.File = function(path, opt_mode) {

  /**
   * @type {string}
   * @private
   */
  this.path_ = path;

  /**
   * @type {thin.core.File.Mode}
   * @private
   */
  this.mode_ = opt_mode || thin.core.File.Mode.TEXT;

  goog.Disposable.call(this);
};
goog.inherits(thin.core.File, goog.Disposable);


/**
 * @enum {number}
 */
thin.core.File.Mode = {
  TEXT: 0x01,
  IMAGE: 0x02
};


/**
 * @type {string}
 */
thin.core.File.HOME_PATH = '';


/**
 * @param {string} path
 * @param {thin.core.File.Mode=} opt_mode
 * @return {thin.core.File}
 */
thin.core.File.open = function(path, opt_mode) {
  return new thin.core.File(path, opt_mode);
};


/**
 * @return {string}
 */
thin.core.File.prototype.read = function() {
  switch (this.mode_) {
    case thin.core.File.Mode.TEXT:
      return thin.core.platform.File.read(this.getPath());
      break;
    case thin.core.File.Mode.IMAGE:
      return thin.core.platform.Image.getBase64EncodeString(this.getPath());
      break;
  }
  return '';
};


/**
 * @param {string} content
 */
thin.core.File.prototype.write = function(content) {
  thin.core.platform.File.write(this.getPath(), content);
};


/**
 * @return {string}
 */
thin.core.File.prototype.getPath = function() {
  return this.path_;
};


/** @inheritDoc */
thin.core.File.prototype.disposeInternal = function() {
  thin.core.File.superClass_.disposeInternal.call(this);
};