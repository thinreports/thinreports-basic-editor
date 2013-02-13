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

goog.provide('thin.editor.ActionLayer');

goog.require('thin.editor.Layer');


/**
 * @param {thin.editor.Layout} layout
 * @param {thin.editor.Cursor=} opt_cursor
 * @constructor
 * @extends {thin.editor.Layer}
 */
thin.editor.ActionLayer = function(layout, opt_cursor) {
  goog.base(this, layout, opt_cursor);
};
goog.inherits(thin.editor.ActionLayer, thin.editor.Layer);


/**
 * @type {thin.editor.SvgDrawer}
 * @private
 */
thin.editor.ActionLayer.prototype.drawer_;


/**
 * @param {thin.editor.SvgDrawer} drawer
 */
thin.editor.ActionLayer.prototype.setDrawer = function(drawer) {
  this.drawer_ = drawer;
};


/**
 * @return {thin.editor.SvgDrawer}
 */
thin.editor.ActionLayer.prototype.getDrawer = function() {
  return this.drawer_;
};


/** @inheritDoc */
thin.editor.ActionLayer.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  if (this.drawer_) {
    this.drawer_.dispose();
    delete this.drawer_;
  }
};
