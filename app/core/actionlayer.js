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

goog.provide('thin.core.ActionLayer');

goog.require('thin.core.Layer');


/**
 * @param {thin.core.Layout} layout
 * @param {thin.core.Cursor=} opt_cursor
 * @constructor
 * @extends {thin.core.Layer}
 */
thin.core.ActionLayer = function(layout, opt_cursor) {
  goog.base(this, layout, opt_cursor);
};
goog.inherits(thin.core.ActionLayer, thin.core.Layer);


/**
 * @type {thin.core.SvgDrawer}
 * @private
 */
thin.core.ActionLayer.prototype.drawer_;


/**
 * @param {thin.core.SvgDrawer} drawer
 */
thin.core.ActionLayer.prototype.setDrawer = function(drawer) {
  this.drawer_ = drawer;
};


/**
 * @return {thin.core.SvgDrawer}
 */
thin.core.ActionLayer.prototype.getDrawer = function() {
  return this.drawer_;
};


/** @inheritDoc */
thin.core.ActionLayer.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  if (this.drawer_) {
    this.drawer_.dispose();
    delete this.drawer_;
  }
};
