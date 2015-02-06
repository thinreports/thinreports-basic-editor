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
 * @param {string} id
 * @param {Object} locale
 */
App.addLocale = function(locale) {
  App.locales_[App.locales_.length] = locale;
};


/**
 * @return {Object}
 */
App.getLocales = function() {
  return App.locales_;
};


/**
 * @return {string} browser locale
 */
App.getUILocale = function() {
  return (
    navigator.language
    || navigator.browserLanguage
    || navigator.userLanguage
    || App.DEFAULT_LOCALE
  ).substr(0, 2).toLowerCase();
};


/**
 * Around security error by ChromeApp
 */
var CLOSURE_IMPORT_SCRIPT = function() {};
window.eval = function() {};
