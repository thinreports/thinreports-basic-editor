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

goog.provide('thin.core.toolaction.LineAction');

goog.require('thin.core.toolaction.DrawAction');


/**
 * @constructor
 * @extends {thin.core.toolaction.DrawAction}
 */
thin.core.toolaction.LineAction = function() {
  thin.core.toolaction.DrawAction.call(this);
};
goog.inherits(thin.core.toolaction.LineAction, thin.core.toolaction.DrawAction);


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
thin.core.toolaction.LineAction.prototype.shiftFn_ = function(e) {
  var startX = e.startX;
  var startY = e.startY;
  var endX = e.endX;
  var endY = e.endY;
  var oldX = e.oldX;
  var oldY = e.oldY;
  
  var maxSize = new goog.math.Size(thin.numberWithPrecision(Math.abs(startX - oldX)),
                                   thin.numberWithPrecision(Math.abs(startY - oldY))).getLongest();
  var radius = thin.numberWithPrecision(new goog.math.Size(
                 thin.numberWithPrecision(Math.abs(startX - endX)), 
                 thin.numberWithPrecision(Math.abs(startY - endY))).getLongest() / 2, 2);
  var capturePos = new goog.math.Coordinate(endX, endY);
  
  if (thin.numberWithPrecision((startX - radius)) < oldX &&
      oldX < thin.numberWithPrecision((startX + radius))) {
    endX = startX;
    if (startY <= oldY) {
      endY = startY + maxSize;
    } else {
      endY = startY - maxSize;
    }
  }
  if (thin.numberWithPrecision((startY - radius)) < oldY &&
      oldY < thin.numberWithPrecision((startY + radius))) {
    endY = startY;
    if (startX <= oldX) {
      endX = startX + maxSize;
    } else {
      endX = startX - maxSize;
    }
  }
  
  var newPos = new goog.math.Coordinate(endX, endY);
  
  if (!goog.math.Coordinate.equals(capturePos, newPos)) {
    e.dragger.setRevisionCurrentPosition(newPos);
  }
};


/**
 * @param {number} startX
 * @param {number} startY
 * @param {number} clientX
 * @param {number} clientY
 * @return {boolean}
 * @private
 */
thin.core.toolaction.LineAction.prototype.compareFn_ = function(startX, startY, clientX, clientY) {
  return goog.math.Coordinate.equals(
           new goog.math.Coordinate(startX, startY), 
           new goog.math.Coordinate(clientX, clientY));
};


/**
 * @param {goog.events.BrowserEvent} e
 * @param {thin.core.Workspace} workspace
 * @protected
 */
thin.core.toolaction.LineAction.prototype.handleActionInternal = function(e, workspace) {

  var helpers = this.layout.getHelpers();
  var listHelper = helpers.getListHelper();
  var outline = helpers.getLineOutline();

  var drawLayer = helpers.getDrawLayer();
  this.drawLayerSetup(drawLayer, outline, true, this.shiftFn_);
  drawLayer.setVisibled(true);

  if (listHelper.isActive()) {
    var listDrawLayer;
    listHelper.forEachSectionHelper(function(sectionHelper, sectionName) {
      listDrawLayer = sectionHelper.getDrawLayer();
      this.drawLayerSetup(listDrawLayer, outline, true, this.shiftFn_);
      listDrawLayer.setVisibled(true);
    }, this);
    listHelper.getBlankRangeDrawLayer().setVisibled(true);
  }
};