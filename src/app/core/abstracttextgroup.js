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

goog.provide('thin.core.AbstractTextGroup');

goog.require('thin.core.AbstractBoxGroup');
goog.require('thin.core.FontStyle');
goog.require('thin.core.TextStyle');


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {thin.core.AbstractBoxGroup}
 */
thin.core.AbstractTextGroup = function(element, layout) {
  goog.base(this, element, layout);

  /**
   * @type {thin.core.FontStyle}
   * @private
   */
  this.fontStyle_ = new thin.core.FontStyle();

  /**
   * @type {thin.core.TextStyle}
   * @private
   */
  this.textStyle_ = new thin.core.TextStyle();
};
goog.inherits(thin.core.AbstractTextGroup, thin.core.AbstractBoxGroup);


/**
 * The latest fill applied to this element.
 * @type {goog.graphics.Fill?}
 * @protected
 */
thin.core.AbstractTextGroup.prototype.fill = null;


/**
 * The latest stroke applied to this element.
 * @type {goog.graphics.Stroke?}
 * @private
 */
thin.core.AbstractTextGroup.prototype.stroke_ = null;


/**
 * Sets the fill for this element.
 * @param {goog.graphics.Fill?} fill The fill object.
 */
thin.core.AbstractTextGroup.prototype.setFill = function(fill) {
  this.fill = fill;
  this.getLayout().setElementFill(this, fill);
};


/**
 * @return {goog.graphics.Fill?} fill The fill object.
 */
thin.core.AbstractTextGroup.prototype.getFill = function() {
  return this.fill;
};


/**
 * Sets the stroke for this element.
 * @param {goog.graphics.Stroke?} stroke The stroke object.
 */
thin.core.AbstractTextGroup.prototype.setStroke = function(stroke) {
  this.stroke_ = stroke;
  this.getLayout().setElementStroke(this, stroke);
};


/**
 * @return {goog.graphics.Stroke?} stroke The stroke object.
 */
thin.core.AbstractTextGroup.prototype.getStroke = function() {
  return this.stroke_;
};


/**
 * @return {number|string} Alyways returns 0
 * @override
 */
thin.core.AbstractTextGroup.prototype.getStrokeWidth = function() {
  return 0;
};


/**
 * @param {number} size
 */
thin.core.AbstractTextGroup.prototype.setFontSize = function(size) {
  this.getLayout().setElementAttributes(this.getElement(), {
    'font-size': size
  });
  this.fontStyle_.size = size;
};


/**
 * @param {string} family
 */
thin.core.AbstractTextGroup.prototype.setFontFamily = function (family) {
  this.getLayout().setElementAttributes(this.getElement(), {
    'font-family': family
  });
  this.fontStyle_.family = family;
};


/**
 * @param {string} anchor
 */
thin.core.AbstractTextGroup.prototype.setTextAnchor = function(anchor) {
  this.textStyle_.setTextAnchor(anchor);
  this.getLayout().setElementAttributes(this.getElement(), {
    'text-anchor': anchor
  });
};


/**
 * @param {string} valign
 */
thin.core.AbstractTextGroup.prototype.setVerticalAlign = function(valign) {
  if (thin.isExactlyEqual(valign, thin.core.TextStyle.VerticalAlignType.TOP)) {
    this.getElement().removeAttribute('x-valign');
  } else {
    this.getLayout().setElementAttributes(this.getElement(), {
      'x-valign': valign
    });
  }
  this.textStyle_.setVerticalAlign(valign);
};


/**
 * @param {string} ratio
 */
thin.core.AbstractTextGroup.prototype.setTextLineHeightRatio = function(ratio) {
  var element = this.getElement();

  if (thin.isExactlyEqual(ratio, thin.core.TextStyle.DEFAULT_LINEHEIGHT)) {
    element.removeAttribute('x-line-height');
    element.removeAttribute('x-line-height-ratio');
  } else {
    var layout = this.getLayout();
    var numRatio = Number(ratio);
    var heightAt = thin.Font.getHeight(this.getFontFamily(), this.getFontSize());

    layout.setElementAttributes(element, {
      'x-line-height': heightAt * numRatio
    });
    layout.setElementAttributes(element, {
      'x-line-height-ratio': numRatio
    });
  }
  this.textStyle_.setLineHeightRatio(ratio);
};


/**
 * @param {string} spacing
 */
thin.core.AbstractTextGroup.prototype.setKerning = function(spacing) {
  var layout = this.getLayout();
  var element = this.getElement();
  if (thin.isExactlyEqual(spacing, thin.core.TextStyle.DEFAULT_KERNING)) {
    layout.setElementAttributes(element, {
      'kerning': thin.core.TextStyle.DEFAULT_ELEMENT_KERNING,
      'letter-spacing': thin.core.TextStyle.DEFAULT_ELEMENT_LETTER_SPACING
    });
  } else {
    layout.setElementAttributes(element, {
      'kerning': spacing,
      'letter-spacing': spacing
    });
  }
  this.textStyle_.setKerning(spacing);
};


/**
 * @param {boolean} bold
 */
thin.core.AbstractTextGroup.prototype.setFontBold = function(bold) {
  this.getLayout().setElementAttributes(this.getElement(), {
    'font-weight': bold ? 'bold' : 'normal'
  });
  this.fontStyle_.bold = bold;
};


/**
 * @param {boolean} italic
 */
thin.core.AbstractTextGroup.prototype.setFontItalic = function(italic) {
  this.getLayout().setElementAttributes(this.getElement(), {
    'font-style': italic ? 'italic' : 'normal'
  });
  this.fontStyle_.italic = italic;
};


/**
 * @param {boolean} underline
 */
thin.core.AbstractTextGroup.prototype.setFontUnderline = function(underline) {
  this.setTextDecoration(underline, this.isFontLinethrough());
};


/**
 * @param {boolean} linethrough
 */
thin.core.AbstractTextGroup.prototype.setFontLinethrough = function(linethrough) {
  this.setTextDecoration(this.isFontUnderline(), linethrough);
};


/**
 * @param {boolean} underline
 * @param {boolean} linethrough
 */
thin.core.AbstractTextGroup.prototype.setTextDecoration = function(underline, linethrough) {
  if (underline) {
    var decoration = linethrough ? 'underline line-through' : 'underline';
  } else {
    var decoration = linethrough ? 'line-through' : 'none';
  }
  this.fontStyle_.underline = underline;
  this.fontStyle_.linethrough = linethrough;
  this.fontStyle_.decoration = decoration;

  this.getLayout().setElementAttributes(this.getElement(), {
    'text-decoration': decoration
  });
};


/**
 * @return {number}
 */
thin.core.AbstractTextGroup.prototype.getFontSize = function () {
  return this.fontStyle_.size;
};


/**
 * @return {string}
 */
thin.core.AbstractTextGroup.prototype.getFontFamily = function() {
  return this.fontStyle_.family;
};


/**
 * @return {string}
 */
thin.core.AbstractTextGroup.prototype.getTextAnchor = function() {
  return /** @type {string} */ (thin.getValIfNotDef(this.textStyle_.getTextAnchor(),
             thin.core.TextStyle.HorizonAlignType.START));
};


/**
 * @return {string}
 */
thin.core.AbstractTextGroup.prototype.getVerticalAlign = function() {
  return /** @type {string} */ (thin.getValIfNotDef(this.textStyle_.getVerticalAlign(),
             thin.core.TextStyle.VerticalAlignType.TOP));
};


/**
 * @return {string}
 */
thin.core.AbstractTextGroup.prototype.getTextLineHeightRatio = function() {
  return /** @type {string} */ (thin.getValIfNotDef(this.textStyle_.getLineHeightRatio(),
             thin.core.TextStyle.DEFAULT_LINEHEIGHT));
};


/**
 * @return {string}
 */
thin.core.AbstractTextGroup.prototype.getKerning = function() {
  return /** @type {string} */ (thin.getValIfNotDef(this.textStyle_.getKerning(),
             thin.core.TextStyle.DEFAULT_KERNING));
};


/**
 * @return {boolean}
 */
thin.core.AbstractTextGroup.prototype.isAnchorEnd = function() {
  return this.textStyle_.isAnchorEnd();
};


/**
 * @return {boolean}
 */
thin.core.AbstractTextGroup.prototype.isAnchorMiddle = function() {
  return this.textStyle_.isAnchorMiddle();
};


/**
 * @return {boolean}
 */
thin.core.AbstractTextGroup.prototype.isVerticalBottom = function() {
  return this.textStyle_.isVerticalBottom();
};


/**
 * @return {boolean}
 */
thin.core.AbstractTextGroup.prototype.isVerticalCenter = function() {
  return this.textStyle_.isVerticalCenter();
};


/**
 * @return {boolean}
 */
thin.core.AbstractTextGroup.prototype.isFontBold = function() {
  return this.fontStyle_.bold;
};


/**
 * @return {boolean}
 */
thin.core.AbstractTextGroup.prototype.isFontItalic = function() {
  return this.fontStyle_.italic;
};


/**
 * @return {boolean}
 */
thin.core.AbstractTextGroup.prototype.isFontUnderline = function() {
  return this.fontStyle_.underline;
};


/**
 * @return {boolean}
 */
thin.core.AbstractTextGroup.prototype.isFontLinethrough = function() {
  return this.fontStyle_.linethrough;
};


/**
 * Override thin.core.ModuleShape#updateToolbarUI
 */
thin.core.AbstractTextGroup.prototype.updateToolbarUI = function() {
  var w = this.getLayout().getWorkspace();

  w.setUiStatusForFontFamily(this.getFontFamily());
  w.setUiStatusForFontSize(this.getFontSize());
  w.setUiStatusForBold(this.isFontBold());
  w.setUiStatusForUnderlIne(this.isFontUnderline());
  w.setUiStatusForLineThrough(this.isFontLinethrough());
  w.setUiStatusForItalic(this.isFontItalic());
  w.setUiStatusForHorizonAlignType(this.getTextAnchor());
  w.setUiStatusForVerticalAlignType(this.getVerticalAlign());

  thin.ui.adjustToUiStatusForWorkspace();
};


/** @inheritDoc */
thin.core.AbstractTextGroup.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  delete this.fontStyle_;
  delete this.textStyle_;
};
