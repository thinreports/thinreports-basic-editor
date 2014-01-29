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

goog.provide('thin.editor.TextStyle');
goog.provide('thin.editor.TextStyle.HorizonAlignType');
goog.provide('thin.editor.TextStyle.VerticalAlignType');
goog.provide('thin.editor.TextStyle.HorizonAlignTypeName');
goog.provide('thin.editor.TextStyle.VerticalAlignTypeName');
goog.provide('thin.editor.TextStyle.OverflowType');
goog.provide('thin.editor.TextStyle.OverflowTypeName');
goog.provide('thin.editor.TextStyle.WordWrapType');
goog.provide('thin.editor.TextStyle.WordWrapTypeName');


/**
 * @constructor
 */
thin.editor.TextStyle = function() {};


/**
 * @enum {string}
 */
thin.editor.TextStyle.WordWrapType = {
  NONE: 'none',
  BREAK_WORD: 'break-word'
};


/**
 * @enum {string}
 */
thin.editor.TextStyle.WordWrapTypeName = {
  NONE: thin.t('label_word_wrap_none'),
  BREAK_WORD: thin.t('label_word_wrap_break_word')
};


/**
 * @enum {string}
 */
thin.editor.TextStyle.HorizonAlignType = {
  START: 'start',
  MIDDLE: 'middle',
  END: 'end'
};


/**
 * @enum {string}
 */
thin.editor.TextStyle.VerticalAlignType = {
  TOP: 'top',
  CENTER: 'center',
  BOTTOM: 'bottom'
};


/**
 * @enum {string}
 */
thin.editor.TextStyle.HorizonAlignTypeName = {
  START: thin.t('label_left_align'),
  MIDDLE: thin.t('label_center_align'),
  END: thin.t('label_right_align')
};


/**
 * @enum {string}
 */
thin.editor.TextStyle.VerticalAlignTypeName = {
  TOP: thin.t('label_top_align'),
  CENTER: thin.t('label_middle_align'),
  BOTTOM: thin.t('label_bottom_align')
};


/**
 * @enum {string}
 */
thin.editor.TextStyle.OverflowType = {
  TRUNCATE: 'truncate',
  FIT: 'fit',
  EXPAND: 'expand'
};


/**
 * @enum {string}
 */
thin.editor.TextStyle.OverflowTypeName = {
  TRUNCATE: thin.t('label_overflow_truncate'),
  FIT: thin.t('label_overflow_fit'),
  EXPAND: thin.t('label_overflow_expand')
};


/**
 * @type {string}
 */
thin.editor.TextStyle.DEFAULT_OVERFLOWTYPE = 'truncate';


/**
 * @type {string}
 */
thin.editor.TextStyle.DEFAULT_KERNING = '';


/**
 * @type {string}
 */
thin.editor.TextStyle.DEFAULT_ELEMENT_KERNING = 'auto';


/**
 * @type {string}
 */
thin.editor.TextStyle.DEFAULT_LINEHEIGHT = '';


/**
 * @type {string}
 */
thin.editor.TextStyle.DEFAULT_LINEHEIGHT_INTERNAL = '1';


/**
 * @type {Array.<string>}
 */
thin.editor.TextStyle.LINEHEIGHT_LIST = ['1', '1.5', '2.0', '2.5', '3.0'];


/**
 * @return {string}
 */
thin.editor.TextStyle.getDefaultWordWrap = function() {
  var wordWrapType = thin.editor.TextStyle.WordWrapType;
  var defaultWordWrapCaption = thin.t('field_default_text_word_wrap');

  var defaultType = wordWrapType.NONE;
  goog.object.forEach(thin.editor.TextStyle.WordWrapTypeName, function(caption, type) {
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
thin.editor.TextStyle.prototype.anchor_;


/**
 * @type {string}
 * @private
 */
thin.editor.TextStyle.prototype.valign_;


/**
 * @type {string}
 * @private
 */
thin.editor.TextStyle.prototype.kerning_;


/**
 * @type {string}
 * @private
 */
thin.editor.TextStyle.prototype.lineHeightRatio_;


/**
 * @param {string} textAnchor
 * @return {string}
 */
thin.editor.TextStyle.getHorizonAlignValueFromType = function(textAnchor) {

  var anchorType = thin.editor.TextStyle.HorizonAlignType;
  var anchorTypeName = thin.editor.TextStyle.HorizonAlignTypeName;
  
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
thin.editor.TextStyle.getVerticalAlignValueFromType = function(valign) {

  var valignType = thin.editor.TextStyle.VerticalAlignType;
  var valignTypeName = thin.editor.TextStyle.VerticalAlignTypeName;
  
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
thin.editor.TextStyle.getHorizonAlignTypeFromTypeName = function(targetName) {
  
  var anchorType = thin.editor.TextStyle.HorizonAlignType;
  var anchorTypeName = thin.editor.TextStyle.HorizonAlignTypeName;
  
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
thin.editor.TextStyle.getVerticalAlignTypeFromTypeName = function(targetName) {
  
  var valignType = thin.editor.TextStyle.VerticalAlignType;
  var valignTypeName = thin.editor.TextStyle.VerticalAlignTypeName;
  
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
thin.editor.TextStyle.prototype.setVerticalAlign = function(valign) {
  this.valign_ = valign;
};


/**
 * @return {string}
 */
thin.editor.TextStyle.prototype.getVerticalAlign = function() {
  return this.valign_;
};


/**
 * @param {string} anchor
 */
thin.editor.TextStyle.prototype.setTextAnchor = function(anchor) {
  this.anchor_ = anchor;
};


/**
 * @return {string}
 */
thin.editor.TextStyle.prototype.getTextAnchor = function() {
  return this.anchor_;
};


/**
 * @param {string} ratio
 */
thin.editor.TextStyle.prototype.setLineHeightRatio = function(ratio) {
  this.lineHeightRatio_ = ratio;
};


/**
 * @return {string}
 */
thin.editor.TextStyle.prototype.getLineHeightRatio = function() {
  return this.lineHeightRatio_;
};


/**
 * @param {string} spacing
 */
thin.editor.TextStyle.prototype.setKerning = function(spacing) {
  this.kerning_ = spacing;
};


/**
 * @return {string}
 */
thin.editor.TextStyle.prototype.getKerning = function() {
  return this.kerning_;
};


/**
 * @return {boolean}
 */
thin.editor.TextStyle.prototype.isAnchorEnd = function() {
  return this.anchor_ == thin.editor.TextStyle.HorizonAlignType.END;
};


/**
 * @return {boolean}
 */
thin.editor.TextStyle.prototype.isAnchorMiddle = function() {
  return this.anchor_ == thin.editor.TextStyle.HorizonAlignType.MIDDLE;
};


/**
 * @return {boolean}
 */
thin.editor.TextStyle.prototype.isVerticalBottom = function() {
  return this.valign_ == thin.editor.TextStyle.VerticalAlignType.BOTTOM;
};


/**
 * @return {boolean}
 */
thin.editor.TextStyle.prototype.isVerticalCenter = function() {
  return this.valign_ == thin.editor.TextStyle.VerticalAlignType.CENTER;
};
