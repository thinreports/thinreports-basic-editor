//  Copyright (C) 2012 Matsukei Co.,Ltd.
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

goog.provide('thin.i18n');

goog.require('goog.string');
goog.require('goog.array');
goog.require('thin.Settings');


/**
 * @type {Object}
 * @private
 */
thin.i18n.currentLocale_;


/**
 * @type {string}
 * @private
 */
thin.i18n.currentLocaleId_;


/**
 * @type {Object}
 * @private
 */
thin.i18n.translations_;


/**
 * @param {string} name
 * @param {Object=} opt_values
 * @return {string}
 */
thin.i18n.translate = function(name, opt_values) {
  var i18n = thin.i18n;
  var msg = i18n.makeMessage_(
      i18n.getMessages()[name], opt_values) || '';
  return goog.string.newLineToBr(goog.string.htmlEscape(msg));
};


/**
 * @param {string} name
 * @param {Object=} opt_values
 * @return {string}
 */
thin.t = thin.i18n.translate;


/**
 * @param {string} setting
 * @return {string}
 */
thin.i18n.getDefaultSetting = function(setting) {
  return /** @type {string} */(thin.i18n.currentLocale_['default_settings'][setting]);
};


/**
 * @param {string} setting
 * @return {string}
 */
thin.s = thin.i18n.getDefaultSetting;


/**
 * @return {Object}
 */
thin.i18n.getMessages = function() {
  var i18n = thin.i18n;

  if (!i18n.translations_) {
    i18n.translations_ = /** @type {Object} */(i18n.currentLocale_['messages']);
  }
  return i18n.translations_;
};


/**
 * @return {string}
 */
thin.i18n.getFontFamily = function() {
  return thin.i18n.currentLocale_.font_family;
};


/**
 * @return {string}
 */
thin.i18n.getLocaleId = function() {
  return thin.i18n.currentLocale_.id;
};


thin.i18n.init = function() {
  var i18n = thin.i18n;

  if (i18n.currentLocaleId_) {
    return;
  }

  var settings = thin.Settings;
  var localeId = settings.getLocale();

  if (!localeId) {
    localeId = /** @type {string} */(thin.callApp('getUILocale'));
    settings.setLocale(localeId);
  }

  var locales = /** @type {Array} */(thin.callApp('getLocales'));
  var locale = goog.array.find(locales, function(loc) {
    return loc.id == localeId;
  });

  if (!locale) {
    throw new thin.Error('No found locale');
  }

  i18n.currentLocaleId_ = localeId;
  i18n.currentLocale_ = locale;
};


/**
 * @param {string} str
 * @param {Object=} opt_values
 * @return {string} message
 * @private
 */
thin.i18n.makeMessage_ = function(str, opt_values) {
  var values = opt_values || {};

  for (var key in values) {
    var value = ('' + values[key]).replace(/\$/g, '$$$$');
    str = str.replace(new RegExp('\\{\\$' + key + '\\}', 'gi'), value);
  }
  return str;
};
