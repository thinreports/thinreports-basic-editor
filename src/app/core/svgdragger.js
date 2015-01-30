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

goog.provide('thin.core.SvgDragger');

goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('thin.core.AbstractDragger');


/**
 * @param {goog.graphics.Element} target
 * @param {goog.graphics.Element=} opt_handle
 * @constructor
 * @extends {thin.core.AbstractDragger}
 */
thin.core.SvgDragger = function(target, opt_handle) {
  thin.core.AbstractDragger.call(this, target, opt_handle);
};
goog.inherits(thin.core.SvgDragger, thin.core.AbstractDragger);


/**
 * @type {number}
 * @private
 */
thin.core.SvgDragger.prototype.startTransLateX_ = 0;


/**
 * @type {number}
 * @private
 */
thin.core.SvgDragger.prototype.startTransLateY_ = 0;


/**
 * @type {boolean}
 * @private
 */
thin.core.SvgDragger.prototype.enableTransLate_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.SvgDragger.prototype.enableXCoordinate_ = true;


/**
 * @type {boolean}
 * @private
 */
thin.core.SvgDragger.prototype.enableYCoordinate_ = true;


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
thin.core.SvgDragger.prototype.initializeDrag_ = function(e) {
  thin.core.SvgDragger.superClass_.initializeDrag_.call(this, e);
  var deltaPos = this.getDeltaPosition();
  this.startTransLateX_ = this.startDragX_ + deltaPos.x;
  this.startTransLateY_ = this.startDragY_ + deltaPos.y;
};


/**
 * @param {goog.events.BrowserEvent} e
 * @param {boolean=} opt_dragCanceled
 */
thin.core.SvgDragger.prototype.endDrag = function(e, opt_dragCanceled) {
  thin.core.SvgDragger.superClass_.endDrag.call(this, e, opt_dragCanceled);
  this.startTransLateX_ = 0;
  this.startTransLateY_ = 0;
};


/** @inheritDoc */
thin.core.SvgDragger.prototype.setupDragHandlers = function() {
  if (!this.scrollTarget_) {
    this.setScrollTarget(this.getWorkspace().getParent().getParent().getContentElement());
  }
  thin.core.SvgDragger.superClass_.setupDragHandlers.call(this);
};


/**
 * @param {boolean} setting
 */
thin.core.SvgDragger.prototype.setEnableXCoordinate = function(setting) {
  this.enableXCoordinate_ = setting;
};


/**
 * @param {boolean} setting
 */
thin.core.SvgDragger.prototype.setEnableYCoordinate = function(setting) {
  this.enableYCoordinate_ = setting;
};


/**
 * @param {boolean} xsetting
 * @param {boolean} ysetting
 */
thin.core.SvgDragger.prototype.setDragModeByCoordinate = function(xsetting, ysetting) {
  this.setEnableXCoordinate(xsetting);
  this.setEnableYCoordinate(ysetting);
};


/**
 * @param {boolean} setting
 */
thin.core.SvgDragger.prototype.setDragModeByTranslate = function(setting) {
  this.enableTransLate_ = setting;
};


/**
 * @return {goog.math.Coordinate}
 */
thin.core.SvgDragger.prototype.getStartTransLatePosition = function() {
  return new goog.math.Coordinate(this.startTransLateX_, this.startTransLateY_);
};


/**
 * @param {goog.events.BrowserEvent} e
 * @param {number} x
 * @param {number} y
 * @return {goog.math.Coordinate}
 * @private
 */
thin.core.SvgDragger.prototype.onShiftKeyPress_ = function(e, x, y) {
  return new goog.math.Coordinate(x, y);
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
thin.core.SvgDragger.prototype.onScroll_ = function(e) {

  var clientX = e.clientX = this.clientX_;
  var clientY = e.clientY = this.clientY_;
  var pos = this.calculatePosition_(e);
  var x = pos.x;
  var y = pos.y;
  
  var rv = this.dispatchEvent(new thin.core.DragEvent(
           goog.fx.Dragger.EventType.BEFOREDRAG, this, clientX, clientY, e, x, y));
  
  if (rv !== false) {
    this.doDrag(e, x, y, true);
  }
};


/**
 * @private
 */
thin.core.SvgDragger.prototype.initializeDelta_ = function() {
  if (this.isEmptyRect(this.deltaRect_)) {
    var target = this.targetShape;
    if (target.isForMultiple && !target.isForMultiple()) {
      this.setDelta(target.getTargetShape().getBounds());
    }
  }
};


/**
 * @private
 */
thin.core.SvgDragger.prototype.initializeLimits_ = function() {
  if (this.isEmptyRect(this.limits)) {
    var layout = this.getLayout();
    var helpers = layout.getHelpers();
    var listHelper = helpers.getListHelper();
    var guide = helpers.getGuideHelper();
    var target = this.targetShape;
    var bounds = layout.getBounds();
    
    if (listHelper.isActive() && !target.instanceOfDraggableLine()) {
      if (listHelper.getActiveShape().isMultiple()) {
        bounds = listHelper.getTarget().getSectionShape(listHelper.getActiveSectionName()).getBounds();
      } else if (this.handleShape.isAffiliationListShape()) {
        bounds = this.handleShape.getAffiliationRegionBounds();
      }
    }
    var width = goog.isFunction(target.getWidth) ? target.getWidth() : guide.getWidth();
    var height = goog.isFunction(target.getHeight) ? target.getHeight() : guide.getHeight();
    this.setLimits(new goog.math.Rect(bounds.left, bounds.top, bounds.width - width, bounds.height - height));
  }
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
thin.core.SvgDragger.prototype.defaultAction = function(e, x, y) {
  if (this.enableXCoordinate_) {
    this.targetShape.setLeft(x);
  }
  if (this.enableYCoordinate_) {
    this.targetShape.setTop(y);
  }
};
