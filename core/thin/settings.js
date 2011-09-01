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

goog.provide('thin.Settings');

goog.require('goog.uri.utils');
goog.require('goog.Disposable');

/**
 * @constructor
 * @extends {goog.Disposable}
 */
thin.Settings = function() {
  /**
   * @type {string?}
   */
  this.uid_ = goog.uri.utils.getParamValue(goog.global.document.URL, 'uid');
};
goog.inherits(thin.Settings, goog.Disposable);


/**
 * @param {string} key
 * @param {string} value
 */
thin.Settings.prototype.setGlobal = function(key, value) {
  this.set_(key, value);
};


/**
 * @param {string} key
 * @return {string}
 */
thin.Settings.prototype.getGlobal = function(key) {
  return this.get_(key);
};


/**
 * @param {string} key
 * @param {string} value
 */
thin.Settings.prototype.set = function(key, value) {
  this.set_(this.getPrivateKey_(key), value);
};


/**
 * @param {string} key
 * @return {string}
 */
thin.Settings.prototype.get = function(key) {
  return this.get_(this.getPrivateKey_(key));
};


/**
 * @param {string} key
 * @param {string} value
 * @private
 */
thin.Settings.prototype.set_ = function(key, value) {
  goog.global.localStorage[key] = value;
};


/**
 * @param {string} key
 * @return {string}
 * @private
 */
thin.Settings.prototype.get_ = function(key) {
  return goog.global.localStorage[key];
};


/**
 * @param {string} key
 * @return {string}
 * @private
 */
thin.Settings.prototype.getPrivateKey_ = function(key) {
  return this.uid_ + '_' + key;
};

thin.settings = new thin.Settings();