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

goog.provide('thin.core.ListHelper');
goog.provide('thin.core.ListHelper.SectionName');

goog.require('goog.dom');
goog.require('goog.object');
goog.require('goog.math.Rect');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('thin.core.ActionLayer');
goog.require('thin.core.Component');
goog.require('thin.core.HeaderSectionHelper');
goog.require('thin.core.DetailSectionHelper');
goog.require('thin.core.PageFooterSectionHelper');
goog.require('thin.core.FooterSectionHelper');
goog.require('thin.core.ListGuideHelper');


/**
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {thin.core.Component}
 */
thin.core.ListHelper = function(layout) {
  thin.core.Component.call(this, layout);
};
goog.inherits(thin.core.ListHelper, thin.core.Component);


/**
 * @enum {string}
 */
thin.core.ListHelper.SectionName = {
  HEADER: 'HEADER',
  DETAIL: 'DETAIL', 
  PAGEFOOTER: 'PAGEFOOTER',
  FOOTER: 'FOOTER'
};


/**
 * @type {string}
 */
thin.core.ListHelper.FILL_ = '#AAAAAA';


/**
 * @type {number}
 */
thin.core.ListHelper.FILLOPACITY_ = 0.08;


/**
 * @type {thin.core.ListShape}
 * @private
 */
thin.core.ListHelper.prototype.target_;


/**
 * @type {thin.core.ListGuideHelper}
 * @private
 */
thin.core.ListHelper.prototype.listGuideHelper_;


/**
 * @type {thin.core.Layer}
 * @private
 */
thin.core.ListHelper.prototype.blankRangeSelectorLayer_;


/**
 * @type {thin.core.Layer}
 * @private
 */
thin.core.ListHelper.prototype.blankRangeDrawLayer_;


/**
 * @type {Object}
 * @private
 */
thin.core.ListHelper.prototype.sectionHelpers_;


/**
 * @type {boolean}
 * @private
 */
thin.core.ListHelper.prototype.active_ = false;


/**
 * @type {thin.core.ListShape}
 * @private
 */
thin.core.ListHelper.prototype.changingPageSetshape_;


/**
 * @type {string}
 * @private
 */
thin.core.ListHelper.prototype.activeSectionName_;


thin.core.ListHelper.prototype.reapplySizeAndStroke = function() {
  this.forEachSectionHelper(function(sectionHelperForScope, sectionNameForScope) {
    sectionHelperForScope.getSeparator().reapplySizeAndStroke();
  });
};


/**
 * @param {goog.graphics.Element} shape
 */
thin.core.ListHelper.prototype.setActiveShape = function(shape) {
  this.target_.getActiveShape().add(shape);
};


/**
 * @return {thin.core.ActiveShapeManager}
 */
thin.core.ListHelper.prototype.getActiveShape = function() {
  return this.target_.getActiveShape();
};


/**
 * @return {boolean}
 */
thin.core.ListHelper.prototype.isActive = function() {
  return this.active_;
};


/**
 * @return {thin.core.ListShape}
 */
thin.core.ListHelper.prototype.getTarget = function() {
  return this.target_;
};


/**
 * @param {thin.core.Layer} drawLayer
 * @return {string|undefined}
 */
thin.core.ListHelper.prototype.getSectionNameByDrawLayer = function(drawLayer) {
  return goog.object.findKey(this.sectionHelpers_, function(sectionHelper, sectionName) {
    return sectionHelper.getDrawLayer() == drawLayer;
  }, this);
};


/**
 * @param {thin.core.Layer} selectorLayer
 * @return {string|undefined}
 */
thin.core.ListHelper.prototype.getSectionNameBySelectorLayer = function(selectorLayer) {
  return goog.object.findKey(this.sectionHelpers_, function(sectionHelper, sectionName) {
    return sectionHelper.getSelectorLayer() == selectorLayer;
  }, this);
};


/**
 * @param {string} sectionName
 * @return {thin.core.ListSectionHelper}
 */
thin.core.ListHelper.prototype.getSectionHelper = function(sectionName) {
  return this.sectionHelpers_[sectionName];
};


/**
 * @param {goog.graphics.Element} shape
 * @return {boolean}
 */
thin.core.ListHelper.prototype.isEnableChangingPage = function(shape) {
  var changingPageSethape = this.changingPageSetshape_;
  return goog.isDef(changingPageSethape) ? shape == changingPageSethape : true;
};


/**
 * @return {thin.core.Layer}
 */
thin.core.ListHelper.prototype.getBlankRangeSelectorLayer = function() {
  return this.blankRangeSelectorLayer_;
};


/**
 * @return {thin.core.Layer}
 */
thin.core.ListHelper.prototype.getBlankRangeDrawLayer = function() {
  return this.blankRangeDrawLayer_;
};


/**
 * @return {goog.math.Rect}
 */
thin.core.ListHelper.prototype.getBlankRangeBounds = function() {
  var listShape = this.target_;
  var listShapeBounds = listShape.getBounds();
  var footerSectionName = thin.core.ListHelper.SectionName.FOOTER;
  var sectionShapeForScope = listShape.getSectionShape(footerSectionName);
  var draggableLineHeight = this.getSectionHelper(footerSectionName).getSeparator().getLineHeight();
  var listShapeBottom = listShapeBounds.toBox().bottom;
  var blankRangeHeight = (listShapeBottom - sectionShapeForScope.getBounds().toBox().bottom) - draggableLineHeight;
  if(blankRangeHeight < 0) {
    blankRangeHeight = 0;
  }
  return new goog.math.Rect(listShapeBounds.left,
           listShapeBottom - blankRangeHeight, listShapeBounds.width, blankRangeHeight);
};


/**
 * @param {thin.core.ListShape} shape
 */
thin.core.ListHelper.prototype.setChangingPageSetShape = function(shape) {
  this.changingPageSetshape_ = shape;
};


thin.core.ListHelper.prototype.clearChangingPageSetShape = function() {
  delete this.changingPageSetshape_;
};


/**
 * @return {thin.core.ListGuideHelper}
 */
thin.core.ListHelper.prototype.getListGuideHelper = function() {
  return this.listGuideHelper_;
};


thin.core.ListHelper.prototype.initActiveSectionName = function() {
  delete this.activeSectionName_;
};


/**
 * @param {string} sectionName
 */
thin.core.ListHelper.prototype.setActiveSectionName = function(sectionName) {
  if(sectionName) {
    this.activeSectionName_ = sectionName;    
  } else {
    this.initActiveSectionName();
  }
};


/**
 * @return {string}
 */
thin.core.ListHelper.prototype.getActiveSectionName = function() {
  return this.activeSectionName_;
};


/**
 * @return {string}
 */
thin.core.ListHelper.prototype.getDefaultActiveSectionName = function() {
  return thin.core.ListHelper.SectionName.HEADER;
};


/**
 * @param {goog.math.Coordinate} translate
 */
thin.core.ListHelper.prototype.setTransLate = function(translate) {
  this.target_.forEachSectionShape(function(sectionShapeForEach, sectionNameForEach) {
    sectionShapeForEach.setTransLate(translate);
  }, this);
};


/**
 * Prohibit the drawing new List into the List.
 * @param {boolean} drawable
 */
thin.core.ListHelper.prototype.setDrawable = function(drawable) {
  this.forEachSectionHelper(function(helper, name) {
    helper.getDrawLayer().setDrawable(drawable);
  });
};


/**
 * @param {goog.math.Coordinate} translate
 * @param {thin.core.ListSectionShape} startSectionShape
 */
thin.core.ListHelper.prototype.setTransLateOfNextSectionShapes = function(translate, startSectionShape) {
  goog.array.forEach(startSectionShape.getNextSectionShapes(), function(sectionShapeForEach) {
    sectionShapeForEach.setTransLate(translate);
  });
};


/**
 * @param {Function} fn
 * @param {Object=} opt_selfObj
 */
thin.core.ListHelper.prototype.forEachSectionHelper = function(fn, opt_selfObj) {
  var selfObj = opt_selfObj || this;
  goog.object.forEach(this.sectionHelpers_, goog.bind(function(sectionHelperForEach, sectionNameForEach) {
    fn.call(selfObj, sectionHelperForEach, sectionNameForEach);
  }, selfObj));
};


thin.core.ListHelper.prototype.update = function() {
  var target = this.target_;
  var guide = this.getListGuideHelper();
  var sectionBounds = this.calculateSectionBoundsForUpdate(target);
  this.forEachSectionHelper(function(sectionHelperForEach, sectionNameForEach) {
    sectionHelperForEach.update(target, sectionBounds[sectionNameForEach]);
  }, this);
  guide.setBounds(target.getBounds().clone());
  guide.adjustToTargetShapeBounds();
  var blankRangeBounds = this.getBlankRangeBounds();
  this.getBlankRangeSelectorLayer().setBounds(blankRangeBounds.clone());
  this.getBlankRangeDrawLayer().setBounds(blankRangeBounds.clone());
};


/**
 * @param {thin.core.ListShape} target
 */
thin.core.ListHelper.prototype.active = function(target) {
  var layout = this.getLayout();
  
  this.target_ = target;
  layout.getHelpers().getListOutline().setTargetShape(target);
  this.getActiveShape().clear();
  this.update();
  target.getIdShape().setVisibled(false);
  
  var isDrawLayerVisibled = layout.getWorkspace().getUiStatusForAction() != 'selector';
  
  this.forEachSectionHelper(function(sectionHelper, sectionName) {
    sectionHelper.active(target, isDrawLayerVisibled);
  }, this);
  var blankRangeSelectorLayer = this.getBlankRangeSelectorLayer();
  
  goog.dom.insertSiblingBefore(blankRangeSelectorLayer.getElement(),
    this.getSectionHelper(thin.core.ListHelper.SectionName.HEADER).getSelectorLayer().getElement());
  blankRangeSelectorLayer.setVisibled(true);
  this.getBlankRangeDrawLayer().setVisibled(isDrawLayerVisibled);
  this.getListGuideHelper().setEnableAndTargetShape(target);
  target.getListFace().setVisibled(false);
  this.initActiveSectionName();
  
  this.active_ = true;
};


thin.core.ListHelper.prototype.inactive = function() {
  if (this.isActive()) {
    this.forEachSectionHelper(function(sectionHelper, sectionName) {
      sectionHelper.inactive(target);
    }, this);
    
    var blankRangeSelectorLayer = this.getBlankRangeSelectorLayer();
    
    this.getLayout().appendChild(blankRangeSelectorLayer, this);
    blankRangeSelectorLayer.setVisibled(false);
    this.getBlankRangeDrawLayer().setVisibled(false);
    this.getListGuideHelper().setDisable();
    
    var target = this.target_;
    
    target.getListFace().setVisibled(true);
    target.getIdShape().setVisibled(true);
    
    this.active_ = false;
  }
};


thin.core.ListHelper.prototype.setup = function() {
  var layout = this.getLayout();
  var sectionName = thin.core.ListHelper.SectionName;

  this.sectionHelpers_ = {};
  this.sectionHelpers_[sectionName.HEADER] = new thin.core.HeaderSectionHelper(layout, sectionName.HEADER);
  this.sectionHelpers_[sectionName.DETAIL] = new thin.core.DetailSectionHelper(layout, sectionName.DETAIL);
  this.sectionHelpers_[sectionName.PAGEFOOTER] = new thin.core.PageFooterSectionHelper(layout, sectionName.PAGEFOOTER);
  this.sectionHelpers_[sectionName.FOOTER] = new thin.core.FooterSectionHelper(layout, sectionName.FOOTER);
  this.listGuideHelper_ = new thin.core.ListGuideHelper(layout);
  var blankRangeSelecotorLayer = new thin.core.ActionLayer(layout);
  blankRangeSelecotorLayer.setBounds(new goog.math.Rect(0, 0, 0, 0));
  blankRangeSelecotorLayer.setFill(new goog.graphics.SolidFill(thin.core.ListHelper.FILL_, thin.core.ListHelper.FILLOPACITY_));
  this.blankRangeSelectorLayer_ = blankRangeSelecotorLayer;
  var blankRangeDrawLayer = new thin.core.ActionLayer(layout);
  blankRangeDrawLayer.setBounds(new goog.math.Rect(0, 0, 0, 0));
  this.blankRangeDrawLayer_ = blankRangeDrawLayer;
};


thin.core.ListHelper.prototype.init = function() {
  var scope = this;
  var layout = this.getLayout();
  var helpers = layout.getHelpers();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var guide = helpers.getGuideHelper();
  
  var listGuide = this.getListGuideHelper();
  listGuide.init();
  layout.appendChild(listGuide, this);
  
  this.forEachSectionHelper(function(sectionHelper) {
    sectionHelper.init();
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
    var captureActiveSectionName = this.getActiveSectionName();
    var captureProperties = multipleShapesHelper.getCloneProperties();
    if (!captureActiveSectionName) {
      // Skip unselected shapes
      return;
    }

    layout.getWorkspace().normalVersioning(function(version) {
    
      version.upHandler(function() {
        guide.setDisable();
        helpers.disableAll();
        activeShapeManagerByListShape.clear();
        this.initActiveSectionName();
        listShape.updateProperties();
        thin.ui.setEnabledForFontUi(false);
      }, scope);
      
      version.downHandler(function() {
      
        activeShapeManagerByListShape.set(shapes);
        this.setActiveSectionName(captureActiveSectionName);
        
        if (activeShapeManagerByListShape.isEmpty()) {
          listShape.updateProperties();
          thin.ui.setEnabledForFontUi(false);
        } else {
          if (singleShapeByListShape) {
            singleShapeByListShape.updateProperties();
            singleShapeByListShape.updateToolbarUI();
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
};


/**
 * @param {thin.core.ListShape} listShape
 * @return {Object}
 */
thin.core.ListHelper.prototype.calculateSectionBoundsForUpdate = function(listShape) {

  var listShapeBounds = listShape.getBounds();
  var listShapeLeft = listShapeBounds.left;
  var listShapeWidth = listShapeBounds.width;
  var listShapeHeight = listShapeBounds.height;
  
  var sectionBounds = {};
  var sectionNameForHeader = thin.core.ListHelper.SectionName.HEADER;
  var sectionShapeForHeader = listShape.getSectionShape(sectionNameForHeader);
  var sectionHeightForHeader = sectionShapeForHeader.getHeight();
  if(!goog.isNumber(sectionHeightForHeader)) {
    sectionHeightForHeader = sectionShapeForHeader.getDefaultHeight();
  }
  sectionBounds[sectionNameForHeader] = new goog.math.Rect(
      listShapeLeft, listShapeBounds.top, 
      listShapeWidth, sectionHeightForHeader);
  
  var sectionNamaForNext;
  var previousSectionBounds;
  var sectionHeightForScope;
  goog.array.forEach(sectionShapeForHeader.getNextSectionShapes(),
    function(sectionShapeForNext) {
      sectionNamaForNext = sectionShapeForNext.getSectionName();
      previousSectionBounds = sectionBounds[sectionShapeForNext.getPreviousSectionShape().getSectionName()];
      sectionHeightForScope = sectionShapeForNext.getHeight();
      if(!goog.isNumber(sectionHeightForScope)) {
        sectionHeightForScope = sectionShapeForNext.getDefaultHeight();
      }
      sectionBounds[sectionNamaForNext] = new goog.math.Rect(
          listShapeLeft, previousSectionBounds.toBox().bottom,
          listShapeWidth, sectionHeightForScope);
    });
  return sectionBounds;
};


/** @inheritDoc */
thin.core.ListHelper.prototype.disposeInternal = function() {
  this.listGuideHelper_.dispose();
  this.blankRangeSelectorLayer_.dispose();
  this.blankRangeDrawLayer_.dispose();
  this.forEachSectionHelper(function(sectionHelperForScope) {
    sectionHelperForScope.dispose();
  });
  delete this.blankRangeDrawLayer_;
  delete this.blankRangeSelectorLayer_;
  delete this.target_;
  delete this.listGuideHelper_;
  delete this.sectionHelpers_;
  delete this.changingPageSetshape_;
};
