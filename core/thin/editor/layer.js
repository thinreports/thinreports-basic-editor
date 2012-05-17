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

goog.provide('thin.editor.Layer');

goog.require('thin.editor.Rect');
goog.require('thin.editor.SvgDrawer');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.Rect}
 */
thin.editor.Layer = function(layout) {
  thin.editor.Rect.call(this, layout.createSvgElement('rect'),
      layout, null, new goog.graphics.SolidFill('#FFFFFF', 0.01));
  
  var size = layout.getNormalLayoutSize();
  this.setBounds(new goog.math.Rect(0, 0, size.width, size.height));
  this.setVisibled(false);
};
goog.inherits(thin.editor.Layer, thin.editor.Rect);


/**
 * @type {thin.editor.SvgDrawer}
 * @private
 */
thin.editor.Layer.prototype.drawer_;


thin.editor.Layer.prototype.setDrawer = function(drawer) {
  this.drawer_ = drawer;
};


/** @inheritDoc */
thin.editor.Layer.prototype.disposeInternal = function() {
  thin.editor.Layer.superClass_.disposeInternal.call(this);
  var drawer = this.drawer_;
  if (goog.isDef(drawer)) {
    drawer.dispose();
    delete this.drawer_;
  }
};