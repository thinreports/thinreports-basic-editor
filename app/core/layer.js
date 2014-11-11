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
 * @param {thin.editor.Cursor=} opt_cursor
 * @constructor
 * @extends {thin.editor.Rect}
 */
thin.editor.Layer = function(layout, opt_cursor) {
  goog.base(this, layout.createSvgElement('rect'),
      layout, null, new goog.graphics.SolidFill('#FFFFFF', 0.01));
  
  if (opt_cursor) {
    this.setCursor(opt_cursor);
  }

  var size = layout.getNormalLayoutSize();

  this.setBounds(new goog.math.Rect(0, 0, size.width, size.height));
  this.setVisibled(false);
};
goog.inherits(thin.editor.Layer, thin.editor.Rect);


/**
 * @param {thin.editor.Cursor} cursor
 */
thin.editor.Layer.prototype.setCursor = function(cursor) {
  delete this.cursor_;
  goog.base(this, 'setCursor', cursor);
  this.getLayout().setElementCursor(this.getElement(), cursor);
};


/** @inheritDoc */
thin.editor.Layer.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  delete this.cursor_;
};
