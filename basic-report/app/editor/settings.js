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

goog.require('thin.platform.Storage');


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


thin.Settings.init = function() {
  var settings = thin.Settings.getInstance();

  goog.array.forEach(thin.Settings.KEYS, function (key) {
    settings.storage[key] = thin.platform.Storage.getItem(key);
  });
};


thin.Settings.flush = function() {
  var settings = thin.Settings.getInstance();

  goog.object.forEach(settings.storage, function (value, key) {
    thin.platform.Storage.setItem(key, value);
  });
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
