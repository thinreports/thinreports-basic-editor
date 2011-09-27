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

goog.provide('thin.editor.AbstractBoxGroup');

goog.require('thin.editor.Component');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.Component}
 */
thin.editor.AbstractBoxGroup = function(element, layout) {
  goog.base(this, layout, element);
  
  /**
   * @type {number}
   * @private
   */
  this.left_ = Number(layout.getElementAttribute(element, 'x-left'));
  
  /**
   * @type {number}
   * @private
   */
  this.top_ = Number(layout.getElementAttribute(element, 'x-top'));
  
  /**
   * @type {number}
   * @private
   */
  this.width_ = Number(layout.getElementAttribute(element, 'x-width'));
  
  /**
   * @type {number}
   * @private
   */
  this.height_ = Number(layout.getElementAttribute(element, 'x-height'));
};
goog.inherits(thin.editor.AbstractBoxGroup, thin.editor.Component);


/**
 * @type {thin.editor.Box}
 * @private
 */
thin.editor.AbstractBoxGroup.prototype.box_;


/**
 * @param {Element=} opt_element
 * @param {string=} opt_classId
 * @private
 */
thin.editor.AbstractBoxGroup.prototype.createBox_ = function(
      opt_element, opt_classId) {

  var layout = this.getLayout();
  var element = opt_element || layout.createSvgElement('rect');
  
  if (goog.isString(opt_classId)) {
    layout.setElementAttributes(element, {
      'class': opt_classId
    });
  }
  
  return new thin.editor.Box(element, layout, null, null);
};


/**
 * @param {number} left
 */
thin.editor.AbstractBoxGroup.prototype.setLeft = function(left) {
  left = thin.numberWithPrecision(left - this.getParentTransLateX());
  this.left_ = left;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-left': left
  });
  this.box_.setLeft(left);
};


/**
 * @param {number} top
 */
thin.editor.AbstractBoxGroup.prototype.setTop = function(top) {
  top = thin.numberWithPrecision(top - this.getParentTransLateY());
  this.top_ = top;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-top': top
  });
  this.box_.setTop(top);
};


/**
 * @param {number} width
 */
thin.editor.AbstractBoxGroup.prototype.setWidth = function(width) {
  width = thin.numberWithPrecision(width);
  this.width_ = width;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-width': width
  });
  this.box_.setWidth(width);
};


/**
 * @param {number} height
 */
thin.editor.AbstractBoxGroup.prototype.setHeight = function(height) {
  height = thin.numberWithPrecision(height);
  this.height_ = height;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-height': height
  });
  this.box_.setHeight(height);
};


/** @inheritDoc */
thin.editor.AbstractBoxGroup.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.box_.dispose();
  delete this.box_;
};