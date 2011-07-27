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

goog.provide('thin.editor.ActiveShapeManager');

goog.require('thin.editor.AbstractManager');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.AbstractManager}
 */
thin.editor.ActiveShapeManager = function(layout) {
  thin.editor.AbstractManager.call(this, layout);
};
goog.inherits(thin.editor.ActiveShapeManager, thin.editor.AbstractManager);


/**
 * @return {goog.graphics.Element?}
 */
thin.editor.ActiveShapeManager.prototype.getIfSingle = function() {
  if (this.isSingle()) {
    return /** @type {goog.graphics.Element} */ (this.factors_[0]);
  } else {
    return null;
  }
};


/**
 * @return {boolean}
 */
thin.editor.ActiveShapeManager.prototype.isAllSelected = function() {
  return this.layout_.getManager().getShapesManager().getCount() == this.getCount();
};