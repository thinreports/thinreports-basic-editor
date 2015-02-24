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

goog.provide('thin.core.AbstractText');

goog.require('goog.graphics.SvgTextElement');
goog.require('thin.core.ModuleElement');


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @constructor
 * @extends {goog.graphics.SvgTextElement}
 */
thin.core.AbstractText = function(element, layout, stroke, fill) {
  goog.graphics.SvgTextElement.call(this, element, layout, stroke, fill);
};
goog.inherits(thin.core.AbstractText, goog.graphics.SvgTextElement);
goog.mixin(thin.core.AbstractText.prototype, thin.core.ModuleElement.prototype);


/**
 * @type {string}
 */
thin.core.AbstractText.DEFAULT_TEXTCONTENT = '';


/**
 * @return {boolean}
 */
thin.core.AbstractText.prototype.isExistsData = function() {
  var firstChild = this.getElement().firstChild;
  if (firstChild) {
    return goog.isString(firstChild.data);
  } else {
    return false;
  }
};


/**
 * @param {string} text
 */
thin.core.AbstractText.prototype.setText = function(text) {
  if (!this.isExistsData()) {
    this.getElement().appendChild(goog.dom.getDocument().createTextNode(
        thin.core.AbstractText.DEFAULT_TEXTCONTENT));
  }
  thin.core.AbstractText.superClass_.setText.call(this, text);
};


/**
 * @return {string}
 */
thin.core.AbstractText.prototype.getText = function() {
  if (this.isExistsData()) {
    return this.getElement().firstChild.data;
  } else {
    return thin.core.AbstractText.DEFAULT_TEXTCONTENT;
  }
};


/**
 * @param {number} left
 */
thin.core.AbstractText.prototype.setLeft = function(left) {
  left = thin.numberWithPrecision(left - this.getParentTransLateX());
  this.left_ = left;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x': left
  });
};


/**
 * @param {number} top
 */
thin.core.AbstractText.prototype.setTop = function(top) {
  top = thin.numberWithPrecision(top - this.getParentTransLateY());
  this.top_ = top;
  this.getLayout().setElementAttributes(this.getElement(), {
    'y': top
  });
};


/**
 * @return {SVGRect}
 */
thin.core.AbstractText.prototype.getBBox = function() {
  return this.getElement()['getBBox']();
};


/**
 * @return {number}
 */
thin.core.AbstractText.prototype.getHeight = function() {
  this.height_ = this.getBBox().height;
  return this.height_;
};


/**
 * @return {number}
 */
thin.core.AbstractText.prototype.getWidth = function() {
  this.width_ = this.getBBox().width;
  return this.width_;
};


/**
 * @return {number}
 */
thin.core.AbstractText.prototype.getBaseLine = function() {
  var element = this.getElement();
  if (element.hasAttribute('y')) {
    return Number(this.getLayout().getElementAttribute(element, 'y'));
  } else {
    return 0;
  }
};


/**
 * @return {number}
 */
thin.core.AbstractText.prototype.getAscent = function() {
  return Math.round(this.getBaseLine() - this.getBBox().y);
};


/**
 * @return {number}
 */
thin.core.AbstractText.prototype.getDescent = function() {
  return this.getHeight() - this.getAscent();
};
