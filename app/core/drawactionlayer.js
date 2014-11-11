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

goog.provide('thin.core.DrawActionLayer');

goog.require('thin.core.ActionLayer');
goog.require('thin.core.Cursor');
goog.require('thin.core.Cursor.Type');


/**
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {thin.core.ActionLayer}
 */
thin.core.DrawActionLayer = function(layout) {
  goog.base(this, layout, this.getDefaultCursor_());
};
goog.inherits(thin.core.DrawActionLayer, thin.core.ActionLayer);


/**
 * @type {boolean}
 * @private
 */
thin.core.DrawActionLayer.prototype.drawable_ = true;


thin.core.DrawActionLayer.prototype.resetCursor = function() {
  this.setCursor(this.getDefaultCursor_());
};


/**
 * @return {thin.core.Cursor}
 * @private
 */
thin.core.DrawActionLayer.prototype.getDefaultCursor_ = function() {
  return new thin.core.Cursor(
      thin.core.Cursor.Type.CROSSHAIR);
};


/**
 * @param {boolean} drawable
 */
thin.core.DrawActionLayer.prototype.setDrawable = function(drawable) {
  if (drawable) {
    this.resetCursor();
  } else {
    this.setCursor(new thin.core.Cursor(thin.core.Cursor.Type.NOTALLOWED));
  }
  var drawer = this.getDrawer();
  if (drawer) {
   drawer.setEnabled(drawable);
  }
};


/**
 * @param {boolean} visible
 */
thin.core.DrawActionLayer.prototype.setVisibled = function(visible) {
  goog.base(this, 'setVisibled', visible);

  if (visible) {
    this.setDrawable(true);
  }
};
