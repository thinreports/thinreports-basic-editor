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

goog.provide('thin.Settings');

// goog.require('goog.array');
// goog.require('thin.platform');
// goog.require('thin.ui.InputUnitChanger');
// goog.require('thin.ui.InputUnitChanger.Unit');


/**
 * @constructor
 */
thin.Settings = function() {
  /**
   * @type {Object}
   */
  this.storage = {};
};
goog.addSingletonGetter(thin.Settings);


/**
 * @type {Array}
 * @const
 */
thin.Settings.KEYS = [
  // Default unit.
  'default_unit',
  // System locale.
  'locale'
];


/**
 * @param {Function} fn_ready
 */
thin.Settings.init = function(fn_onReady) {
  var settings = thin.Settings.getInstance();
  /**
   * @param {Object} items
   */
  var initializer = function(items) {
    settings.storage = items;
    // goog.object.forEach(items, function(value, key) {
    //   settings.storage[key] = value;
    // });
    fn_onReady();
  };
  thin.platform.callNativeFunction(
    'chrome', 'storage', 'local', 'get', [thin.Settings.KEYS, initializer]);
};


/**
 * @param {Function} fn_onComplete
 */
thin.Settings.flush = function(fn_onComplete) {
  var settings = thin.Settings.getInstance();
  thin.platform.callNativeFunction(
    'chrome', 'storage', 'local', 'set', [settings.storage, fn_onComplete]);
};


/**
 * @param {string} unit
 */
thin.Settings.setDefaultUnit = function(unit) {
  thin.Settings.set_('default_unit', unit);
};


/**
 * @return {string}
 */
thin.Settings.getDefaultUnit = function() {
  return thin.Settings.get_('default_unit')
      || /** @type {string} */ (thin.ui.InputUnitChanger.Unit.PX);
};


/**
 * @param {string} localeId
 */
thin.Settings.setLocale = function(localeId) {
  thin.Settings.set_('locale', localeId);
};


/**
 * @return {string}
 */
thin.Settings.getLocale = function() {
  return thin.Settings.get_('locale');
};


/**
 * @param {string} key
 * @return {string}
 * @private
 */
thin.Settings.get_ = function(key) {
  return thin.Settings.getInstance().get(key);
};


/**
 * @param {string} key
 * @param {string} value
 * @private
 */
thin.Settings.set_ = function(key, value) {
  thin.Settings.getInstance().set(key, value);
};


/**
 * @param {string} key
 * @param {string} value
 */
thin.Settings.prototype.set = function(key, value) {
  this.validateKey_(key);
  this.storage[key] = value;
};


/**
 * @param {string} key
 * @return {string}
 */
thin.Settings.prototype.get = function(key) {
  this.validateKey_(key);
  return this.storage[key];
};


/**
 * @param {string} key
 * @private
 */
thin.Settings.prototype.validateKey_ = function(key) {
  if (!goog.array.contains(thin.Settings.KEYS, key)) {
    throw new Error('Invalid setting key');
  }
};
