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

goog.provide('thin.editor.ListHelper');
goog.provide('thin.editor.ListHelper.ColumnName');

goog.require('goog.dom');
goog.require('goog.object');
goog.require('goog.math.Rect');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('thin.editor.Layer');
goog.require('thin.editor.Component');
goog.require('thin.editor.HeaderBandHelper');
goog.require('thin.editor.DetailBandHelper');
goog.require('thin.editor.PageFooterBandHelper');
goog.require('thin.editor.FooterBandHelper');
goog.require('thin.editor.ListGuideHelper');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.Component}
 */
thin.editor.ListHelper = function(layout) {
  thin.editor.Component.call(this, layout);
};
goog.inherits(thin.editor.ListHelper, thin.editor.Component);


/**
 * @enum {string}
 */
thin.editor.ListHelper.ColumnName = {
  HEADER: 'HEADER',
  DETAIL: 'DETAIL', 
  PAGEFOOTER: 'PAGEFOOTER',
  FOOTER: 'FOOTER'
};


/**
 * @type {string}
 */
thin.editor.ListHelper.FILL_ = '#AAAAAA';


/**
 * @type {number}
 */
thin.editor.ListHelper.FILLOPACITY_ = 0.08;


/**
 * @type {thin.editor.ListShape}
 * @private
 */
thin.editor.ListHelper.prototype.target_;


/**
 * @type {thin.editor.ListGuideHelper}
 * @private
 */
thin.editor.ListHelper.prototype.listGuideHelper_;


/**
 * @type {thin.editor.Layer}
 * @private
 */
thin.editor.ListHelper.prototype.blankRangeSelectorLayer_;


/**
 * @type {thin.editor.Layer}
 * @private
 */
thin.editor.ListHelper.prototype.blankRangeDrawLayer_;


/**
 * @type {Object}
 * @private
 */
thin.editor.ListHelper.prototype.band_;


/**
 * @type {boolean}
 * @private
 */
thin.editor.ListHelper.prototype.actived_ = true;


/**
 * @type {boolean}
 * @private
 */
thin.editor.ListHelper.prototype.activedForListShapeProperty_ = false;


/**
 * @type {thin.editor.ListShape}
 * @private
 */
thin.editor.ListHelper.prototype.changingPageSetshape_;


/**
 * @type {string}
 * @private
 */
thin.editor.ListHelper.prototype.activeColumnName_;


thin.editor.ListHelper.prototype.reapplySizeAndStroke = function() {
  this.forEachColumnBand(function(columnBandForScope, columnNameForScope) {
    columnBandForScope.getDraggableLine().reapplySizeAndStroke();
  });
};


/**
 * @param {goog.graphics.Element} shape
 */
thin.editor.ListHelper.prototype.setActiveShape = function(shape) {
  this.target_.getActiveShape().add(shape);
};


/**
 * @return {thin.editor.ActiveShapeManager}
 */
thin.editor.ListHelper.prototype.getActiveShape = function() {
  return this.target_.getActiveShape();
};


/**
 * @return {boolean}
 */
thin.editor.ListHelper.prototype.isActived = function() {
  return this.actived_;
};


/**
 * @return {thin.editor.ListShape}
 */
thin.editor.ListHelper.prototype.getTarget = function() {
  return this.target_;
};


/**
 * @param {thin.editor.Layer} drawLayer
 * @return {string|undefined}
 */
thin.editor.ListHelper.prototype.getColumnNameByDrawLayer = function(drawLayer) {
  return goog.object.findKey(this.band_, function(columnBand, columnName) {
    return columnBand.getDrawLayer() == drawLayer;
  }, this);
};


/**
 * @param {thin.editor.Layer} selectorLayer
 * @return {string|undefined}
 */
thin.editor.ListHelper.prototype.getColumnNameBySelectorLayer = function(selectorLayer) {
  return goog.object.findKey(this.band_, function(columnBand, columnName) {
    return columnBand.getSelectorLayer() == selectorLayer;
  }, this);
};


/**
 * @param {string} columnName
 * @return {thin.editor.ListBandHelper}
 */
thin.editor.ListHelper.prototype.getColumnBand = function(columnName) {
  return this.band_[columnName];
};


/**
 * @param {goog.graphics.Element} shape
 * @return {boolean}
 */
thin.editor.ListHelper.prototype.isEnableChangingPage = function(shape) {
  var changingPageSethape = this.changingPageSetshape_;
  return goog.isDef(changingPageSethape) ? shape == changingPageSethape : true;
};


/**
 * @return {thin.editor.Layer}
 */
thin.editor.ListHelper.prototype.getBlankRangeSelectorLayer = function() {
  return this.blankRangeSelectorLayer_;
};


/**
 * @return {thin.editor.Layer}
 */
thin.editor.ListHelper.prototype.getBlankRangeDrawLayer = function() {
  return this.blankRangeDrawLayer_;
};


/**
 * @return {goog.math.Rect}
 */
thin.editor.ListHelper.prototype.getBlankRangeBounds = function() {
  var listShape = this.target_;
  var listShapeBounds = listShape.getBounds();
  var footerColumnName = thin.editor.ListHelper.ColumnName.FOOTER;
  var columnShapeForScope = listShape.getColumnShape(footerColumnName);
  var draggableLineHeight = this.getColumnBand(footerColumnName).getDraggableLine().getHeight();
  var listShapeBottom = listShapeBounds.toBox().bottom;
  var blankRangeHeight = (listShapeBottom - columnShapeForScope.getBounds().toBox().bottom) - draggableLineHeight;
  if(blankRangeHeight < 0) {
    blankRangeHeight = 0;
  }
  return new goog.math.Rect(listShapeBounds.left,
           listShapeBottom - blankRangeHeight, listShapeBounds.width, blankRangeHeight);
};


/**
 * @param {thin.editor.ListShape} shape
 */
thin.editor.ListHelper.prototype.setChangingPageSetShape = function(shape) {
  this.changingPageSetshape_ = shape;
};


thin.editor.ListHelper.prototype.clearChangingPageSetShape = function() {
  delete this.changingPageSetshape_;
};


/**
 * @return {thin.editor.ListGuideHelper}
 */
thin.editor.ListHelper.prototype.getListGuideHelper = function() {
  return this.listGuideHelper_;
};


thin.editor.ListHelper.prototype.initActiveColumnName = function() {
  delete this.activeColumnName_;
};


/**
 * @param {string} columnName
 */
thin.editor.ListHelper.prototype.setActiveColumnName = function(columnName) {
  if(columnName) {
    this.activeColumnName_ = columnName;    
  } else {
    this.initActiveColumnName();
  }
};


/**
 * @return {string}
 */
thin.editor.ListHelper.prototype.getActiveColumnName = function() {
  return this.activeColumnName_;
};


/**
 * @return {string}
 */
thin.editor.ListHelper.prototype.getDefaultActiveColumnName = function() {
  return thin.editor.ListHelper.ColumnName.HEADER;
};


/**
 * @param {goog.math.Coordinate} translate
 */
thin.editor.ListHelper.prototype.setTransLate = function(translate) {
  this.target_.forEachColumnShape(function(columnShapeForEach, columnNameForEach) {
    columnShapeForEach.setTransLate(translate);
  }, this);
};


/**
 * @param {goog.math.Coordinate} translate
 * @param {thin.editor.ListColumnShape} startColumnShape
 */
thin.editor.ListHelper.prototype.setTransLateOfNextColumnShapes = function(translate, startColumnShape) {
  goog.array.forEach(startColumnShape.getNextColumnShapesForArray(), function(columnShapeForEach) {
    columnShapeForEach.setTransLate(translate);
  });
};


/**
 * @param {Function} fn
 * @param {Object=} opt_selfObj
 */
thin.editor.ListHelper.prototype.forEachColumnBand = function(fn, opt_selfObj) {
  var selfObj = opt_selfObj || this;
  goog.object.forEach(this.band_, goog.bind(function(columnBandForEach, columnNameForEach) {
    fn.call(selfObj, columnBandForEach, columnNameForEach);
  }, selfObj));
};


thin.editor.ListHelper.prototype.update = function() {
  var target = this.target_;
  var guide = this.getListGuideHelper();
  var columnBounds = this.calculateColumnBoundsForUpdate(target);
  this.forEachColumnBand(function(columnBandForEach, columnNameForEach) {
    columnBandForEach.update(target, columnBounds[columnNameForEach]);
  }, this);
  guide.setBounds(target.getBounds().clone());
  guide.adjustToTargetShapeBounds();
  var blankRangeBounds = this.getBlankRangeBounds();
  this.getBlankRangeSelectorLayer().setBounds(blankRangeBounds.clone());
  this.getBlankRangeDrawLayer().setBounds(blankRangeBounds.clone());
};


/**
 * @param {thin.editor.ListShape} target
 */
thin.editor.ListHelper.prototype.active = function(target) {

  var layout = this.getLayout();
  this.target_ = target;
  layout.getHelpers().getListOutline().setTargetShape(target);
  this.getActiveShape().clear();
  this.update();
  target.getIdShape().setVisibled(false);
  var isDrawLayerVisibled = layout.getWorkspace().getUiStatusForAction() != 'selector';
  this.forEachColumnBand(function(columnBand, columnName) {
    columnBand.active(target, isDrawLayerVisibled);
  }, this);
  var blankRangeSelectorLayer = this.getBlankRangeSelectorLayer();
  goog.dom.insertSiblingBefore(blankRangeSelectorLayer.getElement(),
    this.getColumnBand(thin.editor.ListHelper.ColumnName.HEADER).getSelectorLayer().getElement());
  blankRangeSelectorLayer.setVisibled(true);
  this.getBlankRangeDrawLayer().setVisibled(isDrawLayerVisibled);
  this.getListGuideHelper().setEnableAndTargetShape(target);
  target.getListFace().setVisibled(false);
  this.initActiveColumnName();
  this.actived_ = false;
};


thin.editor.ListHelper.prototype.inactive = function() {
  if (!this.isActived()) {
    this.forEachColumnBand(function(columnBand, columnName) {
      columnBand.inactive(target);
    }, this);
    var blankRangeSelectorLayer = this.getBlankRangeSelectorLayer();
    this.getLayout().appendChild(blankRangeSelectorLayer, this);
    blankRangeSelectorLayer.setVisibled(false);
    this.getBlankRangeDrawLayer().setVisibled(false);
    this.getListGuideHelper().setDisable();
    var target = this.target_;
    target.getListFace().setVisibled(true);
    target.getIdShape().setVisibled(true);
    this.actived_ = true;
  }
};


thin.editor.ListHelper.prototype.setup = function() {
  var layout = this.getLayout();
  var columnName = thin.editor.ListHelper.ColumnName;

  this.band_ = {};
  this.band_[columnName.HEADER] = new thin.editor.HeaderBandHelper(layout, columnName.HEADER);
  this.band_[columnName.DETAIL] = new thin.editor.DetailBandHelper(layout, columnName.DETAIL);
  this.band_[columnName.PAGEFOOTER] = new thin.editor.PageFooterBandHelper(layout, columnName.PAGEFOOTER);
  this.band_[columnName.FOOTER] = new thin.editor.FooterBandHelper(layout, columnName.FOOTER);
  this.listGuideHelper_ = new thin.editor.ListGuideHelper(layout);
  var blankRangeSelecotorLayer = new thin.editor.Layer(layout);
  blankRangeSelecotorLayer.setBounds(new goog.math.Rect(0, 0, 0, 0));
  blankRangeSelecotorLayer.setFill(new goog.graphics.SolidFill(thin.editor.ListHelper.FILL_, thin.editor.ListHelper.FILLOPACITY_));
  this.blankRangeSelectorLayer_ = blankRangeSelecotorLayer;
  var blankRangeDrawLayer = new thin.editor.Layer(layout);
  blankRangeDrawLayer.setBounds(new goog.math.Rect(0, 0, 0, 0));
  this.blankRangeDrawLayer_ = blankRangeDrawLayer;
};


thin.editor.ListHelper.prototype.init = function() {
  var scope = this;
  var layout = this.getLayout();
  var helpers = layout.getHelpers();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var guide = helpers.getGuideHelper();
  this.forEachColumnBand(function(columnBand) {
    columnBand.init();
  }, this);
  this.reapplySizeAndStroke();
  var blankRangeMouseDownListener = goog.bind(function(e) {
    e.preventDefault();
    layout.getWorkspace().focusElement(e);
    
    var listShape = this.target_;
    var activeShapeManagerByListShape = this.getActiveShape();
    var shapes = activeShapeManagerByListShape.getClone();
    var isEmpty = activeShapeManagerByListShape.isEmpty();
    var singleShapeByListShape = activeShapeManagerByListShape.getIfSingle();
    var captureActiveColumnName = this.getActiveColumnName();
    var captureProperties = multipleShapesHelper.getCloneProperties();
    if (!captureActiveColumnName) {
      // Skip unselected shapes
      return;
    }

    layout.getWorkspace().normalVersioning(function(version) {
    
      version.upHandler(function() {
        guide.setDisable();
        helpers.disableAll();
        activeShapeManagerByListShape.clear();
        this.initActiveColumnName();
        listShape.updateProperties();
        thin.ui.setEnabledForFontUi(false);
      }, scope);
      
      version.downHandler(function() {
      
        activeShapeManagerByListShape.set(shapes);
        this.setActiveColumnName(captureActiveColumnName);
        
        if (activeShapeManagerByListShape.isEmpty()) {
          listShape.updateProperties();
          thin.ui.setEnabledForFontUi(false);
        } else {
          if (singleShapeByListShape) {
            singleShapeByListShape.updateProperties();
            singleShapeByListShape.adjustToUiStatusForAvailableShape();
            guide.setEnableAndTargetShape(singleShapeByListShape);
          } else {
            layout.setOutlineForMultiple(shapes);
            layout.calculateGuideBounds(shapes);
            guide.setEnableAndTargetShape(helpers.getMultiOutlineHelper());
            multipleShapesHelper.setCloneProperties(captureProperties);
            multipleShapesHelper.updateProperties();
            thin.ui.setEnabledForFontUi(true);
          }
        }
      }, scope);
    });
  }, this);
  
  var blankRangeSelectorLayer = this.getBlankRangeSelectorLayer();
  goog.events.listen(blankRangeSelectorLayer, goog.events.EventType.MOUSEDOWN, blankRangeMouseDownListener, false, this);
  var blankRangeDrawLayer = this.getBlankRangeDrawLayer();
  goog.events.listen(blankRangeDrawLayer, goog.events.EventType.MOUSEDOWN, blankRangeMouseDownListener);

  layout.appendChild(blankRangeSelectorLayer, this);
  layout.appendChild(blankRangeDrawLayer, this);
  var listGuide = this.getListGuideHelper();
  listGuide.init();
  layout.appendChild(listGuide, this);
};


/**
 * @param {thin.editor.ListShape} listShape
 * @return {Object}
 */
thin.editor.ListHelper.prototype.calculateColumnBoundsForUpdate = function(listShape) {

  var listShapeBounds = listShape.getBounds();
  var listShapeLeft = listShapeBounds.left;
  var listShapeWidth = listShapeBounds.width;
  var listShapeHeight = listShapeBounds.height;
  
  var columnBounds = {};
  var columnNameForHeader = thin.editor.ListHelper.ColumnName.HEADER;
  var columnShapeForHeader = listShape.getColumnShape(columnNameForHeader);
  var columnHeightForHeader = columnShapeForHeader.getHeightForColumn();
  if(!goog.isNumber(columnHeightForHeader)) {
    columnHeightForHeader = columnShapeForHeader.getHeightForDefault();
  }
  columnBounds[columnNameForHeader] = new goog.math.Rect(
      listShapeLeft, listShapeBounds.top, 
      listShapeWidth, columnHeightForHeader);
  
  var columnNamaForNext;
  var previousColumnBounds;
  var columnHeightForScope;
  goog.array.forEach(columnShapeForHeader.getNextColumnShapesForArray(),
    function(columnShapeForNext) {
      columnNamaForNext = columnShapeForNext.getColumnName();
      previousColumnBounds = columnBounds[columnShapeForNext.getPreviousColumnShape().getColumnName()];
      columnHeightForScope = columnShapeForNext.getHeightForColumn();
      if(!goog.isNumber(columnHeightForScope)) {
        columnHeightForScope = columnShapeForNext.getHeightForDefault();
      }
      columnBounds[columnNamaForNext] = new goog.math.Rect(
          listShapeLeft, previousColumnBounds.toBox().bottom,
          listShapeWidth, columnHeightForScope);
    });
  return columnBounds;
};


/** @inheritDoc */
thin.editor.ListHelper.prototype.disposeInternal = function() {
  this.listGuideHelper_.dispose();
  this.blankRangeSelectorLayer_.dispose();
  this.blankRangeDrawLayer_.dispose();
  this.forEachColumnBand(function(columnBandForScope) {
    columnBandForScope.dispose();
  });
  delete this.blankRangeDrawLayer_;
  delete this.blankRangeSelectorLayer_;
  delete this.target_;
  delete this.listGuideHelper_;
  delete this.band_;
  delete this.changingPageSetshape_;
};