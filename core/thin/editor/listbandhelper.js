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

goog.provide('thin.editor.ListBandHelper');
goog.provide('thin.editor.HeaderBandHelper');
goog.provide('thin.editor.DetailBandHelper');
goog.provide('thin.editor.PageFooterBandHelper');
goog.provide('thin.editor.FooterBandHelper');

goog.require('goog.dom');
goog.require('goog.array');
goog.require('goog.Disposable');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('thin.editor.Cursor');
goog.require('thin.editor.Cursor.Type');
goog.require('thin.editor.TextShape');
goog.require('thin.editor.TextStyle');
goog.require('thin.editor.TextStyle.HorizonAlignType');
goog.require('thin.editor.TextStyle.VerticalAlignType');
goog.require('thin.editor.Layer');
goog.require('thin.editor.DraggableLine');
goog.require('thin.editor.DraggableLine.Direction');
goog.require('thin.editor.ModuleShape');


/**
 * @param {thin.editor.Layout} layout
 * @param {string} columnName
 * @constructor
 * @extends {goog.Disposable}
 */
thin.editor.ListBandHelper = function(layout, columnName) {
  
  /**
   * @type {thin.editor.Layout}
   * @private
   */
  this.layout_ = layout;
  
  /**
   * @type {string}
   * @private
   */
  this.columnName_ = columnName;
  
  /**
   * @type {thin.editor.ListBandHelper.Separator}
   * @private
   */
  this.separator_ = new thin.editor.ListBandHelper.Separator(layout);
  
  /**
   * @type {thin.editor.Layer}
   * @private
   */
  this.drawLayer_ = this.createDrawLayer_();
  
  /**
   * @type {thin.editor.Layer}
   * @private
   */
  this.selectorLayer_ = this.createSelectorLayer_();
  
  /**
   * @type {thin.editor.TextShape}
   * @private
   */
  this.label_ = this.createColumnLabel_();
};
goog.inherits(thin.editor.ListBandHelper, goog.Disposable);
goog.mixin(thin.editor.ListBandHelper.prototype, thin.editor.ModuleShape.prototype);


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.editor.ListBandHelper.FILL_ = new goog.graphics.SolidFill('#AAAAAA');


/**
 * @type {boolean}
 * @private
 */
thin.editor.ListBandHelper.prototype.actived_ = true;


/**
 * @param {thin.editor.Component=} opt_renderTo
 */
thin.editor.ListBandHelper.prototype.init = function(opt_renderTo) {
  var layout = this.layout_;
  var separator = this.separator_;
  var renderTo = opt_renderTo || layout.getHelpers().getListHelper();

  layout.appendChild(this.label_, renderTo);
  layout.appendChild(this.drawLayer_, renderTo);
  layout.appendChild(separator, renderTo);
  layout.appendChild(this.selectorLayer_, renderTo);

  separator.init(this.columnName_);
};


/**
 * @return {boolean}
 */
thin.editor.ListBandHelper.prototype.isActived = function() {
  return this.actived_;
};


/**
 * @return {thin.editor.Layer}
 */
thin.editor.ListBandHelper.prototype.getDrawLayer = function() {
  return this.drawLayer_;
};


/**
 * @return {thin.editor.Layer}
 */
thin.editor.ListBandHelper.prototype.getSelectorLayer = function() {
  return this.selectorLayer_;
};


/**
 * @return {thin.editor.ListBandHelper.Separator}
 */
thin.editor.ListBandHelper.prototype.getSeparator = function() {
  return this.separator_;
};


/**
 * @param {thin.editor.ListShape} target
 * @param {goog.math.Rect} columnBounds
 */
thin.editor.ListBandHelper.prototype.update = function(target, columnBounds) {
  var columnTop = columnBounds.top;
  var columnWidth = columnBounds.width;
  var columnHeight = columnBounds.height;
  this.drawLayer_.setBounds(columnBounds);
  this.selectorLayer_.setBounds(columnBounds);
  var label = this.label_;
  label.setBounds(columnBounds);
  label.setVisibled(label.getMinHeight() <= columnHeight &&
                    label.getMinWidth() <= columnWidth);

  var separator = this.separator_;
  separator.setWidth(columnWidth);
  separator.setLeft(columnBounds.left);
  separator.setTop(columnTop + columnHeight);
  var columnShapeForScope = target.getColumnShape(this.columnName_);
  columnShapeForScope.setTopForColumn(columnTop);
  columnShapeForScope.setHeightForColumn(columnHeight);
};


/**
 * @param {thin.editor.ListShape} target
 * @param {boolean=} opt_visibled
 */
thin.editor.ListBandHelper.prototype.active = function(target, opt_visibled) {
  var columnShapeForScope = target.getColumnShape(this.columnName_);
  var isEnabledForColumn = columnShapeForScope.isEnabledForColumn();
  var separator = this.separator_;
  separator.setVisibled(isEnabledForColumn);
  separator.getDragger().setEnabled(isEnabledForColumn);
  if (goog.isBoolean(opt_visibled)) {
    this.drawLayer_.setVisibled(opt_visibled);
  } else {
    this.drawLayer_.setVisibled(
      this.layout_.getWorkspace().getUiStatusForAction() != 'selector');
  }
  
  if (isEnabledForColumn) {
    var selectorLayer = this.selectorLayer_;
    var selectorElement = selectorLayer.getElement();
    goog.dom.insertSiblingBefore(selectorElement, columnShapeForScope.getGroup().getElement());
    selectorLayer.setVisibled(true);
    goog.dom.insertSiblingBefore(this.label_.getElement(), selectorElement);
  }
  this.actived_ = false;
};


thin.editor.ListBandHelper.prototype.inactive = function() {

  if (!this.isActived()) {
    var layout = this.layout_;
    this.drawLayer_.setVisibled(false);
    this.separator_.setVisibled(false);
    var selectorLayer = this.selectorLayer_;
    selectorLayer.setVisibled(false);
    var listHelperGroup = layout.getHelpers().getListHelper();
    layout.appendChild(selectorLayer, listHelperGroup);
    var label = this.label_;
    layout.appendChild(label, listHelperGroup);
    label.setVisibled(false);
    this.actived_ = true;
  }
};


/**
 * @return {thin.editor.Layer}
 * @private
 */
thin.editor.ListBandHelper.prototype.createDrawLayer_ = function() {
  var layout = this.layout_;
  var drawLayer = new thin.editor.Layer(layout);
  drawLayer.setCursor(new thin.editor.Cursor(thin.editor.Cursor.Type['CROSSHAIR']));
  layout.setElementCursor(drawLayer.getElement(), drawLayer.getCursor());
  return drawLayer;
};


/**
 * @return {thin.editor.Layer}
 * @private
 */
thin.editor.ListBandHelper.prototype.createSelectorLayer_ = function() {
  var layout = this.layout_;
  var selectorLayer = new thin.editor.Layer(layout);
  selectorLayer.setCursor(new thin.editor.Cursor(thin.editor.Cursor.Type['CROSSHAIR']));
  layout.setElementCursor(selectorLayer.getElement(), selectorLayer.getCursor());
  selectorLayer.setFill(new goog.graphics.SolidFill('#FFFFFF', 0.3));
  return selectorLayer;
};


/**
 * @return {thin.editor.TextShape}
 * @private
 */
thin.editor.ListBandHelper.prototype.createColumnLabel_ = function() {
  var layout = this.layout_;
  var columnLabel = new thin.editor.TextShape(layout.createSvgElement('g'), layout);
  columnLabel.createTextContent(this.columnName_.toLowerCase());
  columnLabel.setFontItalic(true);
  columnLabel.setFontFamily('Georgia');
  columnLabel.setFontSize(12);
  columnLabel.setTextAnchor(thin.editor.TextStyle.HorizonAlignType.MIDDLE);
  columnLabel.setVerticalAlign(thin.editor.TextStyle.VerticalAlignType.CENTER);
  columnLabel.setFill(new goog.graphics.SolidFill('#AAAAAA'));
  columnLabel.setVisibled(false);
  return columnLabel;
};


/** @inheritDoc */
thin.editor.ListBandHelper.prototype.disposeInternal = function() {
  this.inactive();
  var layout = this.layout_;

  var separator = this.separator_;
  var drawLayer = this.drawLayer_;
  var selectorLayer = this.selectorLayer_;

  separator.dispose();
  selectorLayer.dispose();
  drawLayer.dispose();

  layout.remove(separator);
  layout.remove(selectorLayer);
  layout.remove(drawLayer);
  delete this.separator_;
  delete this.drawLayer_;
  delete this.selectorLayer_;
};


/**
 * @param {thin.editor.Layout} layout
 * @param {string} columnName
 * @constructor
 * @extends {thin.editor.ListBandHelper}
 */
thin.editor.HeaderBandHelper = function(layout, columnName) {
  thin.editor.ListBandHelper.call(this, layout, columnName);
};
goog.inherits(thin.editor.HeaderBandHelper, thin.editor.ListBandHelper);


/**
 * @param {thin.editor.Layout} layout
 * @param {string} columnName
 * @constructor
 * @extends {thin.editor.ListBandHelper}
 */
thin.editor.DetailBandHelper = function(layout, columnName) {
  thin.editor.ListBandHelper.call(this, layout, columnName);
};
goog.inherits(thin.editor.DetailBandHelper, thin.editor.ListBandHelper);



/**
 * @param {thin.editor.Layout} layout
 * @param {string} columnName
 * @constructor
 * @extends {thin.editor.ListBandHelper}
 */
thin.editor.PageFooterBandHelper = function(layout, columnName) {
  thin.editor.ListBandHelper.call(this, layout, columnName);
};
goog.inherits(thin.editor.PageFooterBandHelper, thin.editor.ListBandHelper);


/**
 * @param {thin.editor.Layout} layout
 * @param {string} columnName
 * @constructor
 * @extends {thin.editor.ListBandHelper}
 */
thin.editor.FooterBandHelper = function(layout, columnName) {
  thin.editor.ListBandHelper.call(this, layout, columnName);
};
goog.inherits(thin.editor.FooterBandHelper, thin.editor.ListBandHelper);


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.Component}
 */
thin.editor.ListBandHelper.Separator = function(layout) {
  
  /**
   * @type {thin.editor.Layout}
   * @private
   */
  this.layout_ = layout;

  /**
   * @type {thin.editor.DraggableLine}
   * @private
   */
  this.line_ = this.createLine_();
  
  /**
   * @type {thin.editor.Rect}
   * @private
   */
  this.leftHandle_ = this.createHandle_();
  
  /**
   * @type {thin.editor.Rect}
   * @private
   */
  this.rightHandle_ = this.createHandle_();

  goog.base(this, layout);
  this.setVisibled(false);
};
goog.inherits(thin.editor.ListBandHelper.Separator, thin.editor.Component);


/**
 * @enum {number}
 * @private
 */
thin.editor.ListBandHelper.Separator.DefaultHandleSetting_ = {
  WIDTH: 3,
  HEIGHT: 13,
  INTERVAL: 1.5
};


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.editor.ListBandHelper.Separator.FILL_ = new goog.graphics.SolidFill('#AAAAAA', 0.6);


/**
 * @return {thin.editor.DraggableLine}
 * @private
 */
thin.editor.ListBandHelper.Separator.prototype.createLine_ = function() {
  return new thin.editor.DraggableLine(
                    thin.editor.DraggableLine.Direction.HORIZONTAL, this.layout_, 
                    thin.editor.ListBandHelper.FILL_);
};


/**
 * @return {thin.editor.Rect}
 * @private
 */
thin.editor.ListBandHelper.Separator.prototype.createHandle_ = function() {
  var layout = this.layout_;
  return new thin.editor.Rect(layout.createSvgElement('rect'),
                layout, null, thin.editor.ListBandHelper.Separator.FILL_);
};


/**
 * @return {thin.editor.DraggableLine}
 */
thin.editor.ListBandHelper.Separator.prototype.getLine = function() {
  return this.line_;
};


/**
 * @return {void}
 */
thin.editor.ListBandHelper.Separator.prototype.setup = function() {
  var layout = this.layout_;
  var cursor = new thin.editor.Cursor(thin.editor.Cursor.Type['TCENTER']);
  this.setCursor(cursor);
  layout.setElementCursor(this.getElement(), cursor);
  layout.appendChild(this.line_, this);
  layout.appendChild(this.leftHandle_, this);
  layout.appendChild(this.rightHandle_, this);
};


/**
 * @param {string} sectionName
 * @return {void}
 */
thin.editor.ListBandHelper.Separator.prototype.init = function(sectionName) {
  var scope = this;
  var layout = this.layout_;
  var line = this.line_;
  var helpers = layout.getHelpers();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var guide = helpers.getGuideHelper();
  var listHelper = helpers.getListHelper();
  
  var body = goog.dom.getDocument().body;
  var dragLayer = layout.getHelpers().getDragLayer();
  var dragger = new thin.editor.SvgDragger(this);
  dragger.setDragModeByCoordinate(line.isVertical(), line.isHorizontal());
  var cursor = this.getCursor();
  var eventType = thin.editor.AbstractDragger.EventType;
  var fxEventType = goog.fx.Dragger.EventType;

  goog.events.listen(dragger, eventType.BEFORESTART, function(e) {
    dragLayer.setCursor(cursor);
    layout.setElementCursor(dragLayer.getElement(), cursor);
    goog.style.setStyle(body, 'cursor', cursor.getType());
    dragLayer.setVisibled(true);
  }, false, dragger);

  goog.events.listen(dragger, fxEventType.END, function(e) {
    var defaultType = thin.editor.Cursor.Type['DEFAULT'];
    var defaultCursor = new thin.editor.Cursor(defaultType);
    dragLayer.setCursor(defaultCursor);
    layout.setElementCursor(dragLayer.getElement(), defaultCursor);
    goog.style.setStyle(body, 'cursor', defaultType);
    dragLayer.setVisibled(false);
  }, false, dragger);

  goog.events.listen(dragger, eventType.BEFORESTART, function(e) {
    var listShape = listHelper.getTarget();
    var listShapeBounds = listShape.getBounds();
    var columnShapeForScope = listShape.getColumnShape(sectionName);
    
    var blankRangeHeight = listHelper.getBlankRangeBounds().height;
    var columnBoundsByShapes = layout.calculateActiveShapeBounds(
          columnShapeForScope.getManager().getShapesManager().get());
    var columnBounds = columnShapeForScope.getBounds();
    var limitTop = columnBoundsByShapes.toBox().bottom || columnBounds.top;
    this.setLimits(new goog.math.Rect(listShapeBounds.left,
                   limitTop, listShapeBounds.width, (columnBounds.toBox().bottom + blankRangeHeight) - limitTop));
  }, false, dragger);

  goog.events.listen(dragger, fxEventType.END, function(e) {
    var captureProperties = multipleShapesHelper.getCloneProperties();
    var listShape = listHelper.getTarget();
    var columnShapeForScope = listShape.getColumnShape(sectionName);
    var captureColumnBounds = columnShapeForScope.getBounds();
    var captureColumnHeight = captureColumnBounds.height;
    var captureColumnBottom = captureColumnBounds.toBox().bottom;
    var newColumnBottom = line.getTop();
    var transLateY = newColumnBottom - captureColumnBottom;
    var transLateCoordinate = new goog.math.Coordinate(0, transLateY);
    var retransLateCoordinate = new goog.math.Coordinate(0, captureColumnBottom - newColumnBottom);
    var newColumnHeight = thin.numberWithPrecision(captureColumnHeight + transLateY);
    var activeShapeManagerByListShape = listHelper.getActiveShape();
    var shapes = activeShapeManagerByListShape.getClone();
    var singleShape = activeShapeManagerByListShape.getIfSingle();
    var isMultiple = activeShapeManagerByListShape.isMultiple();
    var isEmpty = activeShapeManagerByListShape.isEmpty();
    
    /**
     * @param {number} columnHeight
     * @param {goog.math.Coordinate} transLate
     */
    var updateListShape = function(columnHeight, transLate) {
      columnShapeForScope.setHeightForColumn(columnHeight);
      listHelper.setTransLateOfNextColumnShapes(transLate, columnShapeForScope);
      listHelper.update(listShape);
      if (guide.isEnable()) {
        goog.array.forEach(shapes, function(shape) {
          shape.getTargetOutline().setBounds(shape.getBounds());
        });
        if (isMultiple) {
          multipleShapesHelper.setCloneProperties(captureProperties);
        }
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }
      
      if (isEmpty) {
        listShape.updateProperties();
      } else {
        if (isMultiple) {
          multipleShapesHelper.updateProperties();
        } else {
          singleShape.updateProperties();
        }
      }
    };

    layout.getWorkspace().normalVersioning(function(version) {
    
      version.upHandler(function() {
        updateListShape(newColumnHeight, transLateCoordinate);
      }, scope);
      
      version.downHandler(function() {
        updateListShape(captureColumnHeight, retransLateCoordinate);
      }, scope);
    });
    
  }, false, dragger);

  this.dragger_ = dragger;
};


/**
 * @param {number} left
 */
thin.editor.ListBandHelper.Separator.prototype.setLeft = function(left) {
  this.line_.setLeft(left);
  this.setLeftForHandle_(left);

  left = thin.numberWithPrecision(left - this.getParentTransLateX());
  this.left_ = left;
};


/**
 * @param {number} left
 * @private
 */
thin.editor.ListBandHelper.Separator.prototype.setLeftForHandle_ = function(left) {
  var layout = this.layout_;
  var listGuideHelper = layout.getHelpers().getListHelper().getListGuideHelper();
  var strokeWidth = listGuideHelper.getStrokeWidth();
  var setting = thin.editor.ListBandHelper.Separator.DefaultHandleSetting_;
  var interval = setting.INTERVAL / layout.getPixelScale();
  var leftHandle = this.leftHandle_;

  leftHandle.setLeft(left - (leftHandle.getWidth() + strokeWidth) - interval);
  this.rightHandle_.setLeft(left + this.line_.getWidth() + strokeWidth + interval);
};


/**
 * @param {number} top
 */
thin.editor.ListBandHelper.Separator.prototype.setTop = function(top) {
  var leftHandle = this.leftHandle_;
  var rightHandle = this.rightHandle_;

  this.line_.setTop(top);
  leftHandle.setTop(top - (leftHandle.getHeight() / 2));
  rightHandle.setTop(top - (rightHandle.getHeight() / 2));
  
  top = thin.numberWithPrecision(top - this.getParentTransLateY());
  this.top_ = top;
};


/**
 * @param {number} width
 */
thin.editor.ListBandHelper.Separator.prototype.setWidth = function(width) {
  this.line_.setWidth(width);

  width = thin.numberWithPrecision(width);
  this.width_ = width;
};


/**
 * @return {void}
 */
thin.editor.ListBandHelper.Separator.prototype.reapplySizeAndStroke = function() {
  this.line_.reapplySizeAndStroke();
  var setting = thin.editor.ListBandHelper.Separator.DefaultHandleSetting_;
  var sizeForScale = new goog.math.Size(setting.WIDTH, setting.HEIGHT);
  var layout = this.layout_;
  layout.setSizeByScale(this.leftHandle_, sizeForScale);
  layout.setSizeByScale(this.rightHandle_, sizeForScale);
  this.setLeft(this.getLeft());
  this.setTop(this.getTop());
};


/**
 * @return {thin.editor.SvgDragger}
 */
thin.editor.ListBandHelper.Separator.prototype.getDragger = function() {
  return this.dragger_;
};


/** @override */
thin.editor.ListBandHelper.Separator.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  
  this.line_.dispose();
  this.leftHandle_.dispose();
  this.rightHandle_.dispose();
  
  delete this.layout_;
  delete this.line_;
  delete this.leftHandle_;
  delete this.rightHandle_;
};