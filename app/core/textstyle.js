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
goog.provide('thin.core.TextStyle.HorizonAlignTypeName');
goog.provide('thin.core.TextStyle.VerticalAlignTypeName');
goog.provide('thin.core.TextStyle.OverflowType');
goog.provide('thin.core.TextStyle.OverflowTypeName');
goog.provide('thin.core.TextStyle.WordWrapType');
goog.provide('thin.core.TextStyle.WordWrapTypeName');

goog.require('thin.i18n');


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
thin.core.TextStyle.WordWrapTypeName = {
  NONE: thin.t('label_word_wrap_none'),
  BREAK_WORD: thin.t('label_word_wrap_break_word')
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
thin.core.TextStyle.HorizonAlignTypeName = {
  START: thin.t('label_left_align'),
  MIDDLE: thin.t('label_center_align'),
  END: thin.t('label_right_align')
};


/**
 * @enum {string}
 */
thin.core.TextStyle.VerticalAlignTypeName = {
  TOP: thin.t('label_top_align'),
  CENTER: thin.t('label_middle_align'),
  BOTTOM: thin.t('label_bottom_align')
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
 * @enum {string}
 */
thin.core.TextStyle.OverflowTypeName = {
  TRUNCATE: thin.t('label_overflow_truncate'),
  FIT: thin.t('label_overflow_fit'),
  EXPAND: thin.t('label_overflow_expand')
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
thin.core.TextStyle.DEFAULT_ELEMENT_KERNING = 'auto';


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
  var wordWrapType = thin.core.TextStyle.WordWrapType;
  var defaultWordWrapCaption = thin.t('field_default_text_word_wrap');

  var defaultType = wordWrapType.NONE;
  goog.object.forEach(thin.core.TextStyle.WordWrapTypeName, function(caption, type) {
    if (caption == defaultWordWrapCaption) {
      defaultType = goog.object.get(wordWrapType, type);
      return;
    }
  });
  return defaultType;
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
 * @param {string} textAnchor
 * @return {string}
 */
thin.core.TextStyle.getHorizonAlignValueFromType = function(textAnchor) {

  var anchorType = thin.core.TextStyle.HorizonAlignType;
  var anchorTypeName = thin.core.TextStyle.HorizonAlignTypeName;
  
  switch (textAnchor) {
    case anchorType.START:
      var alignValue = anchorTypeName.START;
      break;
    case anchorType.MIDDLE:
      var alignValue = anchorTypeName.MIDDLE;
      break;
    case anchorType.END:
      var alignValue = anchorTypeName.END;
      break;
  }
  return /** @type {string} */ (alignValue);
};


/**
 * @param {string} valign
 * @return {string}
 */
thin.core.TextStyle.getVerticalAlignValueFromType = function(valign) {

  var valignType = thin.core.TextStyle.VerticalAlignType;
  var valignTypeName = thin.core.TextStyle.VerticalAlignTypeName;
  
  switch (valign) {
    case valignType.TOP:
      var valignValue = valignTypeName.TOP;
      break;
    case valignType.CENTER:
      var valignValue = valignTypeName.CENTER;
      break;
    case valignType.BOTTOM:
      var valignValue = valignTypeName.BOTTOM;
      break;
  }
  return /** @type {string} */ (valignValue);
};


/**
 * @return {string}
 */
thin.core.TextStyle.getHorizonAlignTypeFromTypeName = function(targetName) {
  
  var anchorType = thin.core.TextStyle.HorizonAlignType;
  var anchorTypeName = thin.core.TextStyle.HorizonAlignTypeName;
  
  switch (targetName) {
    case anchorTypeName.START:
      var alignValue = anchorType.START;
      break;
    case anchorTypeName.MIDDLE:
      var alignValue = anchorType.MIDDLE;
      break;
    case anchorTypeName.END:
      var alignValue = anchorType.END;
      break;
  }
  return /** @type {string} */ (alignValue);
};


/**
 * @return {string}
 */
thin.core.TextStyle.getVerticalAlignTypeFromTypeName = function(targetName) {
  
  var valignType = thin.core.TextStyle.VerticalAlignType;
  var valignTypeName = thin.core.TextStyle.VerticalAlignTypeName;
  
  switch (targetName) {
    case valignTypeName.TOP:
      var valignValue = valignType.TOP;
      break;
    case valignTypeName.CENTER:
      var valignValue = valignType.CENTER;
      break;
    case valignTypeName.BOTTOM:
      var valignValue = valignType.BOTTOM;
      break;
  }
  return /** @type {string} */ (valignValue);
};


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
