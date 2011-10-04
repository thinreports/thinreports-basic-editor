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
goog.require('goog.storage.mechanism.HTML5LocalStorage');


/**
 * @constructor
 * @extends {goog.storage.mechanism.HTML5LocalStorage}
 */
thin.Settings = function() {
  goog.base(this);
  /**
   * @type {string?}
   */
  this.uid_ = goog.uri.utils.getParamValue(goog.global.document.URL, 'uid');
};
goog.inherits(thin.Settings, goog.storage.mechanism.HTML5LocalStorage);
goog.addSingletonGetter(thin.Settings);


/**
 * @param {string} key
 * @param {string} value
 */
thin.Settings.prototype.setGlobal = function(key, value) {
  thin.Settings.superClass_.set.call(this, key, value);
};


/**
 * @param {string} key
 * @return {string?}
 */
thin.Settings.prototype.getGlobal = function(key) {
  return thin.Settings.superClass_.get.call(this, key);
};


/** @inheritDoc */
thin.Settings.prototype.set = function(key, value) {
  goog.base(this, 'set', this.getPrivateKey_(key), value);
};


/** @inheritDoc */
thin.Settings.prototype.get = function(key) {
  return goog.base(this, 'get', this.getPrivateKey_(key));
};


/**
 * @param {string} key
 * @return {string}
 * @private
 */
thin.Settings.prototype.getPrivateKey_ = function(key) {
  return this.uid_ + '_' + key;
};


thin.settings = thin.Settings.getInstance();