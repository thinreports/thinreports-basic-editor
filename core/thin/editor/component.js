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

goog.provide('thin.editor.Component');

goog.require('goog.graphics.SvgGroupElement');
goog.require('thin.editor.ModuleElement');


/**
 * @param {thin.editor.Layout} layout
 * @param {Element=} opt_element
 * @constructor
 * @extends {goog.graphics.SvgGroupElement}
 */
thin.editor.Component = function(layout, opt_element) {
  goog.graphics.SvgGroupElement.call(this, 
    opt_element || layout.createSvgElement('g'), layout);
  
  /**
   * @type {thin.editor.Workspace}
   * @private
   */
  this.workspace_ = layout.getWorkspace();
  
  this.setup();
};
goog.inherits(thin.editor.Component, goog.graphics.SvgGroupElement);
goog.mixin(thin.editor.Component.prototype, thin.editor.ModuleElement.prototype);


thin.editor.Component.prototype.setup = goog.nullFunction;


/** @inheritDoc */
thin.editor.Component.prototype.disposeInternal = function() {
  thin.editor.Component.superClass_.disposeInternal.call(this);
  delete this.workspace_;
};