//  Copyright (C) 2010 Matsukei Co.,Ltd.
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

goog.provide('thin.editor.AbstractText');

goog.require('goog.graphics.SvgTextElement');
goog.require('thin.editor.ModuleElement');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @constructor
 * @extends {goog.graphics.SvgTextElement}
 */
thin.editor.AbstractText = function(element, layout, stroke, fill) {
  goog.graphics.SvgTextElement.call(this, element, layout, stroke, fill);
};
goog.inherits(thin.editor.AbstractText, goog.graphics.SvgTextElement);
goog.mixin(thin.editor.AbstractText.prototype, thin.editor.ModuleElement.prototype);


/**
 * @type {string}
 */
thin.editor.AbstractText.DEFAULT_TEXTCONTENT = '';


/**
 * @return {boolean}
 */
thin.editor.AbstractText.prototype.isExistsData = function() {
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
thin.editor.AbstractText.prototype.setText = function(text) {
  if (!this.isExistsData()) {
    this.getElement().appendChild(goog.dom.getDocument().createTextNode(
        thin.editor.AbstractText.DEFAULT_TEXTCONTENT));
  }
  thin.editor.AbstractText.superClass_.setText.call(this, text);
};


/**
 * @return {string}
 */
thin.editor.AbstractText.prototype.getText = function() {
  if (this.isExistsData()) {
    return this.getElement().firstChild.data;
  } else {
    return thin.editor.AbstractText.DEFAULT_TEXTCONTENT;
  }
};


/**
 * @param {number} left
 */
thin.editor.AbstractText.prototype.setLeft = function(left) {
  left = thin.editor.numberWithPrecision(left - this.getParentTransLateX());
  this.left_ = left;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x': left
  });
};


/**
 * @param {number} top
 */
thin.editor.AbstractText.prototype.setTop = function(top) {
  top = thin.editor.numberWithPrecision(top - this.getParentTransLateY());
  this.top_ = top;
  this.getLayout().setElementAttributes(this.getElement(), {
    'y': top
  });
};


/**
 * @return {number}
 */
thin.editor.AbstractText.prototype.getHeight = function() {
  this.height_ = this.getElement()['getBBox']().height;
  return this.height_;
};


/**
 * @return {number}
 */
thin.editor.AbstractText.prototype.getWidth = function() {
  this.width_ = this.getElement()['getBBox']().width;
  return this.width_;
};