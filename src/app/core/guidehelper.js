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

goog.provide('thin.core.GuideHelper');
goog.provide('thin.core.GuideHelper.Stroke_');

goog.require('goog.object');
goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('goog.events');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('thin.core.Cursor');
goog.require('thin.core.Cursor.Type');
goog.require('thin.core.AbstractDragger');
goog.require('thin.core.AbstractDragger.EventType');
goog.require('thin.core.SvgResizer');
goog.require('thin.core.SvgResizer.Horizon');
goog.require('thin.core.SvgResizer.Vertical');
goog.require('thin.core.AbstractGuideHelper');
goog.require('thin.core.AbstractGuideHelper.PositionName');
goog.require('thin.core.GuideResizer');
goog.require('thin.core.GuideBody');


/**
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {thin.core.AbstractGuideHelper}
 */
thin.core.GuideHelper = function(layout) {
  thin.core.AbstractGuideHelper.call(this, layout);
};
goog.inherits(thin.core.GuideHelper, thin.core.AbstractGuideHelper);


/**
 * @enum {string}
 * @private
 */
thin.core.GuideHelper.Stroke_ = {
  STROKE: '#000000',
  OUTLINESTROKE: '#0000FF',
  STROKEWIDTH: '0.8px',
  STROKEDASHARRAY: '2'
};


/**
 * @type {thin.core.GuideBody}
 * @private
 */
thin.core.GuideHelper.prototype.guideOutline_;


thin.core.GuideHelper.prototype.setup = function() {
  
  var layout = this.getLayout();
  var strokeSetting = thin.core.GuideHelper.Stroke_;
  var strokeWidth = strokeSetting.STROKEWIDTH;
  
  var guideBody = new thin.core.GuideBody(layout.createSvgElement('rect'), layout,
                    new goog.graphics.Stroke(strokeWidth, strokeSetting.STROKE), null);
  var guideOutline = new thin.core.GuideBody(layout.createSvgElement('rect'), layout,
                       new goog.graphics.Stroke(strokeWidth, strokeSetting.OUTLINESTROKE), null);

  guideBody.setVisibled(false);
  guideOutline.setVisibled(false);
  this.setVisibled(false);
  layout.appendChild(guideBody, this);
  layout.appendChild(guideOutline, this);
  this.body_ = guideBody;
  this.guideOutline_ = guideOutline;
  this.createResizers_();
};


/**
 * @param {goog.math.Rect} bounds
 */
thin.core.GuideHelper.prototype.setBounds = function(bounds) {
  this.body_.setBounds(bounds);
  this.guideOutline_.setBounds(bounds);
};


/**
 * @return {thin.core.GuideBody}
 */
thin.core.GuideHelper.prototype.getGuideOutline = function() {
  return this.guideOutline_;
};


thin.core.GuideHelper.prototype.reapplySizeAndStroke = function() {
  var guideBody = this.body_;
  guideBody.reapplyStroke();
  this.getLayout().setElementAttributes(guideBody.getElement(), {
    'stroke-dasharray': Number(thin.core.GuideHelper.Stroke_.STROKEDASHARRAY) / this.getLayout().getPixelScale()
  });
  this.guideOutline_.reapplyStroke();
  
  goog.object.forEach(thin.core.AbstractGuideHelper.PositionName, goog.bind(function(positionName) {
    this.getResizerByPositionName(positionName).reapplyStrokeAndSize();
  }, this));
};


thin.core.GuideHelper.prototype.adjustToTargetShapeBounds = function() {
  var targetShape = this.getTargetShape();
  if (!goog.isDef(targetShape)) {
    // Skip adjust;
    return;
  }
  var bounds = targetShape.getBounds();
  this.setBounds(bounds)

  var left = bounds.left;
  var top = bounds.top;
  var width = bounds.width;
  var height = bounds.height;
  var center = left + (width / 2);
  var middle = top + (height / 2);
  var right = left + width;
  var bottom = top + height;

  var positionName = thin.core.AbstractGuideHelper.PositionName;
  this.getResizerByPositionName(positionName.TLEFT).setCenter(left, top);
  this.getResizerByPositionName(positionName.TCENTER).setCenter(center, top);
  this.getResizerByPositionName(positionName.TRIGHT).setCenter(right, top);
  this.getResizerByPositionName(positionName.MLEFT).setCenter(left, middle);
  this.getResizerByPositionName(positionName.MRIGHT).setCenter(right, middle);
  this.getResizerByPositionName(positionName.BLEFT).setCenter(left, bottom);
  this.getResizerByPositionName(positionName.BCENTER).setCenter(center, bottom);
  this.getResizerByPositionName(positionName.BRIGHT).setCenter(right, bottom);
};


/**
 * @private
 */
thin.core.GuideHelper.prototype.createResizers_ = function() {
  
  var strokeSetting = thin.core.GuideHelper.Stroke_;
  var stroke = new goog.graphics.Stroke(strokeSetting.STROKEWIDTH, strokeSetting.STROKE);
  var layout = this.getLayout();
  var cursorType = thin.core.Cursor.Type;
  goog.object.forEach(thin.core.AbstractGuideHelper.PositionName, function(positionName) {
    var element = layout.createSvgElement('ellipse');
    var resizer = new thin.core.GuideResizer(element, layout, stroke, this);
    var cursor = thin.core.Cursor.getCursorByName(
          /** @type {string} */ (positionName));
    resizer.setCursor(cursor);
    layout.setElementCursor(element, cursor);
    layout.appendChild(resizer, this);
    goog.object.set(this.resizers_, positionName, resizer);
  }, this);
};


/**
 * @param {goog.graphics.Element} target
 */
thin.core.GuideHelper.prototype.setEnableAndTargetShape = function(target) {

  thin.core.GuideHelper.superClass_.setEnableAndTargetShape.call(this, target);
  this.adjustToTargetShapeBounds();
  this.enableAllResizers_(true);

  if (!target.canResizeHeight()) {
    this.disableResizingHeight_();
  }
};


/**
 * @private
 */
thin.core.GuideHelper.prototype.disableResizingHeight_ = function() {
  var pos = thin.core.AbstractGuideHelper.PositionName;
  var resizers = [
    pos.TLEFT, pos.TCENTER, pos.TRIGHT, 
    pos.BLEFT, pos.BCENTER, pos.BRIGHT
  ];
  goog.array.forEach(resizers, function(resizer) {
    this.getResizerByPositionName(resizer).setReadOnly(true);
  }, this);
};


/**
 * @param {boolean} setting
 * @private
 */
thin.core.GuideHelper.prototype.enableAllResizers_ = function(setting) {
  this.body_.setVisibled(!setting);
  goog.object.forEach(this.resizers_, function(resizer) {
    resizer.setVisibled(setting);
    if (resizer.isReadOnly()) {
      resizer.setReadOnly(false);
    }
  });
};


thin.core.GuideHelper.prototype.init = function() {
  var scope = this;
  this.reapplySizeAndStroke();
  var layout = this.getLayout();
  var helpers = layout.getHelpers();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var activeShapeManager = layout.getManager().getActiveShape();
  var guideOutline = this.guideOutline_;
  var positionName = thin.core.AbstractGuideHelper.PositionName;
  var eventType = goog.fx.Dragger.EventType;
  var draggerEventType = thin.core.AbstractDragger.EventType;
  var horizon = thin.core.SvgResizer.Horizon;
  var vertical = thin.core.SvgResizer.Vertical;
  var cursorType = thin.core.Cursor.Type;
  var listHelper = helpers.getListHelper();
  
  /**
   * @param {goog.events.BrowserEvent} e
   */
  var startListener = function(e) {
  
    var resizer = e.dragger;
    resizer.setAdsorptionX(helpers.getAdsorptionX());
    resizer.setAdsorptionY(helpers.getAdsorptionY());
    
    if(!listHelper.isActive()) {
      var singleShape = activeShapeManager.getIfSingle();
    } else {
      var singleShape = listHelper.getActiveShape().getIfSingle();
    }
    
    if (singleShape) {
      singleShape.getTargetOutline().enable();
      if (singleShape.instanceOfLineShape()) {
        resizer.setSizeLimitFunction(function(nowBounds, startBounds) {
          var width = nowBounds.width;
          var height = nowBounds.height;
          if (width == 0 && height == 0) {
            if (startBounds.width == 0) {
              height = 1;
            } else if (startBounds.height) {
              width = 1;
            }
          }
          return new goog.math.Rect(nowBounds.left, nowBounds.top, width, height);
        });
      } else if(singleShape.instanceOfTextShape()) {
        resizer.setSizeLimitFunction(function(nowBounds, startBounds) {
          var left = nowBounds.left;
          var top = nowBounds.top;
          var width = nowBounds.width;
          var height = nowBounds.height;
          var nowBox = nowBounds.toBox();
          var minWidth = singleShape.getMinWidth();
          var minHeight = singleShape.getMinHeight();

          if (width < minWidth) {
            width = minWidth;
            if (this.isLeft_) {
              left = nowBox.right - width;
            }
          }

          if (height < minHeight) {
            height = minHeight;
            if (!this.isBottom_) {
              top = nowBox.bottom - height;
            }
          }

          return new goog.math.Rect(left, top, width, height);
        });
      } else {
        resizer.initSizeLimitFunction();
      }
    } else {
      resizer.initSizeLimitFunction();
      guideOutline.setVisibled(true);
      multipleShapesHelper.captureProperties();
      multipleShapesHelper.updateProperties();
    }
  };
  
  /**
   * @param {goog.events.BrowserEvent} e
   */
  var endResizeListener = function(e) {
  
    var resizer = e.dragger;
    this.removeResizeCursor();
    var isSingle = resizer.isResizeModeByCoordinate();
    var target = this.getTargetShape();
    guideOutline.setVisibled(false);
    var captureShapes = !listHelper.isActive() ?
                             layout.getManager().getActiveShape().getClone() :
                             listHelper.getActiveShape().getClone();

    if (isSingle) {
      var startBounds = resizer.getStartShapeBounds();
      var endBounds = resizer.getEndShapeBounds() || startBounds;
    } else {
      var captureOutlineStartBounds = [];
      goog.array.forEach(captureShapes, function(shape) {
        goog.array.insertAt(captureOutlineStartBounds, 
            shape.getBounds(), captureOutlineStartBounds.length);
      });

      var scale = resizer.getScale();
      var transLate = resizer.getTransLate();
      var isVertex = resizer.isVertex();
      var outline;
      goog.array.forEach(captureShapes, function(shape) {
        outline = shape.getTargetOutline();
        outline.setBoundsByScale(scale, transLate, isVertex);
        shape.setBounds(outline.getBounds());
      });

      var captureOutlineEndBounds = [];
      goog.array.forEach(captureShapes, function(shape) {
        goog.array.insertAt(captureOutlineEndBounds, 
            shape.getBounds(), captureOutlineEndBounds.length);
      });
    }

    layout.getWorkspace().normalVersioning(function(version) {
      if (goog.math.Rect.equals(startBounds, endBounds)) {
        version.setChanged(false);
      }

      version.upHandler(function() {
        if (isSingle) {
          var outline = target.getTargetOutline();
          outline.setBounds(endBounds);
          target.setBounds(endBounds);
          outline.disable();
          target.updateProperties();
        } else {
          var shape;
          goog.array.forEach(captureOutlineEndBounds, function(bounds, count) {
            shape = captureShapes[count];
            shape.getTargetOutline().setBounds(bounds);
            shape.setBounds(bounds);
          });
          multipleShapesHelper.captureProperties();
          multipleShapesHelper.updateProperties();
          layout.calculateGuideBounds(captureShapes);
        }
        this.adjustToTargetShapeBounds();
      }, scope);
      
      version.downHandler(function() {
        if (isSingle) {
          var outline = target.getTargetOutline();
          outline.setTargetShape(target);
          outline.setBounds(startBounds);
          target.setBounds(startBounds);
          target.updateProperties();
        } else {
          var shape;
          goog.array.forEach(captureOutlineStartBounds, function(bounds, count) {
            shape = captureShapes[count];
            shape.getTargetOutline().setBounds(bounds);
            shape.setBounds(bounds);
          });
          multipleShapesHelper.captureProperties();
          multipleShapesHelper.updateProperties();
          layout.calculateGuideBounds(captureShapes);
        }
        this.adjustToTargetShapeBounds();
      }, scope);
    });
  };
  
  var tleftResizer = this.getResizerByPositionName(positionName.TLEFT).getResizer();
  goog.events.listen(tleftResizer, draggerEventType.BEFORESTART, function(e) {
    this.setResizeCursor(cursorType.TLEFT);
  }, false, this);
  goog.events.listen(tleftResizer, eventType.START, startListener, false, this);
  goog.events.listen(tleftResizer, eventType.END, endResizeListener, false, this);
  
  var tcenterResizer = this.getResizerByPositionName(positionName.TCENTER).getResizer();
  tcenterResizer.setResizeDirectionToHorizon(horizon.CENTER);
  tcenterResizer.setResizeDirectionToVertical(vertical.TOP);
  tcenterResizer.setAspectObserve(false);
  
  goog.events.listen(tcenterResizer, draggerEventType.BEFORESTART, function(e) {
    this.setResizeCursor(cursorType.TCENTER);
  }, false, this);
  goog.events.listen(tcenterResizer, eventType.START, startListener, false, this);
  goog.events.listen(tcenterResizer, eventType.END, endResizeListener, false, this);

  var trightResizer = this.getResizerByPositionName(positionName.TRIGHT).getResizer();
  trightResizer.setResizeDirectionToHorizon(horizon.RIGHT);
  trightResizer.setResizeDirectionToVertical(vertical.TOP);
  
  goog.events.listen(trightResizer, draggerEventType.BEFORESTART, function(e) {
    this.setResizeCursor(cursorType.TRIGHT);
  }, false, this);
  goog.events.listen(trightResizer, eventType.START, startListener, false, this);
  goog.events.listen(trightResizer, eventType.END, endResizeListener, false, this);

  var mleftResizer = this.getResizerByPositionName(positionName.MLEFT).getResizer();
  mleftResizer.setResizeDirectionToHorizon(horizon.LEFT);
  mleftResizer.setResizeDirectionToVertical(vertical.MIDDLE);
  mleftResizer.setAspectObserve(false);
  
  goog.events.listen(mleftResizer, draggerEventType.BEFORESTART, function(e) {
    this.setResizeCursor(cursorType.MLEFT);
  }, false, this);
  goog.events.listen(mleftResizer, eventType.START, startListener, false, this);
  goog.events.listen(mleftResizer, eventType.END, endResizeListener, false, this);
  
  var mrightResizer = this.getResizerByPositionName(positionName.MRIGHT).getResizer();
  mrightResizer.setResizeDirectionToHorizon(horizon.RIGHT);
  mrightResizer.setResizeDirectionToVertical(vertical.MIDDLE);
  mrightResizer.setAspectObserve(false);

  goog.events.listen(mrightResizer, draggerEventType.BEFORESTART, function(e) {
    this.setResizeCursor(cursorType.MRIGHT);
  }, false, this);
  goog.events.listen(mrightResizer, eventType.START, startListener, false, this);
  goog.events.listen(mrightResizer, eventType.END, endResizeListener, false, this);
  
  var bleftResizer = this.getResizerByPositionName(positionName.BLEFT).getResizer();
  bleftResizer.setResizeDirectionToHorizon(horizon.LEFT);
  bleftResizer.setResizeDirectionToVertical(vertical.BOTTOM);
  
  goog.events.listen(bleftResizer, draggerEventType.BEFORESTART, function(e) {
    this.setResizeCursor(cursorType.BLEFT);
  }, false, this);
  goog.events.listen(bleftResizer, eventType.START, startListener, false, this);
  goog.events.listen(bleftResizer, eventType.END, endResizeListener, false, this);
  
  var bcenterResizer = this.getResizerByPositionName(positionName.BCENTER).getResizer();
  bcenterResizer.setResizeDirectionToHorizon(horizon.CENTER);
  bcenterResizer.setResizeDirectionToVertical(vertical.BOTTOM);
  bcenterResizer.setAspectObserve(false);
  
  goog.events.listen(bcenterResizer, draggerEventType.BEFORESTART, function(e) {
    this.setResizeCursor(cursorType.BCENTER);
  }, false, this);
  goog.events.listen(bcenterResizer, eventType.START, startListener, false, this);
  goog.events.listen(bcenterResizer, eventType.END, endResizeListener, false, this);
  
  var brightResizer = this.getResizerByPositionName(positionName.BRIGHT).getResizer();
  brightResizer.setResizeDirectionToHorizon(horizon.RIGHT);
  brightResizer.setResizeDirectionToVertical(vertical.BOTTOM);
  
  goog.events.listen(brightResizer, draggerEventType.BEFORESTART, function(e) {
    this.setResizeCursor(cursorType.BRIGHT);
  }, false, this);
  goog.events.listen(brightResizer, eventType.START, startListener, false, this);
  goog.events.listen(brightResizer, eventType.END, endResizeListener, false, this);
};


/** @inheritDoc */
thin.core.GuideHelper.prototype.disposeInternal = function() {
  this.guideOutline_.dispose();
  delete this.guideOutline_;
  thin.core.GuideHelper.superClass_.disposeInternal.call(this);
};
