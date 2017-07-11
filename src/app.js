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

var App = {};


/**
 * @type {string}
 * @const
 */
App.DEFAULT_LOCALE = 'en';


/**
 * @type {Array.<Object>}
 * @private
 */
App.locales_ = [];

/**
 * @type {Array.<string>}
 * @private
 */
App.localeIds_ = [];


/**
 * @param {string} id
 * @param {Object} locale
 */
App.addLocale = function(locale) {
  App.locales_.push(locale);
  App.localeIds_.push(locale.id);
};


/**
 * @return {Object}
 */
App.getLocales = function() {
  return App.locales_;
};


/**
 * @return {string} default locale
 */
App.getDefaultUILocale = function() {
  return App.DEFAULT_LOCALE;
};


/**
 * @return {string} browser locale
 */
App.getUILocale = function() {
  var locale = navigator.language
                || navigator.browserLanguage
                || navigator.userLanguage;

  if (!locale || App.localeIds_.indexOf(locale) == -1) {
    locale = App.DEFAULT_LOCALE;
  }

  return locale;
};
