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
  return thin.i18n.getMsg_(
      thin.i18n.getTranslations()[name], opt_values) || '';
};


/**
 * @return {Object}
 */
thin.i18n.getTranslations = function() {
  return thin.i18n.translations_
    || (thin.i18n.translations_ = /** @type {Object} */(thin.$('translations')));
};


/**
 * @param {string} str
 * @param {Object=} opt_values
 * @return {string} message
 * @private
 */
thin.i18n.getMsg_ = function(str, opt_values) {
  var values = opt_values || {};
  for (var key in values) {
    var value = ('' + values[key]).replace(/\$/g, '$$$$');
    str = str.replace(new RegExp('\\{\\$' + key + '\\}', 'gi'), value);
  }
  return str;
};
