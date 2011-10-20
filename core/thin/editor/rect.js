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

goog.provide('thin.editor.Rect');

goog.require('goog.graphics.SvgRectElement');
goog.require('thin.editor.ModuleElement');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @constructor
 * @extends {goog.graphics.SvgRectElement}
 */
thin.editor.Rect = function(element, layout, stroke, fill) {
  goog.graphics.SvgRectElement.call(this, element, layout, stroke, fill);
  
  /**
   * @type {number}
   * @private
   */
  this.left_ = Number(layout.getElementAttribute(element, 'x'));
  
  /**
   * @type {number}
   * @private
   */
  this.top_ = Number(layout.getElementAttribute(element, 'y'));
  
  /**
   * @type {number}
   * @private
   */
  this.width_ = Number(layout.getElementAttribute(element, 'width'));
  
  /**
   * @type {number}
   * @private
   */
  this.height_ = Number(layout.getElementAttribute(element, 'height'));
};
goog.inherits(thin.editor.Rect, goog.graphics.SvgRectElement);
goog.mixin(thin.editor.Rect.prototype, thin.editor.ModuleElement.prototype);  


/**
 * @type {number}
 */
thin.editor.Rect.DEFAULT_RADIUS = 0;


/**
 * @type {number}
 * @private
 */
thin.editor.Rect.prototype.radius_;


/**
 * @param {number} left
 */
thin.editor.Rect.prototype.setLeft = function(left) {
  left = thin.numberWithPrecision(left - this.getParentTransLateX());
  this.left_ = left;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x': left
  });
};


/**
 * @param {number} top
 */
thin.editor.Rect.prototype.setTop = function(top) {
  top = thin.numberWithPrecision(top - this.getParentTransLateY());
  this.top_ = top;
  this.getLayout().setElementAttributes(this.getElement(), {
    'y': top
  });
};


/**
 * @param {number} width
 */
thin.editor.Rect.prototype.setWidth = function(width) {
  width = thin.numberWithPrecision(width);
  this.width_ = width;
  this.getLayout().setElementAttributes(this.getElement(), {
    'width': width
  });
};


/**
 * @param {number} height
 */
thin.editor.Rect.prototype.setHeight = function(height) {
  height = thin.numberWithPrecision(height);
  this.height_ = height;
  this.getLayout().setElementAttributes(this.getElement(), {
    'height': height
  });
};


/**
 * @param {number} radius
 */
thin.editor.Rect.prototype.setRounded = function(radius) {
  this.getLayout().setElementAttributes(this.getElement(), {
    'rx': radius,
    'ry': radius
  });
  this.radius_ = radius;
};


/**
 * @return {number}
 */
thin.editor.Rect.prototype.getRounded = function() {
  return /** @type {number} */(thin.getValIfNotDef(this.radius_, 
             thin.editor.Rect.DEFAULT_RADIUS));
};