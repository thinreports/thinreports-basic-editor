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

goog.provide('thin.editor.DrawActionLayer');

goog.require('thin.editor.ActionLayer');
goog.require('thin.editor.Cursor');
goog.require('thin.editor.Cursor.Type');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.ActionLayer}
 */
thin.editor.DrawActionLayer = function(layout) {
  goog.base(this, layout, this.getDefaultCursor_());
};
goog.inherits(thin.editor.DrawActionLayer, thin.editor.ActionLayer);


/**
 * @type {boolean}
 * @private
 */
thin.editor.DrawActionLayer.prototype.drawable_ = true;


thin.editor.DrawActionLayer.prototype.resetCursor = function() {
  this.setCursor(this.getDefaultCursor_());
};


/**
 * @return {thin.editor.Cursor}
 * @private
 */
thin.editor.DrawActionLayer.prototype.getDefaultCursor_ = function() {
  return new thin.editor.Cursor(
      thin.editor.Cursor.Type.CROSSHAIR);
};


/**
 * @param {boolean} drawable
 */
thin.editor.DrawActionLayer.prototype.setDrawable = function(drawable) {
  if (drawable) {
    this.resetCursor();
  } else {
    this.setCursor(new thin.editor.Cursor(thin.editor.Cursor.Type.NOTALLOWED));
  }
  var drawer = this.getDrawer();
  if (drawer) {
   drawer.setEnabled(drawable);
  }
};


/**
 * @param {boolean} visible
 */
thin.editor.DrawActionLayer.prototype.setVisibled = function(visible) {
  goog.base(this, 'setVisibled', visible);

  if (visible) {
    this.setDrawable(true);
  }
};
