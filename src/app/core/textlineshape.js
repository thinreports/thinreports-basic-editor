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

goog.provide('thin.core.TextLineShape');

goog.require('thin.core.AbstractText');


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {number=} opt_lineCount
 * @constructor
 * @extends {thin.core.AbstractText}
 */
thin.core.TextLineShape = function(element, layout, opt_lineCount) {

  if (goog.isNumber(opt_lineCount)) {
    var classId = thin.core.TextShape.ClassIds;
    layout.setElementAttributes(element, {
      'class': thin.core.TextShape.CLASSID + classId.LINE + opt_lineCount
    });
  }
  
  if (!element.hasAttribute('xml:space')) {
    layout.setElementAttributesNS('http://www.w3.org/XML/1998/namespace', element, {
      'xml:space': 'preserve'
    });
  }

  var fill = null;
  if (thin.isExactlyEqual(layout.getElementAttribute(element, 'fill'), thin.core.TextLineShape.DEFAULT_FILL_COLOR_)) {
    fill = thin.core.TextLineShape.DEFAULT_FILL_;
  }
  thin.core.AbstractText.call(this, element, layout, null, fill);
};
goog.inherits(thin.core.TextLineShape, thin.core.AbstractText);


/**
 * @type {string}
 */
thin.core.TextLineShape.HALF_SPACES = ' ';


/**
 * @type {string}
 * @private
 */
thin.core.TextLineShape.DEFAULT_FILL_COLOR_ = 'inherit';


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.core.TextLineShape.DEFAULT_FILL_ = new goog.graphics.SolidFill(thin.core.TextLineShape.DEFAULT_FILL_COLOR_);


/**
 * @type {boolean}
 * @private
 */
thin.core.TextLineShape.prototype.isNullContent_;


/**
 * @return {boolean}
 */
thin.core.TextLineShape.prototype.isNullContent = function() {
  if (!goog.isDef(this.isNullContent_)) {
    var isFillNone = !thin.isExactlyEqual(this.getLayout().getElementAttribute(this.getElement(), 'fill'), 
                                          thin.core.TextLineShape.DEFAULT_FILL_COLOR_);
    var isHalfSpaces = thin.isExactlyEqual(thin.core.TextLineShape.superClass_.getText.call(this),
                                           thin.core.TextLineShape.HALF_SPACES);
    this.isNullContent_ = isFillNone && isHalfSpaces;
  }
  return this.isNullContent_;
};


/**
 * @param {string} text
 */
thin.core.TextLineShape.prototype.setText = function(text) {
  if (thin.isExactlyEqual(text, thin.core.AbstractText.DEFAULT_TEXTCONTENT)) {
    text = thin.core.TextLineShape.HALF_SPACES;
    this.setFill(null);
    this.isNullContent_ = true;
  } else {
    this.setFill(thin.core.TextLineShape.DEFAULT_FILL_);
    this.isNullContent_ = false;
  }
  
  thin.core.TextLineShape.superClass_.setText.call(this, text);
};


/**
 * @return {string}
 */
thin.core.TextLineShape.prototype.getText = function() {
  if (this.isNullContent()) {
    return thin.core.AbstractText.DEFAULT_TEXTCONTENT;
  } else {
    return thin.core.TextLineShape.superClass_.getText.call(this);
  }
};


/**
 * @return {number}
 */
thin.core.TextLineShape.prototype.getLeft = function() {
  if (!goog.isDef(this.left_)) {
    this.left_ = Number(this.getLayout().getElementAttribute(this.getElement(), 'x'));
  }
  return thin.numberWithPrecision(this.left_ + this.getParentTransLateX());
};


/**
 * @return {number}
 */
thin.core.TextLineShape.prototype.getTop = function() {
  if (!goog.isDef(this.top_)) {
    this.top_ = Number(this.getLayout().getElementAttribute(this.getElement(), 'y'));
  }
  return thin.numberWithPrecision(this.top_ + this.getParentTransLateY());
};