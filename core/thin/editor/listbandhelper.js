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
   * @type {thin.editor.DraggableLine}
   * @private
   */
  this.draggableLine_ = this.createDraggableLine_();
  
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

  var scope = this;
  var layout = this.layout_;
  var helpers = layout.getHelpers();
  var draggableLine = this.draggableLine_;
  var renderTo = opt_renderTo || helpers.getListHelper();

  layout.appendChild(this.label_, renderTo);
  layout.appendChild(this.drawLayer_, renderTo);
  layout.appendChild(draggableLine, renderTo);
  layout.appendChild(this.selectorLayer_, renderTo);
  
  draggableLine.init();

  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var guide = helpers.getGuideHelper();
  var listHelper = helpers.getListHelper();
  var columnNameForScope = this.columnName_;
  var draggableLineDragger = draggableLine.getDragger();

  goog.events.listen(draggableLineDragger, thin.editor.AbstractDragger.EventType.BEFORESTART, function(e) {
    var listShape = listHelper.getTarget();
    var listShapeBounds = listShape.getBounds();
    var columnShapeForScope = listShape.getColumnShape(columnNameForScope);
    
    var blankRangeHeight = listHelper.getBlankRangeBounds().height;
    var columnBoundsByShapes = layout.calculateActiveShapeBounds(
          columnShapeForScope.getManager().getShapesManager().get());
    var columnBounds = columnShapeForScope.getBounds();
    var limitTop = columnBoundsByShapes.toBox().bottom || columnBounds.top;
    this.setLimits(new goog.math.Rect(listShapeBounds.left,
                   limitTop, listShapeBounds.width, (columnBounds.toBox().bottom + blankRangeHeight) - limitTop));
    
  }, false, draggableLineDragger);
  
  goog.events.listen(draggableLineDragger, goog.fx.Dragger.EventType.END, function(e) {
    
    var captureProperties = multipleShapesHelper.getCloneProperties();
    var listShape = listHelper.getTarget();
    var columnShapeForScope = listShape.getColumnShape(columnNameForScope);
    var captureColumnBounds = columnShapeForScope.getBounds();
    var captureColumnHeight = captureColumnBounds.height;
    var captureColumnBottom = captureColumnBounds.toBox().bottom;
    var newColumnBottom = draggableLine.getTop();
    var transLateY = newColumnBottom - captureColumnBottom;
    var transLateCoordinate = new goog.math.Coordinate(0, transLateY);
    var retransLateCoordinate = new goog.math.Coordinate(0, captureColumnBottom - newColumnBottom);
    var newColumnHeight = thin.editor.numberWithPrecision(captureColumnHeight + transLateY);
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
    
  }, false, draggableLineDragger);
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
 * @return {thin.editor.DraggableLine}
 */
thin.editor.ListBandHelper.prototype.getDraggableLine = function() {
  return this.draggableLine_;
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
  var draggableLine = this.draggableLine_;
  draggableLine.setWidth(columnWidth);
  draggableLine.setLeft(columnBounds.left);
  draggableLine.setTop(columnTop + columnHeight);
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
  var draggableLine = this.draggableLine_;
  draggableLine.setVisibled(isEnabledForColumn);
  draggableLine.getDragger().setEnabled(isEnabledForColumn);
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
    this.draggableLine_.setVisibled(false);
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
 * @return {thin.editor.DraggableLine}
 * @private
 */
thin.editor.ListBandHelper.prototype.createDraggableLine_ = function() {
  var layout = this.layout_;
  var draggableLine = new thin.editor.DraggableLine(
        thin.editor.DraggableLine.Direction.HORIZONTAL, layout, 
        thin.editor.ListBandHelper.FILL_);
  
  var cursorResizePortrait = new thin.editor.Cursor(thin.editor.Cursor.Type['TCENTER']);
  draggableLine.setCursor(cursorResizePortrait);
  layout.setElementCursor(draggableLine.getElement(), cursorResizePortrait);
  return draggableLine;
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
  var draggableLine = this.draggableLine_;
  var drawLayer = this.drawLayer_;
  var selectorLayer = this.selectorLayer_;
  draggableLine.dispose();
  selectorLayer.dispose();
  drawLayer.dispose();
  layout.remove(draggableLine);
  layout.remove(selectorLayer);
  layout.remove(drawLayer);
  delete this.draggableLine_;
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