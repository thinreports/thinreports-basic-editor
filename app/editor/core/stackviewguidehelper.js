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

goog.provide('thin.core.StackViewGuideHelper');
goog.provide('thin.core.StackViewGuideHelper.Stroke_');

goog.require('goog.dom');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('thin.core.Cursor');
goog.require('thin.core.Cursor.Type');
goog.require('thin.core.AbstractDragger');
goog.require('thin.core.AbstractDragger.EventType');
goog.require('thin.core.SvgDragger');
goog.require('thin.core.SvgResizer');
goog.require('thin.core.SvgResizer.Horizon');
goog.require('thin.core.SvgResizer.Vertical');
goog.require('thin.core.Layer');
goog.require('thin.core.AbstractGuideHelper');
goog.require('thin.core.AbstractGuideHelper.PositionName');
goog.require('thin.core.GuideBody');
goog.require('thin.core.StackViewGuideResizer');


/**
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {thin.core.AbstractGuideHelper}
 */
thin.core.StackViewGuideHelper = function(layout) {
  thin.core.AbstractGuideHelper.call(this, layout);
  this.setVisibled(false);
};
goog.inherits(thin.core.StackViewGuideHelper, thin.core.AbstractGuideHelper);


/**
 * @enum {string}
 */
thin.core.StackViewGuideHelper.Stroke_ = {
  STROKECOLOR: '#AAAAAA',
  STROKEWIDTH: '8px',
  STROKEOPACITY: '0.6'
};


/**
 * @type {goog.math.Rect}
 * @private
 */
thin.core.StackViewGuideHelper.prototype.normalBounds_;


thin.core.StackViewGuideHelper.prototype.setup = function() {

  var strokeSetting = thin.core.StackViewGuideHelper.Stroke_;
  var layout = this.getLayout();
  var element = layout.createSvgElement('rect', {
    'stroke-opacity': strokeSetting.STROKEOPACITY
  });
  var guideBody = new thin.core.GuideBody(element, layout,
                    new goog.graphics.Stroke(strokeSetting.STROKEWIDTH, strokeSetting.STROKECOLOR), null);
  guideBody.setRounded(0.5);

  var cursorMove = new thin.core.Cursor(thin.core.Cursor.Type.MOVE);
  guideBody.setCursor(cursorMove);
  layout.setElementCursor(element, cursorMove);

  layout.appendChild(guideBody, this);
  this.body_ = guideBody;
  this.createResizers_();
};


/**
 * @private
 */
thin.core.StackViewGuideHelper.prototype.createResizers_ = function() {
  var layout = this.getLayout();
  var resizer;

  goog.object.forEach(thin.core.AbstractGuideHelper.PositionName,
    goog.bind(function(positionNameForEach) {
      resizer = new thin.core.StackViewGuideResizer(layout, this, positionNameForEach);
      layout.appendChild(resizer, this);
      goog.object.set(this.resizers_, positionNameForEach, resizer);
    }, this));
};


/**
 * @return {number}
 * @private
 */
thin.core.StackViewGuideHelper.prototype.getStrokeWidth = function() {
  return Number(this.body_.getElement().getAttribute('stroke-width'));
};


/**
 * @param {goog.math.Rect} bounds
 */
thin.core.StackViewGuideHelper.prototype.setBounds = function(bounds) {
  var strokeWidth = this.getStrokeWidth();
  var delta = strokeWidth / 2;
  this.body_.setBounds(new goog.math.Rect(
    bounds.left - delta, bounds.top - delta,
    bounds.width + strokeWidth, bounds.height + strokeWidth));
  this.normalBounds_ = bounds;
};


/**
 * @return {goog.math.Rect}
 */
thin.core.StackViewGuideHelper.prototype.getBounds = function() {
  if (goog.isDefAndNotNull(this.normalBounds_)) {
    return this.normalBounds_;
  }
  var bounds = this.getBounds_();
  var strokeWidth = this.getStrokeWidth();
  var delta = strokeWidth / 2;
  return new goog.math.Rect(
    bounds.left + delta, bounds.top + delta,
    bounds.width - strokeWidth, bounds.height - strokeWidth);
};


/**
 * @return {goog.math.Rect}
 * @private
 */
thin.core.StackViewGuideHelper.prototype.getBounds_ = function() {
  return thin.core.StackViewGuideHelper.superClass_.getBounds.call(this);
};


thin.core.StackViewGuideHelper.prototype.reapplySizeAndStroke = function() {
  var bounds = this.getBounds();
  this.body_.reapplyStroke();
  if(bounds.width > 0 && bounds.height > 0) {
    this.setBounds(bounds);
  }
  goog.object.forEach(thin.core.AbstractGuideHelper.PositionName, goog.bind(function(positionName) {
    this.getResizerByPositionName(positionName).reapplyStrokeAndSize();
  }, this));
};


thin.core.StackViewGuideHelper.prototype.adjustToTargetShapeBounds = function() {

  var bounds = this.getBounds_();
  var strokeWidth = this.getStrokeWidth();
  var delta = strokeWidth / 2;
  var normalLeft = bounds.left;
  var normalTop = bounds.top;
  var left = normalLeft - delta;
  var top = normalTop - delta;
  var width = bounds.width;
  var height = bounds.height;
  var center = normalLeft + (width / 2);
  var middle = normalTop + (height / 2);
  var right = left + width;
  var bottom = top + height;

  var positionName = thin.core.AbstractGuideHelper.PositionName;

  this.getResizerByPositionName(positionName.TLEFT).adjustToResizerBounds(left, top, strokeWidth);
  this.getResizerByPositionName(positionName.TCENTER).adjustToResizerBounds(center, top, strokeWidth);
  this.getResizerByPositionName(positionName.TRIGHT).adjustToResizerBounds(right, top, strokeWidth);
  this.getResizerByPositionName(positionName.MLEFT).adjustToResizerBounds(left, middle, strokeWidth);
  this.getResizerByPositionName(positionName.MRIGHT).adjustToResizerBounds(right, middle, strokeWidth);
  this.getResizerByPositionName(positionName.BLEFT).adjustToResizerBounds(left, bottom, strokeWidth);
  this.getResizerByPositionName(positionName.BCENTER).adjustToResizerBounds(center, bottom, strokeWidth);
  this.getResizerByPositionName(positionName.BRIGHT).adjustToResizerBounds(right, bottom, strokeWidth);
};


thin.core.StackViewGuideHelper.prototype.init = function() {

  var scope = this;
  this.reapplySizeAndStroke();
  var sectionNameForFooter = thin.core.StackViewHelper.SectionName.FOOTER;
  var body = goog.dom.getDocument().body;
  var layout = this.getLayout();
  var workspace = layout.getWorkspace();
  var helpers = layout.getHelpers();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var guide = helpers.getGuideHelper();
  var listHelper = helpers.getListHelper();
  var listOutline = helpers.getListOutline();
  var dragLayer = helpers.getDragLayer();
  var positionName = thin.core.AbstractGuideHelper.PositionName;
  var eventType = goog.fx.Dragger.EventType;
  var draggerEventType = thin.core.AbstractDragger.EventType;
  var horizon = thin.core.SvgResizer.Horizon;
  var vertical = thin.core.SvgResizer.Vertical;
  var cursorType = thin.core.Cursor.Type;
  var bodyDragger = new thin.core.SvgDragger(listOutline, this.body_);
  var activeRow;

  goog.events.listen(bodyDragger, eventType.START, function(e) {

    listOutline.setBounds(listHelper.getTarget().getBounds());
    var bounds = layout.getBounds();
    var guideBounds = this.getBounds();
    bodyDragger.setLimits(new goog.math.Rect(bounds.left, bounds.top, bounds.width - guideBounds.width, bounds.height - guideBounds.height));
    bodyDragger.setAdsorptionX(helpers.getAdsorptionX());
    bodyDragger.setAdsorptionY(helpers.getAdsorptionY());
    var cursorTypeMove = thin.core.Cursor.Type.MOVE;
    var cursorMove = new thin.core.Cursor(cursorTypeMove);
    goog.style.setStyle(body, 'cursor', cursorTypeMove);
    dragLayer.setCursor(cursorMove);
    layout.setElementCursor(dragLayer.getElement(), cursorMove);
    dragLayer.setVisibled(true);
    guide.setDisable();
    helpers.disableAll();
    activeRow = listHelper.getActiveRow();
    // activeRow = listHelper.getActiveSectionName();
    listHelper.initActiveSectionName();
    listHelper.getTarget().updateProperties();
  }, false, this);

  goog.events.listen(bodyDragger, eventType.BEFOREDRAG, function(e) {
    if (!listOutline.isEnable()) {
      listOutline.enable();
    }
  }, false, this);

  goog.events.listen(bodyDragger, eventType.END, function(e) {

    var cursorTypeDefault = thin.core.Cursor.Type.DEFAULT;
    var cursorDefault = new thin.core.Cursor(cursorTypeDefault);
    goog.style.setStyle(body, 'cursor', cursorTypeDefault);
    dragLayer.setCursor(cursorDefault);
    layout.setElementCursor(dragLayer.getElement(), cursorDefault);
    dragLayer.setVisibled(false);
    var listShape = listHelper.getTarget();
    var outlineBounds = listOutline.getBounds();
    var shapeBounds = this.getBounds();
    var enabled = listOutline.isEnable();
    listOutline.disable();

    var currentPosition = new goog.math.Coordinate(e.endX, e.endY);
    var startTransLate = bodyDragger.getStartTransLatePosition();
    var transLate = goog.math.Coordinate.difference(currentPosition, startTransLate);
    var reLocation = goog.math.Coordinate.difference(startTransLate, currentPosition);
    var captureProperties = multipleShapesHelper.getCloneProperties();
    var activeShapeManagerByStackViewShape = listHelper.getActiveShape();
    var shapes = activeShapeManagerByStackViewShape.getClone();
    var singleShapeByStackViewShape = activeShapeManagerByStackViewShape.getIfSingle();
    var isEmpty = activeShapeManagerByStackViewShape.isEmpty()


    /**
     * @param {goog.math.Rect} targetBounds
     * @param {goog.math.Coordinate} transLateCoordinate
     */
    var bodyDragEndListener = function(targetBounds, transLateCoordinate) {
      if (activeShapeManagerByStackViewShape.isEmpty()) {
        listShape.updateProperties();
        thin.ui.setEnabledForFontUi(false);
      } else {
        if (singleShapeByStackViewShape) {
          singleShapeByStackViewShape.updateProperties();
          singleShapeByStackViewShape.updateToolbarUI();
          guide.setEnableAndTargetShape(singleShapeByStackViewShape);
        } else {
          layout.setOutlineForMultiple(shapes);
          layout.calculateGuideBounds(shapes);
          guide.setEnableAndTargetShape(helpers.getMultiOutlineHelper());
          multipleShapesHelper.setCloneProperties(captureProperties);
          multipleShapesHelper.updateProperties();
          thin.ui.setEnabledForFontUi(true);
        }
      }

      if (enabled) {
        listOutline.setTargetShape(listShape);
        listOutline.setBounds(targetBounds);
        listOutline.setBoundsForTargetShape(targetBounds);
        listHelper.setTransLate(transLateCoordinate);

        if (guide.isEnable()) {
          goog.array.forEach(shapes, function(shape) {
            shape.getTargetOutline().setBounds(shape.getBounds());
          });
          layout.calculateGuideBounds(shapes);
          guide.adjustToTargetShapeBounds();
        }
      }
    };

    workspace.normalVersioning(function(version) {
      if (goog.math.Rect.equals(shapeBounds, outlineBounds) &&
           goog.math.Coordinate.equals(transLate, reLocation)) {
        version.setChanged(false);
      }

      version.upHandler(function() {
        guide.setDisable();
        helpers.disableAll();
        activeShapeManagerByStackViewShape.clear();
        listHelper.initActiveSectionName();
        bodyDragEndListener(outlineBounds, transLate);
      }, scope);

      version.downHandler(function() {
        activeShapeManagerByStackViewShape.set(shapes);
        listHelper.setActiveRow(activeRow);
        // listHelper.setActiveSectionName(activeRow);
        bodyDragEndListener(shapeBounds, reLocation);
      }, scope);
    });
  }, false, this);


  /**
   * @param {goog.events.BrowserEvent} e
   */
  var startResizeListener = function(e) {

    var resizer = e.dragger;
    resizer.setAdsorptionX(helpers.getAdsorptionX());
    resizer.setAdsorptionY(helpers.getAdsorptionY());
    resizer.setResizeModeByCoordinate(true);
    resizer.setResizeModeByTransScale(false);
    resizer.setLimits(resizer.calculateLimitsForResize(scope.getBounds(), layout.getBounds().toBox()));

    var listShape = listHelper.getTarget();
    listOutline.setTargetShape(listShape);
    var limitBox = resizer.limits.toBox();
    var contentLeftArray = [];
    var contentRightArray = [];

    goog.array.forEach(listShape.getRows(), function (row) {
      var minLimitLeft = limitBox.right;
      var minLimitRight = limitBox.left;
      if (row.isEnabled()) {
        var shapesManagerBySection = row.getManager().getShapesManager();
        if (!shapesManagerBySection.isEmpty()) {
          var boxSizeByShapes = layout.calculateActiveShapeBounds(shapesManagerBySection.get()).toBox();
          var contentLeft = boxSizeByShapes.left;
          if (goog.isNumber(contentLeft)) {
            minLimitLeft = contentLeft;
          }
          var contentRight = boxSizeByShapes.right;
          if (goog.isNumber(contentRight)) {
            minLimitRight = contentRight;
          }
        }
      }
      goog.array.insert(contentLeftArray, minLimitLeft);
      goog.array.insert(contentRightArray, minLimitRight);
    }, this);
    goog.array.sort(contentLeftArray);
    goog.array.sort(contentRightArray);
    var minLeft = contentLeftArray[0];
    var minRight = contentRightArray[contentRightArray.length - 1];
    var listShapeBottom = listShape.getBounds().toBox().bottom;
    var movableHeight = listShapeBottom -
          goog.array.peek(listShape.getRows()).getBounds().toBox().bottom;
          // listShape.getSectionShape(sectionNameForFooter).getBounds().toBox().bottom;
    var minTop = listShape.getTop() + movableHeight;
    var minBottom = listShapeBottom - movableHeight;
    listOutline.enable();

    resizer.setSizeLimitFunction(function(nowBounds, startBounds) {

      var left = nowBounds.left;
      var top = nowBounds.top;
      var width = nowBounds.width;
      var height = nowBounds.height;
      var nowBox = nowBounds.toBox();
      var isLeft = this.isLeft_;
      var isBottom = this.isBottom_;

      if (isLeft && left > minLeft) {
        left = minLeft;
        if (this.isLeft_) {
          width = nowBox.right - left;
        }
      }
      if (!isLeft && nowBox.right < minRight) {
        width = minRight - left;
        if (this.isLeft_) {
          left = minRight + width;
        }
      }
      if (!isBottom && nowBox.top > minTop) {
        top = minTop;
        height = nowBox.bottom - minTop;
      }
      if (isBottom && nowBox.bottom < minBottom) {
        height = minBottom - top;
      }
      if (width == 0) {
        width = 1;
      }
      if (height == 0) {
        height = 1;
      }
      return new goog.math.Rect(
                thin.numberWithPrecision(left),
                thin.numberWithPrecision(top),
                thin.numberWithPrecision(width),
                thin.numberWithPrecision(height));
    });
  };


  /**
   * @param {goog.events.BrowserEvent} e
   */
  var endResizeListener = function(e) {
    var resizer = e.dragger;
    this.removeResizeCursor();
    listOutline.disable();
    var listShape = listHelper.getTarget();
    var listShapeBoundsForStart = listShape.getBounds();
    var listShapeBoundsForEnd = resizer.getEndShapeBounds() || listShapeBoundsForStart;
    var captureStackViewShapeTopForStart = listShapeBoundsForStart.top;
    var captureStackViewShapeTopForEnd = listShapeBoundsForEnd.top;

    var transLateCoordinate = new goog.math.Coordinate(0, captureStackViewShapeTopForEnd - captureStackViewShapeTopForStart);
    var retransLateCoordinate = new goog.math.Coordinate(0, captureStackViewShapeTopForStart - captureStackViewShapeTopForEnd);
    var activeShapeManagerByStackViewShape = listHelper.getActiveShape();
    var shapes = activeShapeManagerByStackViewShape.getClone();
    var singleShapeByStackViewShape = activeShapeManagerByStackViewShape.getIfSingle();
    var isEmptyByStackViewShape = activeShapeManagerByStackViewShape.isEmpty();

    /**
     * @param {goog.math.Rect} targetBounds
     * @param {goog.math.Coordinate} translate
     */
    var resizersDragEndListener = function(targetBounds, translate) {
      listOutline.setTargetShape(listShape);
      listOutline.setBounds(targetBounds);
      listOutline.setBoundsForTargetShape(targetBounds);
      listHelper.setTransLate(translate);

      if (guide.isEnable()) {
        goog.array.forEach(shapes, function(shape) {
          shape.getTargetOutline().setBounds(shape.getBounds());
        });

        if (singleShapeByStackViewShape) {
          singleShapeByStackViewShape.updateProperties();
        } else {
          multipleShapesHelper.captureProperties();
          multipleShapesHelper.updateProperties();
        }
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }
      if (isEmptyByStackViewShape) {
        listShape.updateProperties();
      }
    };

    workspace.normalVersioning(function(version) {
      if (goog.math.Rect.equals(listShapeBoundsForStart, listShapeBoundsForEnd) &&
           goog.math.Coordinate.equals(transLateCoordinate, retransLateCoordinate)) {
        version.setChanged(false);
      }

      version.upHandler(function() {
        resizersDragEndListener(listShapeBoundsForEnd, transLateCoordinate);
      }, scope);

      version.downHandler(function() {
        resizersDragEndListener(listShapeBoundsForStart, retransLateCoordinate);
      }, scope);
    });
  };

  var tleftResizer = this.getResizerByPositionName(positionName.TLEFT).getResizer();
  goog.events.listen(tleftResizer, draggerEventType.BEFORESTART, function(e) {
    this.setResizeCursor(cursorType.TLEFT);
    if (listHelper.getActiveShape().isEmpty()) {
      tleftResizer.setResizeModeByCoordinate(true);
      tleftResizer.setResizeModeByTransScale(false);
    }
  }, false, this);

  goog.events.listen(tleftResizer, eventType.START, startResizeListener, false, this);
  goog.events.listen(tleftResizer, eventType.END, endResizeListener, false, this);

  var tcenterResizer = this.getResizerByPositionName(positionName.TCENTER).getResizer();
  tcenterResizer.setResizeDirectionToHorizon(horizon.CENTER);
  tcenterResizer.setResizeDirectionToVertical(vertical.TOP);
  tcenterResizer.setAspectObserve(false);

  goog.events.listen(tcenterResizer, draggerEventType.BEFORESTART, function(e) {
    this.setResizeCursor(cursorType.TCENTER);
  }, false, this);

  goog.events.listen(tcenterResizer, eventType.START, startResizeListener, false, this);
  goog.events.listen(tcenterResizer, eventType.END, endResizeListener, false, this);

  var trightResizer = this.getResizerByPositionName(positionName.TRIGHT).getResizer();
  trightResizer.setResizeDirectionToHorizon(horizon.RIGHT);
  trightResizer.setResizeDirectionToVertical(vertical.TOP);

  goog.events.listen(trightResizer, draggerEventType.BEFORESTART, function(e) {
    this.setResizeCursor(cursorType.TRIGHT);
  }, false, this);

  goog.events.listen(trightResizer, eventType.START, startResizeListener, false, this);
  goog.events.listen(trightResizer, eventType.END, endResizeListener, false, this);

  var mleftResizer = this.getResizerByPositionName(positionName.MLEFT).getResizer();
  mleftResizer.setResizeDirectionToHorizon(horizon.LEFT);
  mleftResizer.setResizeDirectionToVertical(vertical.MIDDLE);
  mleftResizer.setAspectObserve(false);
  goog.events.listen(mleftResizer, draggerEventType.BEFORESTART, function(e) {
    this.setResizeCursor(cursorType.MLEFT);
  }, false, this);

  goog.events.listen(mleftResizer, eventType.START, startResizeListener, false, this);
  goog.events.listen(mleftResizer, eventType.END, endResizeListener, false, this);

  var mrightResizer = this.getResizerByPositionName(positionName.MRIGHT).getResizer();
  mrightResizer.setResizeDirectionToHorizon(horizon.RIGHT);
  mrightResizer.setResizeDirectionToVertical(vertical.MIDDLE);
  mrightResizer.setAspectObserve(false);
  goog.events.listen(mrightResizer, draggerEventType.BEFORESTART, function(e) {
    this.setResizeCursor(cursorType.MRIGHT);
  }, false, this);

  goog.events.listen(mrightResizer, eventType.START, startResizeListener, false, this);
  goog.events.listen(mrightResizer, eventType.END, endResizeListener, false, this);

  var bleftResizer = this.getResizerByPositionName(positionName.BLEFT).getResizer();
  bleftResizer.setResizeDirectionToHorizon(horizon.LEFT);
  bleftResizer.setResizeDirectionToVertical(vertical.BOTTOM);

  goog.events.listen(bleftResizer, draggerEventType.BEFORESTART, function(e) {
    this.setResizeCursor(cursorType.BLEFT);
  }, false, this);

  goog.events.listen(bleftResizer, eventType.START, startResizeListener, false, this);
  goog.events.listen(bleftResizer, eventType.END, endResizeListener, false, this);

  var bcenterResizer = this.getResizerByPositionName(positionName.BCENTER).getResizer();
  bcenterResizer.setResizeDirectionToHorizon(horizon.CENTER);
  bcenterResizer.setResizeDirectionToVertical(vertical.BOTTOM);
  bcenterResizer.setAspectObserve(false);
  goog.events.listen(bcenterResizer, draggerEventType.BEFORESTART, function(e) {
    this.setResizeCursor(cursorType.BCENTER);
  }, false, this);

  goog.events.listen(bcenterResizer, eventType.START, startResizeListener, false, this);
  goog.events.listen(bcenterResizer, eventType.END, endResizeListener, false, this);

  var brightResizer = this.getResizerByPositionName(positionName.BRIGHT).getResizer();
  brightResizer.setResizeDirectionToHorizon(horizon.RIGHT);
  brightResizer.setResizeDirectionToVertical(vertical.BOTTOM);

  goog.events.listen(brightResizer, draggerEventType.BEFORESTART, function(e) {
    this.setResizeCursor(cursorType.BRIGHT);
  }, false, this);

  goog.events.listen(brightResizer, eventType.START, startResizeListener, false, this);
  goog.events.listen(brightResizer, eventType.END, endResizeListener, false, this);
};


/** @inheritDoc */
thin.core.StackViewGuideHelper.prototype.disposeInternal = function() {
  thin.core.StackViewGuideHelper.superClass_.disposeInternal.call(this);
  delete this.normalBounds_;
};
