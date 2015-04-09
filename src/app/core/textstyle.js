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

goog.provide('thin.core.TextStyle');
goog.provide('thin.core.TextStyle.HorizonAlignType');
goog.provide('thin.core.TextStyle.VerticalAlignType');
goog.provide('thin.core.TextStyle.OverflowType');
goog.provide('thin.core.TextStyle.WordWrapType');


/**
 * @constructor
 */
thin.core.TextStyle = function() {};


/**
 * @enum {string}
 */
thin.core.TextStyle.WordWrapType = {
  NONE: 'none',
  BREAK_WORD: 'break-word'
};


/**
 * @enum {string}
 */
thin.core.TextStyle.HorizonAlignType = {
  START: 'start',
  MIDDLE: 'middle',
  END: 'end'
};


/**
 * @enum {string}
 */
thin.core.TextStyle.VerticalAlignType = {
  TOP: 'top',
  CENTER: 'center',
  BOTTOM: 'bottom'
};


/**
 * @enum {string}
 */
thin.core.TextStyle.OverflowType = {
  TRUNCATE: 'truncate',
  FIT: 'fit',
  EXPAND: 'expand'
};


/**
 * @type {string}
 */
thin.core.TextStyle.DEFAULT_OVERFLOWTYPE = 'truncate';


/**
 * @type {string}
 */
thin.core.TextStyle.DEFAULT_KERNING = '';


/**
 * @type {string}
 */
thin.core.TextStyle.DEFAULT_LETTER_SPACING = '';


/**
 * @type {string}
 */
thin.core.TextStyle.DEFAULT_ELEMENT_KERNING = 'auto';


/**
 * @type {string}
 */
thin.core.TextStyle.DEFAULT_ELEMENT_LETTER_SPACING = 'normal';


/**
 * @type {string}
 */
thin.core.TextStyle.DEFAULT_LINEHEIGHT = '';


/**
 * @type {string}
 */
thin.core.TextStyle.DEFAULT_LINEHEIGHT_INTERNAL = '1';


/**
 * @type {Array.<string>}
 */
thin.core.TextStyle.LINEHEIGHT_LIST = ['1', '1.5', '2.0', '2.5', '3.0'];


/**
 * @return {string}
 */
thin.core.TextStyle.getDefaultWordWrap = function() {
  return /** @type {string} */(thin.s('text_word_wrap'));
};


/**
 * @param {string} wordWrapType
 * @return {string}
 */
thin.core.TextStyle.getWordWrapName = function(wordWrapType) {
  var type = thin.core.TextStyle.WordWrapType;
  var name;

  switch(wordWrapType) {
    case type.NONE:
      name = thin.t('label_word_wrap_none');
      break;
    case type.BREAK_WORD:
      name = thin.t('label_word_wrap_break_word');
      break;
  }
  return /** type {string} */(name);
};


/**
 * @param {string} vAlignType
 * @return {string}
 */
thin.core.TextStyle.getVerticalAlignName = function(vAlignType) {
  var type = thin.core.TextStyle.VerticalAlignType;
  var name;

  switch(vAlignType) {
    case type.TOP:
      name = thin.t('label_top_align');
      break;
    case type.CENTER:
      name = thin.t('label_middle_align');
      break;
    case type.BOTTOM:
      name = thin.t('label_bottom_align');
      break;
  }
  return /** @type {string} */(name);
};


/**
 * @param {string} hAlignType
 * @return {string}
 */
thin.core.TextStyle.getHorizonAlignName = function(hAlignType) {
  var type = thin.core.TextStyle.HorizonAlignType;
  var name;

  switch(hAlignType) {
    case type.START:
      name = thin.t('label_left_align');
      break;
    case type.MIDDLE:
      name = thin.t('label_center_align');
      break;
    case type.END:
      name = thin.t('label_right_align');
      break;
  }
  return /** @type {string} */(name);
};


/**
 * @param {string} overflowType
 * @return {string}
 */
thin.core.TextStyle.getOverflowName = function(overflowType) {
  var type = thin.core.TextStyle.OverflowType;
  var name;

  switch(overflowType) {
    case type.TRUNCATE:
      name = thin.t('label_overflow_truncate');
      break;
    case type.FIT:
      name = thin.t('label_overflow_fit');
      break;
    case type.EXPAND:
      name = thin.t('label_overflow_expand');
      break;
  }
  return /** @type {string} */(name);
};


/**
 * @type {string}
 * @private
 */
thin.core.TextStyle.prototype.anchor_;


/**
 * @type {string}
 * @private
 */
thin.core.TextStyle.prototype.valign_;


/**
 * @type {string}
 * @private
 */
thin.core.TextStyle.prototype.kerning_;


/**
 * @type {string}
 * @private
 */
thin.core.TextStyle.prototype.lineHeightRatio_;


/**
 * @param {string} valign
 */
thin.core.TextStyle.prototype.setVerticalAlign = function(valign) {
  this.valign_ = valign;
};


/**
 * @return {string}
 */
thin.core.TextStyle.prototype.getVerticalAlign = function() {
  return this.valign_;
};


/**
 * @param {string} anchor
 */
thin.core.TextStyle.prototype.setTextAnchor = function(anchor) {
  this.anchor_ = anchor;
};


/**
 * @return {string}
 */
thin.core.TextStyle.prototype.getTextAnchor = function() {
  return this.anchor_;
};


/**
 * @param {string} ratio
 */
thin.core.TextStyle.prototype.setLineHeightRatio = function(ratio) {
  this.lineHeightRatio_ = ratio;
};


/**
 * @return {string}
 */
thin.core.TextStyle.prototype.getLineHeightRatio = function() {
  return this.lineHeightRatio_;
};


/**
 * @param {string} spacing
 */
thin.core.TextStyle.prototype.setKerning = function(spacing) {
  this.kerning_ = spacing;
};


/**
 * @return {string}
 */
thin.core.TextStyle.prototype.getKerning = function() {
  return this.kerning_;
};


/**
 * @return {boolean}
 */
thin.core.TextStyle.prototype.isAnchorEnd = function() {
  return this.anchor_ == thin.core.TextStyle.HorizonAlignType.END;
};


/**
 * @return {boolean}
 */
thin.core.TextStyle.prototype.isAnchorMiddle = function() {
  return this.anchor_ == thin.core.TextStyle.HorizonAlignType.MIDDLE;
};


/**
 * @return {boolean}
 */
thin.core.TextStyle.prototype.isVerticalBottom = function() {
  return this.valign_ == thin.core.TextStyle.VerticalAlignType.BOTTOM;
};


/**
 * @return {boolean}
 */
thin.core.TextStyle.prototype.isVerticalCenter = function() {
  return this.valign_ == thin.core.TextStyle.VerticalAlignType.CENTER;
};
