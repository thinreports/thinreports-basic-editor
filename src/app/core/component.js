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


/** @inheritDoc */
thin.core.Component.prototype.disposeInternal = function() {
  thin.core.Component.superClass_.disposeInternal.call(this);
  delete this.workspace_;
};