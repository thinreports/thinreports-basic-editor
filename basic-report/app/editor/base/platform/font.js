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

goog.provide('thin.platform.Font');

goog.require('goog.dom');
goog.require('thin.platform');
goog.require('thin.core.TextHelper');


/**
 * @type {string}
 * @private
 */
thin.platform.FIRST_LINE_TEXT_ = 'Agjぽ';


/**
 * @param {string} family
 * @param {number} fontSize
 * @param {boolean} isBold
 * @return {Object}
 */
thin.platform.Font.getTextLineSpec = function(family, fontSize, isBold) {
  var layout = thin.core.getActiveWorkspace().getLayout();

  var textHelper = new thin.core.TextHelper(layout);
  textHelper.setFontSize(fontSize);
  textHelper.setFontFamily(family);
  textHelper.setFontBold(isBold);
  textHelper.setVisibled(false);
  textHelper.setFirstLine(thin.platform.FIRST_LINE_TEXT_);

  var helper = layout.getHelpers();
  helper.appendBack(textHelper);

  var firstLine = textHelper.getFirstLine();
  var spec = {
    height: firstLine.getHeight(),
    ascent: firstLine.getAscent(),
    descent: firstLine.getDescent()
  };

  goog.dom.removeNode(textHelper.getElement());
  // cannot be deleted in ES5 strict mode
  firstLine = null;

  return spec;
};


/**
 * @param {string} family
 * @param {number} fontSize
 * @return {number}
 */
thin.platform.Font.getHeight = function(family, fontSize) {
  var spec = thin.platform.Font.getTextLineSpec(family, fontSize, false);
  return spec.height;
};


/**
 * @param {string} family
 * @param {number} fontSize
 * @param {boolean} isBold
 * @return {number}
 */
thin.platform.Font.getAscent = function(
      family, fontSize, isBold) {

  var spec = thin.platform.Font.getTextLineSpec(family, fontSize, isBold);
  return spec.ascent;
};
