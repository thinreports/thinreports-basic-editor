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

goog.provide('thin.core.Component');

goog.require('goog.graphics.SvgGroupElement');
goog.require('thin.core.ModuleElement');


/**
 * @param {thin.core.Layout} layout
 * @param {Element=} opt_element
 * @constructor
 * @extends {goog.graphics.SvgGroupElement}
 */
thin.core.Component = function(layout, opt_element) {
  goog.graphics.SvgGroupElement.call(this, 
    opt_element || layout.createSvgElement('g'), layout);
  
  /**
   * @type {thin.core.Workspace}
   * @private
   */
  this.workspace_ = layout.getWorkspace();
  
  this.setup();
};
goog.inherits(thin.core.Component, goog.graphics.SvgGroupElement);
goog.mixin(thin.core.Component.prototype, thin.core.ModuleElement.prototype);


thin.core.Component.prototype.setup = goog.nullFunction;


/**
 * The latest fill applied to this element.
 * @type {goog.graphics.Fill?}
 * @protected
 */
thin.core.Component.prototype.fill = null;


/**
 * The latest stroke applied to this element.
 * @type {goog.graphics.Stroke?}
 * @private
 */
thin.core.Component.prototype.stroke_ = null;


/**
 * Sets the fill for this element.
 * @param {goog.graphics.Fill?} fill The fill object.
 */
thin.core.Component.prototype.setFill = function(fill) {
  this.fill = fill;
  this.setFillInternal();
};


/**
 * @return {goog.graphics.Fill?} fill The fill object.
 */
thin.core.Component.prototype.getFill = function() {
  return this.fill;
};


/**
 * Sets the stroke for this element.
 * @param {goog.graphics.Stroke?} stroke The stroke object.
 */
thin.core.Component.prototype.setStroke = function(stroke) {
  this.stroke_ = stroke;
  this.setStrokeInternal();
};


/**
 * @return {goog.graphics.Stroke?} stroke The stroke object.
 */
thin.core.Component.prototype.getStroke = function() {
  return this.stroke_;
};


thin.core.Component.prototype.setFillInternal = goog.abstractMethod;


thin.core.Component.prototype.setStrokeInternal = goog.abstractMethod;


thin.core.Component.prototype.getStrokeWidth = goog.abstractMethod;


/** @inheritDoc */
thin.core.Component.prototype.disposeInternal = function() {
  thin.core.Component.superClass_.disposeInternal.call(this);
  delete this.workspace_;
};