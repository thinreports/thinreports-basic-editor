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

goog.provide('thin.core.ClipboardShapeManager');

goog.require('thin.core.AbstractManager');


/**
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {thin.core.AbstractManager}
 */
thin.core.ClipboardShapeManager = function(layout) {
  thin.core.AbstractManager.call(this, layout);
};
goog.inherits(thin.core.ClipboardShapeManager, thin.core.AbstractManager);


/**
 * @type {thin.core.ClipboardShapeManager}
 * @private
 */
thin.core.ClipboardShapeManager.instance_;


/**
 * @type {goog.math.Rect}
 * @private
 */
thin.core.ClipboardShapeManager.prototype.shapeBounds_;


/**
 * @type {goog.math.Coordinate}
 * @private
 */
thin.core.ClipboardShapeManager.prototype.deltaCoordinate_;


/**
 * @return {thin.core.ClipboardShapeManager}
 */
thin.core.ClipboardShapeManager.getInstance = function() {
  if (!goog.isDef(thin.core.ClipboardShapeManager.instance_)) {
    thin.core.ClipboardShapeManager.instance_ = new thin.core.ClipboardShapeManager(thin.core.getActiveWorkspace().getLayout());
  }
  return thin.core.ClipboardShapeManager.instance_;
};


/**
 * @param {goog.math.Rect} bounds
 */
thin.core.ClipboardShapeManager.prototype.setShapeBounds = function(bounds) {
  this.shapeBounds_ = bounds;
};


/**
 * @return {goog.math.Rect}
 */
thin.core.ClipboardShapeManager.prototype.getShapeBounds = function() {
  return this.shapeBounds_;
};


/**
 * @param {goog.math.Coordinate} coordinate
 */
thin.core.ClipboardShapeManager.prototype.setDeltaCoordinate = function(coordinate) {
  this.deltaCoordinate_ = coordinate;
};


/**
 * @return {goog.math.Coordinate}
 */
thin.core.ClipboardShapeManager.prototype.getDeltaCoordinate = function() {
  return this.deltaCoordinate_;
};


thin.core.ClipboardShapeManager.prototype.initDeltaCoordinate = function() {
  delete this.deltaCoordinate_;
};