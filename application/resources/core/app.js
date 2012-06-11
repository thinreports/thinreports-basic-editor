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

var Thin = {};


/**
 * Available locales
 */
Thin.LOCALES = {
  'ja': '日本語', 
  'en': 'English'
};


/**
 * Default locale
 */
//Thin.defaultLocale = 'ja';
Thin.defaultLocale = 'en';


/**
 * Internal current locale
 */
Thin.locale;


/**
 * Translations
 */
Thin.translations;


/**
 * Get current locale
 */
Thin.getCurrentLocale = function() {
  return localStorage.locale || Thin.defaultLocale;
};


/**
 * Get current INTERNAL locale
 */
Thin.getCurrentInternalLocale = function() {
  return Thin.locale;
};


/**
 * Load current translation file
 */
(function() {
  document.writeln('<script src="locales/' + Thin.getCurrentLocale() + '.js"></script>');
})();
