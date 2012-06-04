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

goog.provide('thin.editor.ListSectionShape');
goog.provide('thin.editor.HeaderSectionShape');
goog.provide('thin.editor.DetailSectionShape');
goog.provide('thin.editor.PageFooterSectionShape');
goog.provide('thin.editor.FooterSectionShape');

goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.math.Rect');
goog.require('goog.Disposable');
goog.require('goog.graphics.SvgGroupElement');
goog.require('thin.editor.ShapeManager');
goog.require('thin.editor.ModuleElement');
goog.require('thin.editor.ModuleShape');


/**
 * @param {thin.editor.Layout} layout
 * @param {thin.editor.ListShape} affiliationGroup
 * @param {string} sectionName
 * @param {Element=} opt_element
 * @constructor
 * @extends {goog.Disposable}
 */
thin.editor.ListSectionShape = function(layout, affiliationGroup, sectionName, opt_element) {
  
  /**
   * @type {thin.editor.Layout}
   * @private
   */
  this.layout_ = layout;
  
  /**
   * @type {thin.editor.ListShape}
   * @private
   */
  this.affiliationGroup_ = affiliationGroup;
  
  /**
   * @type {string}
   * @private
   */
  this.sectionName_ = sectionName;
  this.setup(opt_element);
};
goog.inherits(thin.editor.ListSectionShape, goog.Disposable);
goog.mixin(thin.editor.ListSectionShape.prototype, thin.editor.ModuleElement.prototype);
goog.mixin(thin.editor.ListSectionShape.prototype, thin.editor.ModuleShape.prototype);


/**
 * @type {boolean}
 */
thin.editor.ListSectionShape.DEFAULT_ENABLED = true;


/**
 * @type {goog.graphics.SvgGroupElement}
 * @private
 */
thin.editor.ListSectionShape.prototype.group_;


/**
 * @type {thin.editor.StateManager}
 * @private
 */
thin.editor.ListSectionShape.prototype.manager_;


/**
 * @type {number}
 * @private
 */
thin.editor.ListSectionShape.prototype.defaultHeightRate_;


/**
 * @type {boolean}
 * @private
 */
thin.editor.ListSectionShape.prototype.isEnabled_;


/**
 * @type {thin.editor.ListSectionShape}
 * @private
 */
thin.editor.ListSectionShape.prototype.nextSectionShape_;


/**
 * @type {thin.editor.ListSectionShape}
 * @private
 */
thin.editor.ListSectionShape.prototype.previousSectionShape_;


/**
 * @type {number}
 * @private
 */
thin.editor.ListSectionShape.prototype.lastActiveHeight_;


/**
 * @return {string}
 */
thin.editor.ListSectionShape.prototype.getSectionName = function() {
  return this.sectionName_;
};


/**
 * @param {Element=} opt_element
 */
thin.editor.ListSectionShape.prototype.setup = function(opt_element) {
  var layout = this.layout_;
  var classId = thin.editor.ListShape.ClassIds;

  var group = new goog.graphics.SvgGroupElement(opt_element ||
                      layout.createSvgElement('g', {
                        'class': thin.editor.ListShape.CLASSID + classId[this.sectionName_]
                      }), layout);
  group.setTransformation(0, 0, 0, 0, 0);
  
  this.group_ = group;

  this.manager_ = new thin.editor.StateManager(layout);
};


/**
 * @return {thin.editor.StateManager}
 */
thin.editor.ListSectionShape.prototype.getManager = function() {
  return this.manager_;
};


/**
 * @return {goog.graphics.SvgGroupElement}
 */
thin.editor.ListSectionShape.prototype.getGroup = function() {
  return this.group_;
};


/**
 * @param {boolean} enabled
 */
thin.editor.ListSectionShape.prototype.setEnabled = function(enabled) {
  this.isEnabled_ = enabled;
};


/**
 * @return {boolean}
 */
thin.editor.ListSectionShape.prototype.isEnabled = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.isEnabled_, 
             thin.editor.ListSectionShape.DEFAULT_ENABLED));
};


/**
 * @param {number} top
 */
thin.editor.ListSectionShape.prototype.setTop = function(top) {
  top = thin.numberWithPrecision(top);
  this.top_ = top;
  this.layout_.setElementAttributes(this.group_.getElement(), {
    'x-top': top
  });
};


/**
 * @param {number} height
 */
thin.editor.ListSectionShape.prototype.setHeight = function(height) {
  height = thin.numberWithPrecision(height);
  this.height_ = height;
  this.layout_.setElementAttributes(this.group_.getElement(), {
    'x-height': height
  });
};


thin.editor.ListSectionShape.prototype.initHeightForLastActive = function() {
  delete this.lastActiveHeight_;
};


/**
 * @param {number} height
 */
thin.editor.ListSectionShape.prototype.setHeightForLastActive = function(height) {
  this.lastActiveHeight_ = height;
};


/**
 * @return {number}
 */
thin.editor.ListSectionShape.prototype.getHeightForLastActive = function() {
  return this.lastActiveHeight_;
};


/**
 * @return {number}
 */
thin.editor.ListSectionShape.prototype.getDefaultHeight = function() {
  return thin.numberWithPrecision(this.affiliationGroup_.getHeight() * this.defaultHeightRate_);
};


/**
 * @return {goog.math.Rect}
 */
thin.editor.ListSectionShape.prototype.getBounds = function() {
  var listShapeBounds = this.affiliationGroup_.getBounds();
  return new goog.math.Rect(listShapeBounds.left, this.top_,
           listShapeBounds.width, this.height_);
};


/**
 * @param {goog.math.Coordinate} translate
 */
thin.editor.ListSectionShape.prototype.setTransLate = function(translate) {
  var group = this.group_;
  var existTransLate = group.getTransform();
  group.setTransformation(
      thin.numberWithPrecision(translate.x + existTransLate.getTranslateX()),
      thin.numberWithPrecision(translate.y + existTransLate.getTranslateY()), 0, 0, 0);
};


/**
 * @param {thin.editor.ListSectionShape} nextSectionHelperForScope
 */
thin.editor.ListSectionShape.prototype.setNextSectionShape = function(nextSectionHelperForScope) {
  if (goog.isDefAndNotNull(nextSectionHelperForScope)) {
    this.nextSectionShape_ = nextSectionHelperForScope;
  }
};


/**
 * @param {thin.editor.ListSectionShape} previousSectionHelperForScope
 */
thin.editor.ListSectionShape.prototype.setPreviousSectionShape = function(previousSectionHelperForScope) {
  if (goog.isDefAndNotNull(previousSectionHelperForScope)) {
    this.previousSectionShape_ = previousSectionHelperForScope;
  }
};


/**
 * @return {thin.editor.ListSectionShape}
 */
thin.editor.ListSectionShape.prototype.getNextSectionShape = function() {
  return this.nextSectionShape_;
};


/**
 * @return {Array.<thin.editor.ListSectionShape>}
 */
thin.editor.ListSectionShape.prototype.getNextSectionShapes = function() {
  var sectionShapes = [];
  
  /**
   * @param {thin.editor.ListSectionShape=} opt_sectionShape
   */
  var getNextSectionShape = goog.bind(function(opt_sectionShape) {
    if (goog.isDef(opt_sectionShape)) {
      var sectionShape = opt_sectionShape.getNextSectionShape();
      if (goog.isDef(sectionShape)) {
        goog.array.insert(sectionShapes, sectionShape);
        getNextSectionShape.call(this, sectionShape);
      }
    }
  }, this);
  getNextSectionShape.call(this, this);
  return sectionShapes;
};


/**
 * @return {thin.editor.ListSectionShape}
 */
thin.editor.ListSectionShape.prototype.getPreviousSectionShape = function() {
  return this.previousSectionShape_;
};


/** @inheritDoc */
thin.editor.ListSectionShape.prototype.disposeInternal = function() {
  thin.editor.ListSectionShape.superClass_.disposeInternal.call(this);
  this.group_.dispose();
  this.manager_.dispose();
  
  delete this.group_;
  delete this.manager_;
  delete this.affiliationGroup_;
  delete this.nextSectionShape_;
  delete this.previousSectionShape_;
};


/**
 * @param {thin.editor.Layout} layout
 * @param {thin.editor.ListShape} affiliationGroup
 * @param {string} sectionName
 * @param {Element=} opt_element
 * @constructor
 * @extends {thin.editor.ListSectionShape}
 */
thin.editor.HeaderSectionShape = function(layout, affiliationGroup, sectionName, opt_element) {
  thin.editor.ListSectionShape.call(this, layout, affiliationGroup, sectionName, opt_element);
};
goog.inherits(thin.editor.HeaderSectionShape, thin.editor.ListSectionShape);


/**
 * @type {boolean}
 */
thin.editor.HeaderSectionShape.DEFAULT_ENABLED = true;


/**
 * @type {number}
 * @private
 */
thin.editor.HeaderSectionShape.prototype.defaultHeightRate_ = 0.2;


/**
 * @return {boolean}
 */
thin.editor.HeaderSectionShape.prototype.isEnabled = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.isEnabled_, 
             thin.editor.HeaderSectionShape.DEFAULT_ENABLED));
};


/**
 * @private
 */
thin.editor.HeaderSectionShape.prototype.createPropertyComponent_ = function() {

  var scope = this;
  var listShape = this.affiliationGroup_;
  var sectionName = this.sectionName_;
  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');
  
  var containerGroup = proppane.addGroup(thin.t('property_group_list_header'));
  
  var heightInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_height'));
  var heightInput = heightInputProperty.getValueControl();
  heightInput.getNumberValidator().setAllowDecimal(true, 1);
  
  heightInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        listShape.setHeightForSectionShape(
            Number(e.target.getValue()), sectionName);
      }, false, this);
  
  proppane.addProperty(heightInputProperty, containerGroup, 'section-header-height');
  
  
  var displayCheckProperty = new thin.ui.PropertyPane.CheckboxProperty(thin.t('field_display'));
  displayCheckProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        scope.setSectionEnabled(e.target.isChecked(), sectionName);
      }, false, this);
  
  proppane.addProperty(displayCheckProperty, containerGroup, 'section-header-enable');
};


thin.editor.HeaderSectionShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }
  proppane.getPropertyControl('section-header-enable').setChecked(this.isEnabled());
  proppane.getPropertyControl('section-header-height').setValue(this.height_);
};


/**
 * @param {thin.editor.Layout} layout
 * @param {thin.editor.ListShape} affiliationGroup
 * @param {string} sectionName
 * @param {Element=} opt_element
 * @constructor
 * @extends {thin.editor.ListSectionShape}
 */
thin.editor.DetailSectionShape = function(layout, affiliationGroup, sectionName, opt_element) {
  thin.editor.ListSectionShape.call(this, layout, affiliationGroup, sectionName, opt_element);
};
goog.inherits(thin.editor.DetailSectionShape, thin.editor.ListSectionShape);


/**
 * @type {boolean}
 */
thin.editor.DetailSectionShape.DEFAULT_ENABLED = true;


/**
 * @type {number}
 * @private
 */
thin.editor.DetailSectionShape.prototype.defaultHeightRate_ = 0.2;


/**
 * @return {boolean}
 */
thin.editor.DetailSectionShape.prototype.isEnabled = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.isEnabled_, 
             thin.editor.DetailSectionShape.DEFAULT_ENABLED));
};


/**
 * @private
 */
thin.editor.DetailSectionShape.prototype.createPropertyComponent_ = function() {

  var scope = this;
  var listShape = this.affiliationGroup_;
  var sectionName = this.sectionName_;
  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');
  
  var containerGroup = proppane.addGroup(thin.t('property_group_list_detail'));
  
  var heightInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_height'));
  var heightInput = heightInputProperty.getValueControl();
  heightInput.getNumberValidator().setAllowDecimal(true, 1);
  
  heightInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        listShape.setHeightForSectionShape(
            Number(e.target.getValue()), sectionName);
      }, false, this);
  
  proppane.addProperty(heightInputProperty, containerGroup, 'section-detail-height');
};


thin.editor.DetailSectionShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }
  proppane.getPropertyControl('section-detail-height').setValue(this.height_);
};


/**
 * @param {thin.editor.Layout} layout
 * @param {thin.editor.ListShape} affiliationGroup
 * @param {string} sectionName
 * @param {Element=} opt_element
 * @constructor
 * @extends {thin.editor.ListSectionShape}
 */
thin.editor.PageFooterSectionShape = function(layout, affiliationGroup, sectionName, opt_element) {
  thin.editor.ListSectionShape.call(this, layout, affiliationGroup, sectionName, opt_element);
};
goog.inherits(thin.editor.PageFooterSectionShape, thin.editor.ListSectionShape);


/**
 * @type {boolean}
 */
thin.editor.PageFooterSectionShape.DEFAULT_ENABLED = true;


/**
 * @type {number}
 * @private
 */
thin.editor.PageFooterSectionShape.prototype.defaultHeightRate_ = 0.15;


/**
 * @return {boolean}
 */
thin.editor.PageFooterSectionShape.prototype.isEnabled = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.isEnabled_, 
             thin.editor.PageFooterSectionShape.DEFAULT_ENABLED));
};


/**
 * @private
 */
thin.editor.PageFooterSectionShape.prototype.createPropertyComponent_ = function() {

  var scope = this;
  var listShape = this.affiliationGroup_;
  var sectionName = this.sectionName_;
  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');
  
  var containerGroup = proppane.addGroup(thin.t('property_group_list_page_footer'));
  
  var heightInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_height'));
  var heightInput = heightInputProperty.getValueControl();
  heightInput.getNumberValidator().setAllowDecimal(true, 1);
  
  heightInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        listShape.setHeightForSectionShape(
            Number(e.target.getValue()), sectionName);
      }, false, this);
  
  proppane.addProperty(heightInputProperty, containerGroup, 'section-pagefooter-height');
  
  
  var displayCheckProperty = new thin.ui.PropertyPane.CheckboxProperty(thin.t('field_display'));
  displayCheckProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        scope.setSectionEnabled(e.target.isChecked(), sectionName);
      }, false, this);
  
  proppane.addProperty(displayCheckProperty, containerGroup, 'section-pagefooter-enable');
};


thin.editor.PageFooterSectionShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }
  proppane.getPropertyControl('section-pagefooter-enable').setChecked(this.isEnabled());
  proppane.getPropertyControl('section-pagefooter-height').setValue(this.height_);
};


/**
 * @param {thin.editor.Layout} layout
 * @param {thin.editor.ListShape} affiliationGroup
 * @param {string} sectionName
 * @param {Element=} opt_element
 * @constructor
 * @extends {thin.editor.ListSectionShape}
 */
thin.editor.FooterSectionShape = function(layout, affiliationGroup, sectionName, opt_element) {
  thin.editor.ListSectionShape.call(this, layout, affiliationGroup, sectionName, opt_element);
};
goog.inherits(thin.editor.FooterSectionShape, thin.editor.ListSectionShape);


/**
 * @type {boolean}
 */
thin.editor.FooterSectionShape.DEFAULT_ENABLED = true;


/**
 * @type {number}
 * @private
 */
thin.editor.FooterSectionShape.prototype.defaultHeightRate_ = 0.15;


/**
 * @return {boolean}
 */
thin.editor.FooterSectionShape.prototype.isEnabled = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.isEnabled_, 
             thin.editor.FooterSectionShape.DEFAULT_ENABLED));
};


/**
 * @private
 */
thin.editor.FooterSectionShape.prototype.createPropertyComponent_ = function() {

  var scope = this;
  var listShape = this.affiliationGroup_;
  var sectionName = this.sectionName_;
  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');
  
  var containerGroup = proppane.addGroup(thin.t('property_group_list_footer'));
  
  var heightInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_height'));
  var heightInput = heightInputProperty.getValueControl();
  heightInput.getNumberValidator().setAllowDecimal(true, 1);
  
  heightInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        listShape.setHeightForSectionShape(
            Number(e.target.getValue()), sectionName);
      }, false, this);
  
  proppane.addProperty(heightInputProperty, containerGroup, 'section-footer-height');
  
  
  var displayCheckProperty = new thin.ui.PropertyPane.CheckboxProperty(thin.t('field_display'));
  displayCheckProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        scope.setSectionEnabled(e.target.isChecked(), sectionName);
      }, false, this);
  
  proppane.addProperty(displayCheckProperty, containerGroup, 'section-footer-enable');
};


thin.editor.FooterSectionShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }
  proppane.getPropertyControl('section-footer-enable').setChecked(this.isEnabled());
  proppane.getPropertyControl('section-footer-height').setValue(this.height_);
};
