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

goog.provide('thin.core.SvgResizer');
goog.provide('thin.core.SvgResizer.Horizon');
goog.provide('thin.core.SvgResizer.Vertical');

goog.require('goog.math.Size');
goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('thin.core.DragEvent');
goog.require('thin.core.AbstractDragger');
goog.require('thin.core.AbstractDragger.EventType');


/**
 * @param {goog.graphics.Element} target
 * @param {goog.graphics.Element} handle
 * @param {string=} opt_widthDirection
 * @param {string=} opt_heightDirection
 * @constructor
 * @extends {thin.core.AbstractDragger}
 */
thin.core.SvgResizer = function(target, handle, 
                                  opt_widthDirection, opt_heightDirection) {

  thin.core.AbstractDragger.call(this, target, handle);

  this.setResizeDirectionToHorizon(opt_widthDirection || thin.core.SvgResizer.Horizon.LEFT);
  this.setResizeDirectionToVertical(opt_heightDirection || thin.core.SvgResizer.Vertical.TOP);
  this.setAspectObserve(true);
};
goog.inherits(thin.core.SvgResizer, thin.core.AbstractDragger);


/**
 * @enum {string}
 */
thin.core.SvgResizer.Horizon = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right'
};


/**
 * @enum {string}
 */
thin.core.SvgResizer.Vertical = {
  TOP: 'top',
  MIDDLE: 'middle',
  BOTTOM: 'bottom'
};


/**
 * @type {number}
 * @private
 */
thin.core.SvgResizer.prototype.transLateX_ = 0;


/**
 * @type {number}
 * @private
 */
thin.core.SvgResizer.prototype.transLateY_ = 0;


/**
 * @type {number}
 * @private
 */
thin.core.SvgResizer.prototype.scaleX_ = 1;


/**
 * @type {number}
 * @private
 */
thin.core.SvgResizer.prototype.scaleY_ = 1;


/**
 * @type {boolean}
 * @private
 */
thin.core.SvgResizer.prototype.enableTransScale_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.SvgResizer.prototype.enableCoordinate_ = true;


/**
 * @type {boolean}
 * @private
 */
thin.core.SvgResizer.prototype.isStandardWidth_ = false;


/**
 * @type {number}
 * @private
 */
thin.core.SvgResizer.prototype.rateWidth_;


/**
 * @type {number}
 * @private
 */
thin.core.SvgResizer.prototype.rateHeight_;


/**
 * @type {goog.math.Rect}
 * @private
 */
thin.core.SvgResizer.prototype.startShapeBounds_;


/**
 * @type {goog.math.Rect}
 * @private
 */
thin.core.SvgResizer.prototype.endShapeBounds_;


/**
 * @type {boolean}
 * @private
 */
thin.core.SvgResizer.prototype.isTop_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.SvgResizer.prototype.isBottom_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.SvgResizer.prototype.isMiddle_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.SvgResizer.prototype.isLeft_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.SvgResizer.prototype.isRight_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.SvgResizer.prototype.isCenter_ = false;


/**
 * @param {string} hdirection
 */
thin.core.SvgResizer.prototype.setResizeDirectionToHorizon = function(hdirection) {
  var horizon = thin.core.SvgResizer.Horizon;
  this.isLeft_ = hdirection == horizon.LEFT;
  this.isCenter_ = hdirection == horizon.CENTER;
  this.isRight_ = hdirection == horizon.RIGHT;
};


/**
 * @param {string} vdirection
 */
thin.core.SvgResizer.prototype.setResizeDirectionToVertical = function(vdirection) {
  var vertical = thin.core.SvgResizer.Vertical;
  this.isTop_ = vdirection == vertical.TOP;
  this.isMiddle_ = vdirection == vertical.MIDDLE;
  this.isBottom_ = vdirection == vertical.BOTTOM;
};


/**
 * @return {boolean}
 */
thin.core.SvgResizer.prototype.isVertex = function() {
  var isTopVertex = (this.isTop_ && this.isLeft_) || (this.isTop_ && this.isRight_);
  var isBottomVertex = (this.isBottom_ && this.isLeft_) || (this.isBottom_ && this.isRight_);
  return isTopVertex || isBottomVertex;
};


/**
 * @param {boolean} setting
 */
thin.core.SvgResizer.prototype.setResizeModeByCoordinate = function(setting) {
  this.enableCoordinate_ = setting;
};


/**
 * @param {boolean} setting
 */
thin.core.SvgResizer.prototype.setResizeModeByTransScale = function(setting) {
  this.enableTransScale_ = setting;
};


/**
 * @return {boolean}
 */
thin.core.SvgResizer.prototype.isResizeModeByCoordinate = function() {
  return this.enableCoordinate_;
};


/**
 * @return {boolean}
 */
thin.core.SvgResizer.prototype.isResizeModeByTransScale = function() {
  return this.enableTransScale_;
};


/**
 * @param {goog.math.Coordinate} coord
 */
thin.core.SvgResizer.prototype.setResizeTransLate = function(coord) {
  this.transLateX_ = coord.x;
  this.transLateY_ = coord.y;
};


/**
 * @return {goog.math.Coordinate}
 */
thin.core.SvgResizer.prototype.getTransLate = function() {
  return new goog.math.Coordinate(this.transLateX_, this.transLateY_);
};


/**
 * @return {goog.math.Rect}
 */
thin.core.SvgResizer.prototype.getStartShapeBounds = function() {
  return this.startShapeBounds_;
};


/**
 * @return {goog.math.Rect}
 */
thin.core.SvgResizer.prototype.getEndShapeBounds = function() {
  return this.endShapeBounds_;
};


/**
 * @return {goog.math.Coordinate}
 */
thin.core.SvgResizer.prototype.getScale = function() {
  return new goog.math.Coordinate(this.scaleX_, this.scaleY_);
};


/**
 * @param {goog.events.BrowserEvent} e
 * @return {goog.math.Coordinate}
 * @private
 */
thin.core.SvgResizer.prototype.calculatePosition_ = function(e) {
  
  var coordinate = thin.core.SvgResizer.superClass_.calculatePosition_.call(this, e);
  var limits = this.limits.toBox();
  return new goog.math.Coordinate(this.isCenter_ ? limits.right : coordinate.x, this.isMiddle_ ? limits.top : coordinate.y);
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
thin.core.SvgResizer.prototype.initializeDrag_ = function(e) {
  delete this.endShapeBounds_;
  var layout = this.getLayout();
  var listHelper = layout.getHelpers().getListHelper();
  var activeShapeManager = !listHelper.isActive() ? layout.getManager().getActiveShape() : listHelper.getActiveShape();
  
  if (activeShapeManager.isSingle()) {
    this.setResizeModeByCoordinate(true);
    this.setResizeModeByTransScale(false);
  } else if (activeShapeManager.isMultiple()) {
    this.setResizeModeByCoordinate(false);
    this.setResizeModeByTransScale(true);
  }
  thin.core.SvgResizer.superClass_.initializeDrag_.call(this, e);
};


/** @inheritDoc */
thin.core.SvgResizer.prototype.doDrag = function(e, x, y, dragFromScroll) {
  if (e.shiftKey || this.targetShape.getTargetShape().instanceOfImageShape()) {
    var coordinate = this.onShiftKeyPress_(e, x, y);
    x = coordinate.x;
    y = coordinate.y;
  }
  this.defaultAction(e, x, y);
  
  this.dispatchEvent(new thin.core.DragEvent(
        goog.fx.Dragger.EventType.DRAG, this, e.clientX, e.clientY, e, x, y));
};


/**
 * @param {goog.events.BrowserEvent} e
 * @param {boolean=} opt_dragCanceled
 */
thin.core.SvgResizer.prototype.endDrag = function(e, opt_dragCanceled) {
  thin.core.SvgResizer.superClass_.endDrag.call(this, e, opt_dragCanceled);
  this.isStandardWidth_ = false;
  this.setResizeTransLate(new goog.math.Coordinate(0, 0));
  this.scaleX_ = 1;
  this.scaleY_ = 1;
  delete this.startShapeBounds_;
};


/**
 * @param {goog.events.BrowserEvent} e
 * @param {number} x
 * @param {number} y
 * @return {goog.math.Coordinate}
 * @private
 */
thin.core.SvgResizer.prototype.onShiftKeyPress_ = function(e, x, y) {

  if (this.aspect_) {

    var limits = this.limits;
    var limitBox = limits.toBox();

    var limitLeft = limits.left;
    var limitTop = limits.top;
    var limitWidth = limits.width;
    var limitHeight = limits.height;
    var limitRight = limitBox.right;
    var limitBottom = limitBox.bottom;

    var rateHeight = this.rateHeight_;
    var rateWidth = this.rateWidth_;
    
    var currentPos = new goog.math.Coordinate(x, y);
    
    var oldX = currentPos.x;
    var oldY = currentPos.y;

    var maxSize = new goog.math.Size(
                    Math.abs(this.startDragX_ - oldX),
                    Math.abs(this.startDragY_ - oldY)).getLongest();
    
    var unlimitedSize = this.isStandardWidth_ ?
                          new goog.math.Size(maxSize, maxSize * rateHeight) :
                          new goog.math.Size(maxSize * rateWidth, maxSize);

    var isLeft = this.isLeft_;
    var isTop = this.isTop_;

    var unlimitedPos = new goog.math.Coordinate(
                         isLeft ?
                           limitRight - unlimitedSize.width :
                           limitLeft + unlimitedSize.width,
                         isTop ?
                           limitBottom - unlimitedSize.height :
                           limitTop + unlimitedSize.height);

    var cancelAbsorption = e.altKey;
    var limitedPos = new goog.math.Coordinate(
                       this.limitX(unlimitedPos.x, cancelAbsorption),
                       this.limitY(unlimitedPos.y, cancelAbsorption));
    
    var limitedX = limitedPos.x;
    var limitedY = limitedPos.y;
    
    x = limitedPos.x;
    y = limitedPos.y;

    if (!goog.math.Coordinate.equals(unlimitedPos, limitedPos)) {
      var delta = goog.math.Coordinate.difference(unlimitedPos, limitedPos);

      if (delta.x != 0) {

        var limitedWidth = isLeft ? limitRight - limitedPos.x :
                                    limitedPos.x - limitLeft;

        var limitedHeight = limitedWidth * rateHeight;
        y = isTop ? limitBottom - limitedHeight :
                    limitTop + limitedHeight;
        y = thin.numberWithPrecision(y);
      }
      
      if (delta.y != 0) {
        var limitedHeight = isTop ? limitBottom - limitedPos.y :
                                    limitedPos.y - limitTop;

        var limitedWidth = limitedHeight * this.rateWidth_;
        x = isLeft ? limitRight - limitedWidth :
                     limitLeft + limitedWidth;
        x = thin.numberWithPrecision(x);
      }
    }
    
    this.dispatchEvent(new thin.core.DragEvent(
                         thin.core.AbstractDragger.EventType.SHIFTKEYPRESS,
                         this, e.clientX, e.clientY, e, x, y, oldX, oldY));

  }
  return new goog.math.Coordinate(x, y);
};


/**
 * @param {goog.math.Rect} targetShapeBounds
 * @return {goog.math.Coordinate}
 */
thin.core.SvgResizer.prototype.calculateTranslateForResize = function(targetShapeBounds) {
  
  var targetShapeBox = targetShapeBounds.toBox();
  return new goog.math.Coordinate(this.isLeft_ ? targetShapeBox.right :
                                                 targetShapeBounds.left,
                                  this.isBottom_ ? targetShapeBounds.top :
                                                   targetShapeBox.bottom);
};


/**
 * @param {goog.math.Rect} targetShapeBounds
 * @param {goog.math.Box} canvasBox
 * @return {goog.math.Rect}
 */
thin.core.SvgResizer.prototype.calculateLimitsForResize = function(targetShapeBounds, canvasBox) {

  var targetShapeBox = targetShapeBounds.toBox();
  this.startShapeBounds_ = targetShapeBounds;
  
  var limitLeft = 0;
  var limitTop = 0;
  var limitWidth = 0;
  var limitHeight = 0;
  
  if (this.isLeft_) {
    limitLeft = canvasBox.left;
    limitWidth = targetShapeBox.right - canvasBox.left;
  }
  
  if (this.isCenter_) {
    limitLeft = targetShapeBounds.left;
    limitWidth = targetShapeBounds.width;
  }
  
  if (this.isRight_) {
    limitLeft = targetShapeBounds.left;
    limitWidth = canvasBox.right - targetShapeBounds.left;
  }
  
  if (this.isTop_) {
    limitTop = canvasBox.top;
    limitHeight = targetShapeBox.bottom - canvasBox.top;
  }
  
  if (this.isMiddle_) {
    limitTop = targetShapeBounds.top;
    limitHeight = targetShapeBounds.height;
  }
  
  if (this.isBottom_) {
    limitTop = targetShapeBounds.top;
    limitHeight = canvasBox.bottom - targetShapeBounds.top;
  }
  
  return new goog.math.Rect(limitLeft, limitTop, limitWidth, limitHeight);
};


/**
 * @private
 */
thin.core.SvgResizer.prototype.initializeLimits_ = function() {
  var layout = this.getLayout();
  var targetShape = this.targetShape;
  var listHelper = layout.getHelpers().getListHelper();
  var targetShapeBounds = targetShape.getBounds();
  var canvasBox = layout.getBounds().toBox();
  
  if (listHelper.isActive()) {
    if (listHelper.getActiveShape().isMultiple()) {
      var captureActiveSectionName = listHelper.getActiveSectionName();
      canvasBox = listHelper.getActiveRow().getBounds().toBox();
      // canvasBox = listHelper.getTarget().getActiveRow().getBounds().toBox();
      // canvasBox = listHelper.getTarget().getSectionShape(captureActiveSectionName).getBounds().toBox();
    } else {
      if (!targetShape.instanceOfDraggableLine() && targetShape instanceof thin.core.GuideHelper) {
        // var sectionShapeForScope = listHelper.getTarget().getSectionShape(
        //       targetShape.getTargetShape().getAffiliationSectionName());
        // canvasBox = sectionShapeForScope.getBounds().toBox();
        var guide = targetShape;
        canvasBox = guide.getTargetShape().getAffiliationRegionBounds().toBox();
      }
    }
  }
  
  var startWidth = targetShapeBounds.width;
  var startHeight = targetShapeBounds.height;
  this.isStandardWidth_ = startWidth > startHeight;
  this.rateWidth_ = startWidth / startHeight;
  this.rateHeight_ = startHeight / startWidth;
  
  this.setLimits(this.calculateLimitsForResize(targetShapeBounds, canvasBox));
  this.setResizeTransLate(this.calculateTranslateForResize(targetShapeBounds));
};


/**
 * @param {number} x
 * @param {number} y
 * @private
 */
thin.core.SvgResizer.prototype.initializeStartPosition_ = function(x, y) {
  var transLate = this.getTransLate();
  this.startDragX_ = transLate.x;
  this.startDragY_ = transLate.y;
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
thin.core.SvgResizer.prototype.defaultAction = function(e, x, y) {
  var startX = this.startDragX_;
  var startY = this.startDragY_;
  var sizeLimit = this.sizeLimitFunction_ || this.defaultSizeLimit_;
  var startBounds = this.startShapeBounds_;
  var nowBounds = sizeLimit.call(this, new goog.math.Rect(
                    new goog.math.Size(startX, x).getShortest(),
                    new goog.math.Size(startY, y).getShortest(),
                    Math.abs(startX - x),
                    Math.abs(startY - y)), startBounds);
  
  this.endShapeBounds_ = nowBounds;

  if (this.enableTransScale_) {
    this.scaleX_ = nowBounds.width / startBounds.width;
    this.scaleY_ = nowBounds.height / startBounds.height;
    this.targetShape.setBounds(nowBounds);
  }
  
  if (this.enableCoordinate_) {
    this.targetShape.getTargetShape().getTargetOutline().setBounds(nowBounds);
  }
};


/**
 * @param {Function} fn
 */
thin.core.SvgResizer.prototype.setSizeLimitFunction = function(fn) {
  if (goog.isFunction(fn)) {
    this.sizeLimitFunction_ = fn;
  } else {
    throw new Error('argument is notFunction');
  }
};


thin.core.SvgResizer.prototype.initSizeLimitFunction = function() {
  delete this.sizeLimitFunction_;
};


/**
 * @param {goog.math.Rect} nowBounds
 * @return {goog.math.Rect}
 * @private
 */
thin.core.SvgResizer.prototype.defaultSizeLimit_ = function(nowBounds) {
  var width = nowBounds.width;
  var height = nowBounds.height;
  return new goog.math.Rect(thin.numberWithPrecision(nowBounds.left),
                            thin.numberWithPrecision(nowBounds.top),
                            width == 0 ? 1 : thin.numberWithPrecision(width),
                            height == 0 ? 1 : thin.numberWithPrecision(height));
};


/** @inheritDoc */
thin.core.SvgResizer.prototype.disposeInternal = function() {
  thin.core.SvgResizer.superClass_.disposeInternal.call(this);
  delete this.startShapeBounds_;
  delete this.endShapeBounds_;
};
