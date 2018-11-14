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

goog.provide('thin.platform.FontValidator');

goog.require('goog.dom');
goog.require('goog.style');


/**
 * @constructor
 */
thin.platform.FontValidator = function () {
  /**
   * @type {Element}
   * @private
   */
  this.element_ = goog.dom.getElement('font-validator');
};
goog.addSingletonGetter(thin.platform.FontValidator);


/**
 * @param {string} family
 * @return {boolean}
 */
thin.platform.FontValidator.validate = function (family) {
  return thin.platform.FontValidator.getInstance().validate(family);
};


/**
 * @define {string}
 */
thin.platform.FontValidator.BLANK_FONT_FAMILY = 'AdobeBlank';


/**
 * @param {string} family
 * @return {boolean}
 */
thin.platform.FontValidator.prototype.validate = function (family) {
  this.setFontFamily_(family);
  return goog.style.getSize(this.element_).width > 1;
};


/**
 * @param {string} family
 * @return {void}
 * @private
 */
thin.platform.FontValidator.prototype.setFontFamily_ = function (family) {
  var style = family + ',' + thin.platform.FontValidator.BLANK_FONT_FAMILY;
  goog.style.setStyle(this.element_, 'font-family', style);
};
