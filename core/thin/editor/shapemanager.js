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

goog.provide('thin.editor.ShapeManager');

goog.require('thin.editor.AbstractManager');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.AbstractManager}
 */
thin.editor.ShapeManager = function(layout) {
  thin.editor.AbstractManager.call(this, layout);
};
goog.inherits(thin.editor.ShapeManager, thin.editor.AbstractManager);


/** @inheritDoc */
thin.editor.ShapeManager.prototype.disposeInternal = function() {
  goog.array.forEach(this.get(), function(shape) {
    shape.dispose();
  });
  thin.editor.ShapeManager.superClass_.disposeInternal.call(this);
};