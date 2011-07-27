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

goog.provide('thin.editor.ClipboardShapeManager');

goog.require('thin.editor.AbstractManager');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.AbstractManager}
 */
thin.editor.ClipboardShapeManager = function(layout) {
  thin.editor.AbstractManager.call(this, layout);
};
goog.inherits(thin.editor.ClipboardShapeManager, thin.editor.AbstractManager);


/**
 * @type {thin.editor.ClipboardShapeManager}
 * @private
 */
thin.editor.ClipboardShapeManager.instance_;


/**
 * @type {goog.math.Rect}
 * @private
 */
thin.editor.ClipboardShapeManager.prototype.shapeBounds_;


/**
 * @type {goog.math.Coordinate}
 * @private
 */
thin.editor.ClipboardShapeManager.prototype.deltaCoordinate_;


/**
 * @return {thin.editor.ClipboardShapeManager}
 */
thin.editor.ClipboardShapeManager.getInstance = function() {
  if (!goog.isDef(thin.editor.ClipboardShapeManager.instance_)) {
    thin.editor.ClipboardShapeManager.instance_ = new thin.editor.ClipboardShapeManager(thin.editor.getActiveWorkspace().getLayout());
  }
  return thin.editor.ClipboardShapeManager.instance_;
};


/**
 * @param {goog.math.Rect} bounds
 */
thin.editor.ClipboardShapeManager.prototype.setShapeBounds = function(bounds) {
  this.shapeBounds_ = bounds;
};


/**
 * @return {goog.math.Rect}
 */
thin.editor.ClipboardShapeManager.prototype.getShapeBounds = function() {
  return this.shapeBounds_;
};


/**
 * @param {goog.math.Coordinate} coordinate
 */
thin.editor.ClipboardShapeManager.prototype.setDeltaCoordinate = function(coordinate) {
  this.deltaCoordinate_ = coordinate;
};


/**
 * @return {goog.math.Coordinate}
 */
thin.editor.ClipboardShapeManager.prototype.getDeltaCoordinate = function() {
  return this.deltaCoordinate_;
};


thin.editor.ClipboardShapeManager.prototype.initDeltaCoordinate = function() {
  delete this.deltaCoordinate_;
};