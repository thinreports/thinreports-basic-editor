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

goog.provide('thin.core.AbstractDragger');
goog.provide('thin.core.AbstractDragger.EventType');
goog.provide('thin.core.DragEvent');

goog.require('goog.dom');
goog.require('goog.array');
goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.EventHandler');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.BrowserEvent.MouseButton');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('goog.fx.DragEvent');


/**
 * @param {goog.graphics.Element} target
 * @param {goog.graphics.Element=} opt_handle
 * @constructor
 * @extends {goog.fx.Dragger}
 */
thin.core.AbstractDragger = function(target, opt_handle) {
  goog.events.EventTarget.call(this);
  
  /**
   * @type {goog.graphics.Element}
   */
  this.targetShape = target;  
  
  var targetElement = target.getElement();
  var handle = opt_handle ? opt_handle.getElement() : targetElement;

  /**
   * @type {Element}
   */
  this.handle = handle;
    
  /**
   * @type {Element}
   */
  this.target = targetElement;

  /**
   * @type {goog.graphics.Element}
   */
  this.handleShape = opt_handle || target;
  
  /**
   * @type {goog.math.Rect}
   */
  this.limits = new goog.math.Rect(NaN, NaN, NaN, NaN);
  
  /**
   * @type {goog.math.Rect}
   * @private
   */
  this.deltaRect_ = new goog.math.Rect(NaN, NaN, NaN, NaN);
  
  /**
   * @type {Document}
   * @private
   */
  this.document_ = goog.dom.getOwnerDocument(targetElement);
  
  /**
   * @type {goog.events.EventHandler}
   * @private
   */
  this.eventHandler_ = new goog.events.EventHandler(this);
  
  /**
   * @type {Array}
   * @private
   */
  this.adsorptionX_ = [];

  /**
   * @type {Array}
   * @private
   */
  this.adsorptionY_ = [];
  
  // Add listener. Do not use the event handler here since the event handler is
  // used for listeners added and removed during the drag operation.
  goog.events.listen(handle, goog.events.EventType.MOUSEDOWN, this.startDrag, false, this);
};
goog.inherits(thin.core.AbstractDragger, goog.fx.Dragger);


/**
 * Constants for event names.
 * @enum {string}
 */
thin.core.AbstractDragger.EventType = {
  BEFORESTART: 'beforestart',
  SHIFTKEYPRESS: 'shiftkeypress'
};


/**
 * @type {number}
 * @private
 */
thin.core.AbstractDragger.ABSORPTION_RANGE_ = 10;


/**
 * @type {boolean}
 * @private
 */
thin.core.AbstractDragger.prototype.aspect_ = false;


/**
 * @type {number}
 * @private
 */
thin.core.AbstractDragger.prototype.clientX_ = 0;


/**
 * @type {number}
 * @private
 */
thin.core.AbstractDragger.prototype.clientY_ = 0;


/**
 * @type {number}
 * @private
 */
thin.core.AbstractDragger.prototype.startDragX_ = 0;


/**
 * @type {number}
 * @private
 */
thin.core.AbstractDragger.prototype.startDragY_ = 0;


/**
 * @type {number}
 * @private
 */
thin.core.AbstractDragger.prototype.deltaX_ = 0;


/**
 * @type {number}
 * @private
 */
thin.core.AbstractDragger.prototype.deltaY_ = 0;


/**
 * @type {number}
 * @private
 */
thin.core.AbstractDragger.prototype.rate_ = 1;


/**
 * @type {thin.core.Layout}
 * @private
 */
thin.core.AbstractDragger.prototype.layout_;


/**
 * @type {thin.core.Workspace}
 * @private
 */
thin.core.AbstractDragger.prototype.workspace_;


/**
 * @type {Element}
 * @private
 */
thin.core.AbstractDragger.prototype.offsetTarget_;


/**
 * @type {EventTarget}
 * @private
 */
thin.core.AbstractDragger.prototype.scrollTarget_;


/**
 * @return {thin.core.Workspace}
 */
thin.core.AbstractDragger.prototype.getWorkspace = function() {
  if (!this.workspace_) {
    this.workspace_ = this.getLayout().getWorkspace();
  }
  
  return this.workspace_;
};


/**
 * @return {thin.core.Layout}
 */
thin.core.AbstractDragger.prototype.getLayout = function() {
  if (!this.layout_) {
    this.layout_ = this.targetShape.getLayout();
  }
  
  return this.layout_;
};


/**
 * @return {Element}
 */
thin.core.AbstractDragger.prototype.getOffsetTarget = function() {
  if (!this.offsetTarget_) {
    this.offsetTarget_ = this.getLayout().getOffsetTarget();
  }
  
  return this.offsetTarget_;
};


/**
 * @param {goog.math.Rect} rect
 * @return {boolean}
 */
thin.core.AbstractDragger.prototype.isEmptyRect = function(rect) {
  return isNaN(rect.left) && isNaN(rect.top) &&
  isNaN(rect.width) &&
  isNaN(rect.height);
};


/**
 * @param {boolean} setting
 */
thin.core.AbstractDragger.prototype.setAspectObserve = function(setting) {
  this.aspect_ = setting;
};


/**
 * @param {goog.graphics.Element} target
 */
thin.core.AbstractDragger.prototype.setTarget = function(target) {
  this.targetShape = target;
  var targetElement = this.target = target.getElement();
  this.document_ = goog.dom.getOwnerDocument(targetElement);
};


/**
 * @param {goog.math.Rect?} delta
 */
thin.core.AbstractDragger.prototype.setDelta = function(delta) {
  this.deltaRect_ = delta || new goog.math.Rect(NaN, NaN, NaN, NaN);
  this.calculateDelta_();
};


/**
 * @param {Array} pos
 */
thin.core.AbstractDragger.prototype.setAdsorptionX = function(pos) {
  this.adsorptionX_ = pos;
};


/**
 * @param {Array} pos
 */
thin.core.AbstractDragger.prototype.setAdsorptionY = function(pos) {
  this.adsorptionY_ = pos;
};


/**
 * @param {number} rate
 */
thin.core.AbstractDragger.prototype.setRate = function(rate) {
  this.rate_ = rate;
};


/**
 * @return {goog.math.Coordinate}
 */
thin.core.AbstractDragger.prototype.getDeltaPosition = function() {
  return new goog.math.Coordinate(this.deltaX_, this.deltaY_);
};


/**
 * @return {goog.math.Coordinate}
 */
thin.core.AbstractDragger.prototype.getStartPosition = function() {
  return new goog.math.Coordinate(this.startDragX_, this.startDragY_);
};


/**
 * Returns the 'real' x after limits are applied (allows for some
 * limits to be undefined).
 * @param {number} x X-coordinate to limit.
 * @param {boolean} cancelAbsorption
 * @return {number} The 'real' X-coordinate after limits are applied.
 */
thin.core.AbstractDragger.prototype.limitX = function(x, cancelAbsorption) {
  var clientX = thin.core.AbstractDragger.superClass_.limitX.call(this, x);
  var adsorptionX = this.adsorptionX_;
  
  if (!cancelAbsorption && !goog.array.isEmpty(adsorptionX)) {
  
    var resultX = [];
    var lineLeft = [];
    var deltaWidth = this.deltaRect_.width;
    
    if (!isNaN(deltaWidth)) {
      var diffRight = 0;
      var diffMin = 0;
      
      goog.array.forEach(adsorptionX, function(posX, i) {
        diffRight = Math.abs(posX - (clientX + deltaWidth));
        diffMin = Math.min(Math.abs(posX - clientX), diffRight);
        goog.array.insertAt(resultX, diffMin, i);
        if (diffMin == diffRight) {
          posX -= deltaWidth;
        }
        lineLeft[diffMin] = posX;
      });
    } else {
      var diffLeft = 0;
      
      goog.array.forEach(adsorptionX, function(posX, i) {
        diffLeft = Math.abs(posX - clientX);
        goog.array.insertAt(resultX, diffLeft, i);
        lineLeft[diffLeft] = posX;
      });
    }
    goog.array.sort(resultX);
    var tempClientX = resultX[0];
    if (thin.core.AbstractDragger.ABSORPTION_RANGE_ >= tempClientX) {
      clientX = lineLeft[tempClientX];
    }
  }
  return clientX;
};


/**
 * Returns the 'real' y after limits are applied (allows for some
 * limits to be undefined).
 * @param {number} y Y-coordinate to limit.
 * @return {number} The 'real' Y-coordinate after limits are applied.
 */
thin.core.AbstractDragger.prototype.limitY = function(y, cancelAbsorption) {
  var clientY = thin.core.AbstractDragger.superClass_.limitY.call(this, y);
  var adsorptionY = this.adsorptionY_;
  
  if (!cancelAbsorption && !goog.array.isEmpty(adsorptionY)) {
  
    var resultY = [];
    var lineTop = [];
    var deltaHeight = this.deltaRect_.height;
    
    if (!isNaN(deltaHeight)) {
      var diffBottom = 0;
      var diffMin = 0;
      
      goog.array.forEach(adsorptionY, function(posY, i) {
        diffBottom = Math.abs(posY - (clientY + deltaHeight));
        diffMin = Math.min(Math.abs(posY - clientY), diffBottom);
        goog.array.insertAt(resultY, diffMin, i);
        if (diffMin == diffBottom) {
          posY -= deltaHeight;
        }
        lineTop[diffMin] = posY;
      });
    } else {
      var diffTop = 0;
      
      goog.array.forEach(adsorptionY, function(posY, i) {
        diffTop = Math.abs(posY - clientY);
        goog.array.insertAt(resultY, diffTop, i);
        lineTop[diffTop] = posY;
      });
    }
    goog.array.sort(resultY);
    var tempclientY = resultY[0];
    if (thin.core.AbstractDragger.ABSORPTION_RANGE_ >= tempclientY) {
      clientY = lineTop[tempclientY];
    }
  }
  return clientY;
};


/**
 * Event handler that is used to start the drag
 * @param {goog.events.BrowserEvent} e Event object.
 */
thin.core.AbstractDragger.prototype.startDrag = function(e) {
  var isMouseDown = e.type == goog.events.EventType.MOUSEDOWN;

  // Dragger.startDrag() can be called by AbstractDragDrop with a mousemove
  // event and IE does not report pressed mouse buttons on mousemove. Also,
  // it does not make sense to check for the button if the user is already
  // dragging.

  if (this.enabled_ && !this.dragging_ &&
      (!isMouseDown || e.isMouseActionButton())) {
    
    this.maybeReinitTouchEvent_(e);
    this.getWorkspace().focusElement(e);

    if (this.hysteresisDistanceSquared_ == 0) {
      this.initializeDrag_(e);
      if (this.dragging_) {
        e.preventDefault();
      } else {
        // If the start drag is cancelled, don't setup for a drag.
        return;
      }
    } else {
      // Need to preventDefault for hysteresis to prevent page getting selected.
      e.preventDefault();
    }
    this.setupDragHandlers();

    this.clientX = this.startX = e.clientX;
    this.clientY = this.startY = e.clientY;
    this.screenX = e.screenX;
    this.screenY = e.screenY;
    this.deltaX = this.target.offsetLeft;
    this.deltaY = this.target.offsetTop;
    this.pageScroll = goog.dom.getDomHelper(this.document_).getDocumentScroll();

    this.mouseDownTime_ = goog.now();
  }
};


/**
 * Calculates the drag position.
 * @return {goog.math.Coordinate} The newly calculated drag element position.
 * @private
 */
thin.core.AbstractDragger.prototype.calculateUnlimitedPosition_ = function() {

  var bounds = this.getOffsetTarget().getBoundingClientRect();

  var clientX = this.clientX_ - bounds.left;
  var clientY = this.clientY_ - bounds.top;

  return new goog.math.Coordinate(
                thin.numberWithPrecision(clientX / this.rate_),
                thin.numberWithPrecision(clientY / this.rate_));
};


/**
 * Calculates the drag position.
 *
 * @param {goog.events.Event} e
 * @return {goog.math.Coordinate} The newly calculated drag element position.
 * @private
 */
thin.core.AbstractDragger.prototype.calculatePosition_ = function(e) {
  var coordinate = this.calculateUnlimitedPosition_();
  var deltaPos = this.getDeltaPosition();

  var cancelAbsorption = e.altKey;
  return new goog.math.Coordinate(
           thin.numberWithPrecision(this.limitX(coordinate.x + deltaPos.x, cancelAbsorption)),
           thin.numberWithPrecision(this.limitY(coordinate.y + deltaPos.y, cancelAbsorption)));
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
thin.core.AbstractDragger.prototype.onScroll_ = goog.nullFunction;


/**
 * Event handler that is used to start the drag
 * @param {goog.events.BrowserEvent} e Event object.
 * @private
 */
thin.core.AbstractDragger.prototype.initializeDrag_ = function(e) {

  var clientX = this.clientX_ = e.clientX;
  var clientY = this.clientY_ = e.clientY;
  
  this.initializeRate_();

  var beforerv = this.dispatchEvent(new thin.core.DragEvent(thin.core.AbstractDragger.EventType.BEFORESTART, this, clientX, clientY,  /** @type {goog.events.BrowserEvent} */
  (e)));
  
  if (beforerv === false) {
    this.dragging_ = false;
    return;
  }
  
  var pos = this.calculateUnlimitedPosition_();
  
  var startX = pos.x;
  var startY = pos.y;
  
  this.initializeLimits_();
  this.initializeStartPosition_(startX, startY);
  this.initializeDelta_();
  this.calculateDelta_();
  
  var rv = this.dispatchEvent(new thin.core.DragEvent(goog.fx.Dragger.EventType.START, this, clientX, clientY,  /** @type {goog.events.BrowserEvent} */
  (e), startX, startY));
  if (rv !== false) {
    this.dragging_ = true;
  }
};


/**
 * Event handler that is used to end the drag
 * @param {goog.events.BrowserEvent} e Event object.
 * @param {boolean=} opt_dragCanceled Whether the drag has been canceled.
 */
thin.core.AbstractDragger.prototype.endDrag = function(e, opt_dragCanceled) {
  this.eventHandler_.removeAll();
  
  if (goog.fx.Dragger.HAS_SET_CAPTURE_) {
    this.document_.releaseCapture();
  }
  
  if (this.dragging_) {
    this.maybeReinitTouchEvent_(e);
    this.dragging_ = false;
    
    var clientX = this.clientX_ = e.clientX;
    var clientY = this.clientY_ = e.clientY;
    
    var pos = this.calculatePosition_(e);
        
    var dragCancelled = opt_dragCanceled ||
                        e.type == goog.events.EventType.TOUCHCANCEL;
    
    this.dispatchEvent(new thin.core.DragEvent(
        goog.fx.Dragger.EventType.END, this, clientX, clientY, e, pos.x, pos.y, 0, 0,
        dragCancelled));
    this.setLimits(new goog.math.Rect(NaN, NaN, NaN, NaN));
    this.setDelta(new goog.math.Rect(NaN, NaN, NaN, NaN));
    this.startDragX_ = 0;
    this.startDragY_ = 0;
    this.deltaX_ = 0;
    this.deltaY_ = 0;
    this.clientX_ = 0;
    this.clientY_ = 0;
  }
  // Call preventDefault to prevent mouseup from being raised if this is a
  // touchend event.
  if (e.type == goog.events.EventType.TOUCHEND ||
      e.type == goog.events.EventType.TOUCHCANCEL) {
      e.preventDefault();
  }
};


/**
 * Event handler that is used on mouse move to update the drag
 * @param {goog.events.BrowserEvent} e Event object.
 * @private
 */
thin.core.AbstractDragger.prototype.handleMove_ = function(e) {
  if (this.enabled_) {
    
    var dx = e.clientX - this.clientX;
    var dy = e.clientY - this.clientY;
    this.clientX = e.clientX;
    this.clientY = e.clientY;
    this.screenX = e.screenX;
    this.screenY = e.screenY;

    if (!this.dragging_) {
      var diffX = this.startX - this.clientX;
      var diffY = this.startY - this.clientY;
      var distance = diffX * diffX + diffY * diffY;
      if (distance > this.hysteresisDistanceSquared_) {
        this.initializeDrag_(e);
        if (!this.dragging_) {
          this.endDrag(e);
          return;
        }
      }
    }
    
    var clientX = this.clientX_ = e.clientX;
    var clientY = this.clientY_ = e.clientY;
    var pos = this.calculatePosition_(e);
    var x = pos.x;
    var y = pos.y;
    
    if (this.dragging_) {
      var rv = this.dispatchEvent(new thin.core.DragEvent(goog.fx.Dragger.EventType.BEFOREDRAG, this, clientX, clientY, e, x, y));
      if (rv !== false) {
        this.doDrag(e, x, y, false);
        e.preventDefault();
      }
    }
  }
};


/**
 * @param {goog.events.BrowserEvent} e The closure object
 *     representing the browser event that caused a drag event.
 * @param {number} x The new horizontal position for the drag element.
 * @param {number} y The new vertical position for the drag element.
 * @param {boolean} dragFromScroll Whether dragging was caused by scrolling
 *     the associated scroll target.
 * @protected
 */
thin.core.AbstractDragger.prototype.doDrag = function(e, x, y, dragFromScroll) {
  if (e.shiftKey) {
    var coordinate = this.onShiftKeyPress_(e, x, y);
    x = coordinate.x;
    y = coordinate.y;
  }
  this.defaultAction(e, x, y);
  
  this.dispatchEvent(new thin.core.DragEvent(goog.fx.Dragger.EventType.DRAG, this, e.clientX, e.clientY, e, x, y));
};


/**
 * @private
 */
thin.core.AbstractDragger.prototype.onShiftKeyPress_ = goog.abstractMethod;


/**
 * @private
 */
thin.core.AbstractDragger.prototype.initializeRate_ = function() {
  this.setRate(this.getLayout().getPixelScale());
};


/**
 * @private
 */
thin.core.AbstractDragger.prototype.initializeDelta_ = goog.nullFunction;


/**
 * @private
 */
thin.core.AbstractDragger.prototype.calculateDelta_ = function() {
  var delta = this.deltaRect_;
  var left = delta.left;
  var top = delta.top;
  var startPos = this.getStartPosition();
  this.deltaX_ = isNaN(left) ? 0 : left - startPos.x;
  this.deltaY_ = isNaN(top) ? 0 : top - startPos.y;
};


/**
 * @param {number} x
 * @param {number} y
 * @private
 */
thin.core.AbstractDragger.prototype.initializeStartPosition_ = function(x, y) {
  this.startDragX_ = x;
  this.startDragY_ = y;
};


/**
 * @private
 */
thin.core.AbstractDragger.prototype.initializeLimits_ = goog.abstractMethod;


/**
 * Overridable function for handling the default action of the drag behaviour.
 * Normally this is simply moving the element to x,y though in some cases it
 * might be used to resize the layer.  This is basically a shortcut to
 * implementing a default ondrag event handler.
 * @param {goog.events.BrowserEvent} e
 * @param {number} x X-coordinate for target element.
 * @param {number} y Y-coordinate for target element.
 */
thin.core.AbstractDragger.prototype.defaultAction = function(e, x, y) {};


/** @inheritDoc */
thin.core.AbstractDragger.prototype.disposeInternal = function() {
  thin.core.AbstractDragger.superClass_.disposeInternal.call(this);

  delete this.layout_;
  delete this.scrollTarget_;
  delete this.limits;
  delete this.deltaRect_;
  delete this.document_
  delete this.adsorptionX_;
  delete this.adsorptionY_;
  delete this.targetShape;
  delete this.handleShape;
  delete this.offsetTarget_;
};


/**
 * @param {string} type
 * @param {thin.core.AbstractDragger} dragobj
 * @param {number} clientX
 * @param {number} clientY
 * @param {goog.events.BrowserEvent} browserEvent
 * @param {number=} opt_actX
 * @param {number=} opt_actY
 * @param {boolean=} opt_dragCanceled
 * @param {number=} opt_oldactX
 * @param {number=} opt_oldactY
 * @constructor 
 * @extends {goog.fx.DragEvent}
 */
thin.core.DragEvent = function(type, dragobj, clientX, clientY, browserEvent,
                             opt_actX, opt_actY, opt_oldactX, opt_oldactY, opt_dragCanceled) {
  goog.fx.DragEvent.call(this, type, dragobj, clientX, clientY, browserEvent,
                             opt_actX, opt_actY, opt_dragCanceled);
  
  var startPos = dragobj.getStartPosition();

  /**
   * @type {number}
   */
  this.startX = startPos.x;

  /**
   * @type {number}
   */
  this.startY = startPos.y;
  
  /**
   * @type {number|undefined}
   */
  this.endX = opt_actX;

  /**
   * @type {number|undefined}
   */
  this.endY = opt_actY;

  /**
   * @type {number|undefined}
   */
  this.oldX = opt_oldactX;

  /**
   * @type {number|undefined}
   */
  this.oldY = opt_oldactY;
};
goog.inherits(thin.core.DragEvent, goog.fx.DragEvent);
