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

goog.provide('thin.core.SvgDrawer');

goog.require('goog.math.Size');
goog.require('goog.math.Coordinate');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('thin.core.DragEvent');
goog.require('thin.core.AbstractDragger');
goog.require('thin.core.AbstractDragger.EventType');
goog.require('thin.core.SvgDragger');


/**
 * @param {goog.graphics.Element} target
 * @param {goog.graphics.Element=} opt_handle
 * @constructor
 * @extends {thin.core.AbstractDragger}
 */
thin.core.SvgDrawer = function(target, opt_handle) {
  thin.core.AbstractDragger.call(this, target, opt_handle);
};
goog.inherits(thin.core.SvgDrawer, thin.core.AbstractDragger);


/**
 * @type {number}
 * @private
 */
thin.core.SvgDragger.prototype.revisionX_ = 0;


/**
 * @type {number}
 * @private
 */
thin.core.SvgDragger.prototype.revisionY_ = 0;


/**
 * @type {boolean}
 * @private
 */
thin.core.SvgDragger.prototype.revision_ = false;


/**
 * @param {goog.math.Coordinate} coordinate
 */
thin.core.SvgDrawer.prototype.setRevisionCurrentPosition = function(coordinate) {
  this.revisionX_ = coordinate ? coordinate.x : 0;
  this.revisionY_ = coordinate ? coordinate.y : 0;
  this.revision_ = coordinate ? true : false;
};


/**
 * Event handler that is used to start the drag
 * @param {goog.events.BrowserEvent} e Event object.
 * @private
 */
thin.core.SvgDrawer.prototype.initializeDrag_ = function(e) {
  var clientX = this.clientX_ = e.clientX;
  var clientY = this.clientY_ = e.clientY;
  
  this.initializeRate_();

  var beforerv = this.dispatchEvent(
                    new thin.core.DragEvent(
                       thin.core.AbstractDragger.EventType.BEFORESTART,
                       this, clientX, clientY, /** @type {goog.events.BrowserEvent} */(e)));
  
  if (beforerv === false) {
    this.dragging_ = false;
    return;
  }
  
  var pos = this.calculatePosition_(e);
  
  var startX = pos.x;
  var startY = pos.y;
  
  this.initializeLimits_();
  this.initializeStartPosition_(startX, startY);
  this.initializeDelta_();
  this.calculateDelta_();
  
  var rv = this.dispatchEvent(
             new thin.core.DragEvent(
             goog.fx.Dragger.EventType.START, this, clientX, clientY,
             /** @type {goog.events.BrowserEvent} */(e), startX, startY));
  if (rv !== false) {
    this.dragging_ = true;
  }
};


/**
 * @param {goog.events.BrowserEvent} e
 * @param {boolean=} opt_dragCanceled
 */
thin.core.SvgDrawer.prototype.endDrag = function(e, opt_dragCanceled) {
  thin.core.SvgDrawer.superClass_.endDrag.call(this, e, opt_dragCanceled);
  this.setRevisionCurrentPosition(null);
};

/**
 * @param {goog.events.BrowserEvent} e
 * @param {number} x
 * @param {number} y
 * @return {goog.math.Coordinate}
 * @private
 */
thin.core.SvgDrawer.prototype.onShiftKeyPress_ = function(e, x, y) {
  if (this.aspect_) {
    var startPosX = this.startDragX_;
    var startPosY = this.startDragY_;
    var oldX = x;
    var oldY = y;
    
    var maxSize = new goog.math.Size(
                    Math.abs(startPosX - oldX),
                    Math.abs(startPosY - oldY)).getLongest();
    
    var diff = goog.math.Coordinate.difference(
                 new goog.math.Coordinate(startPosX, startPosY), new goog.math.Coordinate(oldX, oldY));
    
    var isLongStartX = diff.x > 0;
    var isLongStartY = diff.y > 0;
    
    var newPos = new goog.math.Coordinate(
                       isLongStartX ? startPosX - maxSize : startPosX + maxSize,
                       isLongStartY ? startPosY - maxSize : startPosY + maxSize);
    
    var cancelAbsorption = e.altKey;
    var newClientPos = new goog.math.Coordinate(
                         this.limitX(newPos.x, cancelAbsorption),
                         this.limitY(newPos.y, cancelAbsorption));
    
    if (!goog.math.Coordinate.equals(newPos, newClientPos)) {
    
      var newMaxSize = new goog.math.Size(
                         Math.abs(startPosX - newClientPos.x),
                         Math.abs(startPosY - newClientPos.y)).getShortest();
      
      x = thin.numberWithPrecision(isLongStartX ? startPosX - newMaxSize : startPosX + newMaxSize);
      y = thin.numberWithPrecision(isLongStartY ? startPosY - newMaxSize : startPosY + newMaxSize);
      
    } else {
      x = thin.numberWithPrecision(newClientPos.x);
      y = thin.numberWithPrecision(newClientPos.y);
    }

    this.dispatchEvent(new thin.core.DragEvent(
                         thin.core.AbstractDragger.EventType.SHIFTKEYPRESS,
                         this, e.clientX, e.clientY, e, x, y, oldX, oldY));
    
    if (this.revision_ == true) {
      x = thin.numberWithPrecision(
            this.limitX(this.revisionX_, cancelAbsorption));
      y = thin.numberWithPrecision(
            this.limitY(this.revisionY_, cancelAbsorption));
      this.setRevisionCurrentPosition(null);
    };
  }
  return new goog.math.Coordinate(x, y);
};


/**
 * @private
 */
thin.core.SvgDrawer.prototype.initializeLimits_ = function() {
  this.setLimits(this.handleShape.getBounds());
};


/**
 * Overridable function for handling the default action of the drag behaviour.
 * Normally this is simply moving the element to x,y though in some cases it
 * might be used to resize the layer.  This is basically a shortcut to
 * implementing a default ondrag event handler.
 * @param {goog.events.BrowserEvent} e
 * @param {number} x X-coordinate for target element.
 * @param {number} y Y-coordinate for target element.
 */
thin.core.SvgDrawer.prototype.defaultAction = function(e, x, y) {
  this.targetShape.setBoundsByCoordinate(this.startDragX_, this.startDragY_, x, y);
};
