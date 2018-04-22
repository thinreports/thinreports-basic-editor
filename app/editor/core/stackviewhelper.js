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

goog.provide('thin.core.StackViewHelper');
goog.provide('thin.core.StackViewHelper.SectionName');

goog.require('goog.dom');
goog.require('goog.object');
goog.require('goog.math.Rect');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('thin.core.ActionLayer');
goog.require('thin.core.Component');
goog.require('thin.core.StackViewRowHelper');
goog.require('thin.core.StackViewGuideHelper');


/**
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {thin.core.Component}
 */
thin.core.StackViewHelper = function(layout) {
  thin.core.Component.call(this, layout);
};
goog.inherits(thin.core.StackViewHelper, thin.core.Component);


/**
 * @enum {string}
 */
thin.core.StackViewHelper.SectionName = {
  HEADER: 'HEADER',
  DETAIL: 'DETAIL',
  PAGEFOOTER: 'PAGEFOOTER',
  FOOTER: 'FOOTER'
};


/**
 * @type {string}
 */
thin.core.StackViewHelper.FILL_ = '#AAAAAA';


/**
 * @type {number}
 */
thin.core.StackViewHelper.FILLOPACITY_ = 0.08;


/**
 * @type {thin.core.StackViewShape}
 * @private
 */
thin.core.StackViewHelper.prototype.target_;


/**
 * @type {thin.core.StackViewGuideHelper}
 * @private
 */
thin.core.StackViewHelper.prototype.listGuideHelper_;


/**
 * @type {thin.core.Layer}
 * @private
 */
thin.core.StackViewHelper.prototype.blankRangeSelectorLayer_;


/**
 * @type {thin.core.Layer}
 * @private
 */
thin.core.StackViewHelper.prototype.blankRangeDrawLayer_;


/**
 * @type {Object}
 * @private
 */
thin.core.StackViewHelper.prototype.sectionHelpers_;


/**
 * @type {boolean}
 * @private
 */
thin.core.StackViewHelper.prototype.active_ = false;


/**
 * @type {thin.core.StackViewShape}
 * @private
 */
thin.core.StackViewHelper.prototype.changingPageSetshape_;


/**
 * @type {string}
 * @private
 */
thin.core.StackViewHelper.prototype.activeSectionName_;

/**
 * @param {goog.graphics.Element} shape
 */
thin.core.StackViewHelper.prototype.setActiveShape = function(shape) {
  this.target_.getActiveShape().add(shape);
};


/**
 * @return {thin.core.ActiveShapeManager}
 */
thin.core.StackViewHelper.prototype.getActiveShape = function() {
  return this.target_.getActiveShape();
};


/**
 * @return {boolean}
 */
thin.core.StackViewHelper.prototype.isActive = function() {
  return this.active_;
};


/**
 * @return {thin.core.StackViewShape}
 */
thin.core.StackViewHelper.prototype.getTarget = function() {
  return this.target_;
};


/**
 * @param {thin.core.Layer} drawLayer
 * @return {string|undefined}
 */
thin.core.StackViewHelper.prototype.getSectionNameByDrawLayer = function(drawLayer) {
  return goog.object.findKey(this.sectionHelpers_, function(sectionHelper, sectionName) {
    return sectionHelper.getDrawLayer() == drawLayer;
  }, this);
};


/**
 * @param {thin.core.Layer} selectorLayer
 * @return {string|undefined}
 */
thin.core.StackViewHelper.prototype.getSectionNameBySelectorLayer = function(selectorLayer) {
  return goog.object.findKey(this.sectionHelpers_, function(sectionHelper, sectionName) {
    return sectionHelper.getSelectorLayer() == selectorLayer;
  }, this);
};


/**
 * @param {string} sectionName
 * @return {thin.core.StackViewSectionHelper}
 */
thin.core.StackViewHelper.prototype.getSectionHelper = function(sectionName) {
  return this.sectionHelpers_[sectionName];
};


/**
 * @param {goog.graphics.Element} shape
 * @return {boolean}
 */
thin.core.StackViewHelper.prototype.isEnableChangingPage = function(shape) {
  var changingPageSethape = this.changingPageSetshape_;
  return goog.isDef(changingPageSethape) ? shape == changingPageSethape : true;
};


/**
 * @return {thin.core.Layer}
 */
thin.core.StackViewHelper.prototype.getBlankRangeSelectorLayer = function() {
  return this.blankRangeSelectorLayer_;
};


/**
 * @return {thin.core.Layer}
 */
thin.core.StackViewHelper.prototype.getBlankRangeDrawLayer = function() {
  return this.blankRangeDrawLayer_;
};


/**
 * @return {goog.math.Rect}
 */
thin.core.StackViewHelper.prototype.getBlankRangeBounds = function() {
  var listShape = this.target_;
  var listShapeBounds = listShape.getBounds();
  var footerSectionName = thin.core.StackViewHelper.SectionName.HEADER;
  var lastRow = goog.array.peek(listShape.rows_);
  var draggableLineHeight = lastRow.helper_.getSeparator().getLineHeight();
  // var draggableLineHeight = this.getSectionHelper(footerSectionName).getSeparator().getLineHeight();
  var listShapeBottom = listShapeBounds.toBox().bottom;
  var blankRangeHeight = (listShapeBottom - lastRow.getBounds().toBox().bottom) - draggableLineHeight;
  if(blankRangeHeight < 0) {
    blankRangeHeight = 0;
  }
  return new goog.math.Rect(listShapeBounds.left,
           listShapeBottom - blankRangeHeight, listShapeBounds.width, blankRangeHeight);
};


/**
 * @param {thin.core.StackViewShape} shape
 */
thin.core.StackViewHelper.prototype.setChangingPageSetShape = function(shape) {
  this.changingPageSetshape_ = shape;
};


thin.core.StackViewHelper.prototype.clearChangingPageSetShape = function() {
  delete this.changingPageSetshape_;
};


/**
 * @return {thin.core.StackViewGuideHelper}
 */
thin.core.StackViewHelper.prototype.getListGuideHelper = function() {
  return this.listGuideHelper_;
};


thin.core.StackViewHelper.prototype.initActiveSectionName = function() {
  delete this.activeSectionName_;
};


/**
 * @param {string} sectionName
 */
thin.core.StackViewHelper.prototype.setActiveSectionName = function(sectionName) {
  if(sectionName) {
    this.activeSectionName_ = sectionName;
  } else {
    this.initActiveSectionName();
  }
};


// FIXME: StackViewHelperがStackViewShapeと1:1にするなら単純に activeRow を set/get すれば良いが
// 現状では StackViewHelper は layout に紐づいており、StackViewShape で共有しているためそれができない。
thin.core.StackViewHelper.prototype.setActiveRow = function (row) {
  // this.activeRow_ = row;
};


/**
 * @return {thin.core.StackViewRowShape?}
 */
thin.core.StackViewHelper.prototype.getActiveRow = function () {
  // FIXME: See #setActiveRow
  // return this.activeRow_;
 return goog.array.find(this.target_.rows_, function (row) {
    return row.helper_.isActive();
  });
}


/**
 * @return {string}
 */
thin.core.StackViewHelper.prototype.getActiveSectionName = function() {
  return this.activeSectionName_;
};


/**
 * @return {string}
 */
thin.core.StackViewHelper.prototype.getDefaultActiveSectionName = function() {
  return thin.core.StackViewHelper.SectionName.HEADER;
};


/**
 * @param {goog.math.Coordinate} translate
 */
thin.core.StackViewHelper.prototype.setTransLate = function(translate) {
  this.target_.forEachSectionShape(function(sectionShapeForEach, sectionNameForEach) {
    sectionShapeForEach.setTransLate(translate);
  }, this);
};


/**
 * Prohibit the drawing new StackView into the StackView.
 * @param {boolean} drawable
 */
thin.core.StackViewHelper.prototype.setDrawable = function(drawable) {
  goog.array.forEach(this.target_.rows_, function (row) {
    row.helper_.getDrawLayer().setDrawable(drawable);
  });
};


/**
 * @param {goog.math.Coordinate} translate
 * @param {thin.core.StackViewSectionShape} startSectionShape
 */
thin.core.StackViewHelper.prototype.setTransLateOfNextSectionShapes = function(translate, startSectionShape) {
  goog.array.forEach(startSectionShape.getNextSectionShapes(), function(sectionShapeForEach) {
    sectionShapeForEach.setTransLate(translate);
  });
};


/**
 * @param {Function} fn
 * @param {Object=} opt_selfObj
 */
thin.core.StackViewHelper.prototype.forEachSectionHelper = function(fn, opt_selfObj) {
  var selfObj = opt_selfObj || this;
  var rows = (this.target_ && this.target_.rows_) || [];
  goog.object.forEach(rows, goog.bind(function(row) {
    fn.call(selfObj, row.helper_);
  }, selfObj));
  // goog.object.forEach(this.sectionHelpers_, goog.bind(function(sectionHelperForEach, sectionNameForEach) {
  //   fn.call(selfObj, sectionHelperForEach, sectionNameForEach);
  // }, selfObj));
};


thin.core.StackViewHelper.prototype.update = function() {
  var target = this.target_;
  var guide = this.getListGuideHelper();
  var sectionBounds = this.calculateSectionBoundsForUpdate(target);

  goog.array.forEach(target.rows_, function (row, index) {
    row.helper_.update(target, sectionBounds[index]);
  });
  // this.forEachSectionHelper(function(sectionHelperForEach, sectionNameForEach) {
  //   sectionHelperForEach.update(target, sectionBounds[sectionNameForEach]);
  // }, this);
  guide.setBounds(target.getBounds().clone());
  guide.adjustToTargetShapeBounds();
  var blankRangeBounds = this.getBlankRangeBounds();
  this.getBlankRangeSelectorLayer().setBounds(blankRangeBounds.clone());
  this.getBlankRangeDrawLayer().setBounds(blankRangeBounds.clone());
};


/**
 * @param {thin.core.StackViewShape} target
 */
thin.core.StackViewHelper.prototype.active = function(target) {
  var layout = this.getLayout();

  this.target_ = target;
  layout.getHelpers().getListOutline().setTargetShape(target);
  this.getActiveShape().clear();
  this.update();
  target.getIdShape().setVisibled(false);

  var isDrawLayerVisibled = layout.getWorkspace().getUiStatusForAction() != 'selector';

  goog.array.forEach(target.rows_, function (row) {
    row.helper_.active(target, isDrawLayerVisibled);
  });
  // this.forEachSectionHelper(function(sectionHelper, sectionName) {
  //   sectionHelper.active(target, isDrawLayerVisibled);
  // }, this);
  var blankRangeSelectorLayer = this.getBlankRangeSelectorLayer();

  goog.dom.insertSiblingBefore(blankRangeSelectorLayer.getElement(),
    target.rows_[0].helper_.getSelectorLayer().getElement());
    // this.getSectionHelper(thin.core.StackViewHelper.SectionName.HEADER).getSelectorLayer().getElement());
  blankRangeSelectorLayer.setVisibled(true);
  this.getBlankRangeDrawLayer().setVisibled(isDrawLayerVisibled);
  this.getListGuideHelper().setEnableAndTargetShape(target);
  target.getListFace().setVisibled(false);
  this.initActiveSectionName();

  this.active_ = true;
};


thin.core.StackViewHelper.prototype.inactive = function() {
  if (this.isActive()) {
    goog.array.forEach(this.target_.rows_, function (row) {
      row.helper_.inactive(this.target_);
    });
    // this.forEachSectionHelper(function(sectionHelper, sectionName) {
    //   sectionHelper.inactive(target);
    // }, this);

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


thin.core.StackViewHelper.prototype.setup = function() {
  var layout = this.getLayout();
  // var sectionName = thin.core.StackViewHelper.SectionName;

  // this.sectionHelpers_ = {};
  // this.sectionHelpers_[sectionName.HEADER] = new thin.core.StackViewRowHelper(layout, sectionName.HEADER);
  // this.sectionHelpers_[sectionName.DETAIL] = new thin.core.DetailSectionHelper(layout, sectionName.DETAIL);
  // this.sectionHelpers_[sectionName.PAGEFOOTER] = new thin.core.PageFooterSectionHelper(layout, sectionName.PAGEFOOTER);
  // this.sectionHelpers_[sectionName.FOOTER] = new thin.core.FooterSectionHelper(layout, sectionName.FOOTER);
  this.listGuideHelper_ = new thin.core.StackViewGuideHelper(layout);
  var blankRangeSelecotorLayer = new thin.core.ActionLayer(layout);
  blankRangeSelecotorLayer.setBounds(new goog.math.Rect(0, 0, 0, 0));
  blankRangeSelecotorLayer.setFill(new goog.graphics.SolidFill(thin.core.StackViewHelper.FILL_, thin.core.StackViewHelper.FILLOPACITY_));
  this.blankRangeSelectorLayer_ = blankRangeSelecotorLayer;
  var blankRangeDrawLayer = new thin.core.ActionLayer(layout);
  blankRangeDrawLayer.setBounds(new goog.math.Rect(0, 0, 0, 0));
  this.blankRangeDrawLayer_ = blankRangeDrawLayer;
};


thin.core.StackViewHelper.prototype.init = function() {
  var scope = this;
  var layout = this.getLayout();
  var helpers = layout.getHelpers();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var guide = helpers.getGuideHelper();

  var listGuide = this.getListGuideHelper();
  listGuide.init();
  layout.appendChild(listGuide, this);

  var blankRangeMouseDownStackViewener = goog.bind(function(e) {
    e.preventDefault();
    layout.getWorkspace().focusElement(e);

    var listShape = this.target_;
    var activeShapeManagerByStackViewShape = this.getActiveShape();
    var shapes = activeShapeManagerByStackViewShape.getClone();
    var isEmpty = activeShapeManagerByStackViewShape.isEmpty();
    var singleShapeByStackViewShape = activeShapeManagerByStackViewShape.getIfSingle();
    var activeRow = this.getActiveRow();
    // var activeRow = this.getActiveSectionName();
    var captureProperties = multipleShapesHelper.getCloneProperties();
    if (!activeRow) {
      // Skip unselected shapes
      return;
    }

    layout.getWorkspace().normalVersioning(function(version) {

      version.upHandler(function() {
        guide.setDisable();
        helpers.disableAll();
        activeShapeManagerByStackViewShape.clear();
        this.initActiveSectionName();
        listShape.updateProperties();
        thin.ui.setEnabledForFontUi(false);
      }, scope);

      version.downHandler(function() {

        activeShapeManagerByStackViewShape.set(shapes);
        this.setActiveRow(activeRow);
        // this.setActiveSectionName(activeRow);

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
      }, scope);
    });
  }, this);

  var blankRangeSelectorLayer = this.getBlankRangeSelectorLayer();
  goog.events.listen(blankRangeSelectorLayer, goog.events.EventType.MOUSEDOWN, blankRangeMouseDownStackViewener, false, this);
  var blankRangeDrawLayer = this.getBlankRangeDrawLayer();
  goog.events.listen(blankRangeDrawLayer, goog.events.EventType.MOUSEDOWN, blankRangeMouseDownStackViewener);

  layout.appendChild(blankRangeSelectorLayer, this);
  layout.appendChild(blankRangeDrawLayer, this);
};


/**
 * @param {thin.core.StackViewShape} listShape
 * @return {Object}
 * FIXME: 不要
 */
thin.core.StackViewHelper.prototype.calculateSectionBoundsForUpdate = function(listShape) {
  var listShapeBounds = listShape.getBounds();
  var listShapeLeft = listShapeBounds.left;
  var listShapeWidth = listShapeBounds.width;
  var listShapeHeight = listShapeBounds.height;

  var sectionBounds = {};
  // var sectionNameForHeader = thin.core.StackViewHelper.SectionName.HEADER;
  // var sectionShapeForHeader = listShape.getSectionShape(sectionNameForHeader);
  // var sectionHeightForHeader = sectionShapeForHeader.getHeight();
  // if(!goog.isNumber(sectionHeightForHeader)) {
  //   sectionHeightForHeader = sectionShapeForHeader.getDefaultHeight();
  // }
  // sectionBounds[sectionNameForHeader] = new goog.math.Rect(
  //     listShapeLeft, listShapeBounds.top,
  //     listShapeWidth, sectionHeightForHeader);

  var bounds = goog.array.map(listShape.rows_,
    function(row, index) {
      return new goog.math.Rect(listShapeLeft, 0, listShapeWidth, row.getHeight() || row.getDefaultHeight());
      // sectionNamaForNext = sectionShapeForNext.getSectionName();
      // previousSectionBounds = sectionBounds[sectionShapeForNext.getPreviousSectionShape().getSectionName()];
      // sectionHeightForScope = sectionShapeForNext.getHeight();
      // if(!goog.isNumber(sectionHeightForScope)) {
      //   sectionHeightForScope = sectionShapeForNext.getDefaultHeight();
      // }
      // sectionBounds[sectionNamaForNext] = new goog.math.Rect(
      //     listShapeLeft, previousSectionBounds.toBox().bottom,
      //     listShapeWidth, sectionHeightForScope);
    });

  goog.array.forEach(bounds, function (b, index) {
    if (index == 0) {
      b.top = listShapeBounds.top;
    } else {
      prevBounds = bounds[index - 1];
      b.top = prevBounds.y + prevBounds.height;
    }
  });

  return bounds;
  // return sectionBounds;
};


/** @inheritDoc */
thin.core.StackViewHelper.prototype.disposeInternal = function() {
  this.listGuideHelper_.dispose();
  this.blankRangeSelectorLayer_.dispose();
  this.blankRangeDrawLayer_.dispose();
  delete this.blankRangeDrawLayer_;
  delete this.blankRangeSelectorLayer_;
  delete this.target_;
  delete this.listGuideHelper_;
  delete this.sectionHelpers_;
  delete this.changingPageSetshape_;
};
