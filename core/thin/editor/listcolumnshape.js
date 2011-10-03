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

goog.provide('thin.editor.ListColumnShape');
goog.provide('thin.editor.HeaderColumnShape');
goog.provide('thin.editor.DetailColumnShape');
goog.provide('thin.editor.PageFooterColumnShape');
goog.provide('thin.editor.FooterColumnShape');

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
 * @param {string} columnName
 * @param {Element=} opt_element
 * @constructor
 * @extends {goog.Disposable}
 */
thin.editor.ListColumnShape = function(layout, affiliationGroup, columnName, opt_element) {
  
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
  this.columnName_ = columnName;
  this.setup(opt_element);
};
goog.inherits(thin.editor.ListColumnShape, goog.Disposable);
goog.mixin(thin.editor.ListColumnShape.prototype, thin.editor.ModuleElement.prototype);
goog.mixin(thin.editor.ListColumnShape.prototype, thin.editor.ModuleShape.prototype);


/**
 * @type {boolean}
 */
thin.editor.ListColumnShape.DEFAULT_ENABLED = true;


/**
 * @type {goog.graphics.SvgGroupElement}
 * @private
 */
thin.editor.ListColumnShape.prototype.group_;


/**
 * @type {number}
 * @private
 */
thin.editor.ListColumnShape.prototype.defaultHeightRate_;


/**
 * @type {boolean}
 * @private
 */
thin.editor.ListColumnShape.prototype.columnEnabled_;


/**
 * @type {thin.editor.ListColumnShape}
 * @private
 */
thin.editor.ListColumnShape.prototype.nextColumnShape_;


/**
 * @type {thin.editor.ListColumnShape}
 * @private
 */
thin.editor.ListColumnShape.prototype.previousColumnShape_;


/**
 * @type {number}
 * @private
 */
thin.editor.ListColumnShape.prototype.lastActiveHeight_;


/**
 * @return {string}
 */
thin.editor.ListColumnShape.prototype.getColumnName = function() {
  return this.columnName_;
};


/**
 * @param {Element=} opt_element
 */
thin.editor.ListColumnShape.prototype.setup = function(opt_element) {
  var layout = this.layout_;
  var classId = thin.editor.ListShape.ClassIds;

  var group = new goog.graphics.SvgGroupElement(opt_element ||
                      layout.createSvgElement('g', {
                        'class': thin.editor.ListShape.CLASSID + classId[this.columnName_]
                      }), layout);
  group.setTransformation(0, 0, 0, 0, 0);
  
  this.group_ = group;
  
  /**
   * @type {thin.editor.StateManager}
   * @private
   */
  this.manager_ = new thin.editor.StateManager(layout);
};


/**
 * @return {thin.editor.StateManager}
 */
thin.editor.ListColumnShape.prototype.getManager = function() {
  return this.manager_;
};


/**
 * @return {goog.graphics.SvgGroupElement}
 */
thin.editor.ListColumnShape.prototype.getGroup = function() {
  return this.group_;
};


/**
 * @param {boolean} enabled
 */
thin.editor.ListColumnShape.prototype.setEnabledForColumn = function(enabled) {
  this.columnEnabled_ = enabled;
};


/**
 * @return {boolean}
 */
thin.editor.ListColumnShape.prototype.isEnabledForColumn = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.columnEnabled_, 
             thin.editor.ListColumnShape.DEFAULT_ENABLED));
};


/**
 * @param {number} top
 */
thin.editor.ListColumnShape.prototype.setTopForColumn = function(top) {
  top = thin.numberWithPrecision(top);
  this.top_ = top;
  this.layout_.setElementAttributes(this.group_.getElement(), {
    'x-top': top
  });
};


/**
 * @return {number}
 */
thin.editor.ListColumnShape.prototype.getTopForColumn = function() {
  return this.top_;
};


/**
 * @param {number} height
 */
thin.editor.ListColumnShape.prototype.setHeightForColumn = function(height) {
  height = thin.numberWithPrecision(height);
  this.height_ = height;
  this.layout_.setElementAttributes(this.group_.getElement(), {
    'x-height': height
  });
};


/**
 * @return {number}
 */
thin.editor.ListColumnShape.prototype.getHeightForColumn = function() {
  return this.height_;
};


thin.editor.ListColumnShape.prototype.initHeightForLastActive = function() {
  delete this.lastActiveHeight_;
};


/**
 * @param {number} height
 */
thin.editor.ListColumnShape.prototype.setHeightForLastActive = function(height) {
  this.lastActiveHeight_ = height;
};


/**
 * @return {number}
 */
thin.editor.ListColumnShape.prototype.getHeightForLastActive = function() {
  return this.lastActiveHeight_;
};


/**
 * @return {number}
 */
thin.editor.ListColumnShape.prototype.getHeightForDefault = function() {
  return thin.numberWithPrecision(this.affiliationGroup_.getHeight() * this.defaultHeightRate_);
};


/**
 * @return {goog.math.Rect}
 */
thin.editor.ListColumnShape.prototype.getBounds = function() {
  var listShapeBounds = this.affiliationGroup_.getBounds();
  return new goog.math.Rect(listShapeBounds.left, this.top_,
           listShapeBounds.width, this.height_);
};


/**
 * @param {goog.math.Coordinate} translate
 */
thin.editor.ListColumnShape.prototype.setTransLate = function(translate) {
  var group = this.group_;
  var existTransLate = group.getTransform();
  group.setTransformation(
      thin.numberWithPrecision(translate.x + existTransLate.getTranslateX()),
      thin.numberWithPrecision(translate.y + existTransLate.getTranslateY()), 0, 0, 0);
};


/**
 * @param {thin.editor.ListColumnShape} nextColumnBandForScope
 */
thin.editor.ListColumnShape.prototype.setNextColumnShape = function(nextColumnBandForScope) {
  if (goog.isDefAndNotNull(nextColumnBandForScope)) {
    this.nextColumnShape_ = nextColumnBandForScope;
  }
};


/**
 * @param {thin.editor.ListColumnShape} previousColumnBandForScope
 */
thin.editor.ListColumnShape.prototype.setPreviousColumnShape = function(previousColumnBandForScope) {
  if (goog.isDefAndNotNull(previousColumnBandForScope)) {
    this.previousColumnShape_ = previousColumnBandForScope;
  }
};


/**
 * @return {thin.editor.ListColumnShape}
 */
thin.editor.ListColumnShape.prototype.getNextColumnShape = function() {
  return this.nextColumnShape_;
};


/**
 * @return {Array.<thin.editor.ListColumnShape>}
 */
thin.editor.ListColumnShape.prototype.getNextColumnShapesForArray = function() {
  
  var nextColumnBandArray = [];
  
  
  /**
   * @param {thin.editor.ListColumnShape=} opt_columnBandForScope
   */
  var getNextColumnShape = goog.bind(function(opt_columnBandForScope) {
    if (goog.isDef(opt_columnBandForScope)) {
      var nextColumnBand = opt_columnBandForScope.getNextColumnShape();
      if (goog.isDef(nextColumnBand)) {
        goog.array.insert(nextColumnBandArray, nextColumnBand);
        getNextColumnShape.call(this, nextColumnBand);
      }
    }
  }, this);
  getNextColumnShape.call(this, this);
  return nextColumnBandArray;
};


/**
 * @return {thin.editor.ListColumnShape}
 */
thin.editor.ListColumnShape.prototype.getPreviousColumnShape = function() {
  return this.previousColumnShape_;
};


/**
 * @return {Array.<thin.editor.ListColumnShape>}
 */
thin.editor.ListColumnShape.prototype.getPreviousColumnShapesForArray = function() {
  
  var previousColumnBandArray = [];
  var getPreviousColumnShape = goog.bind(function(opt_columnBandForScope) {
    if (goog.isDef(opt_columnBandForScope)) {
      var previousColumnBand = opt_columnBandForScope.getPreviousColumnShape();
      if (goog.isDef(previousColumnBand)) {
        goog.array.insert(previousColumnBandArray, previousColumnBand);
        getPreviousColumnShape.call(this, previousColumnBand);
      }
    }
    return false;
  }, this);
  getPreviousColumnShape.call(this, this);
  return previousColumnBandArray;
};


/** @inheritDoc */
thin.editor.ListColumnShape.prototype.disposeInternal = function() {
  thin.editor.ListColumnShape.superClass_.disposeInternal.call(this);
  this.group_.dispose();
  this.manager_.dispose();
  
  delete this.group_;
  delete this.manager_;
  delete this.affiliationGroup_;
  delete this.nextColumnShape_;
  delete this.previousColumnShape_;
};


/**
 * @param {thin.editor.Layout} layout
 * @param {thin.editor.ListShape} affiliationGroup
 * @param {string} columnName
 * @param {Element=} opt_element
 * @constructor
 * @extends {thin.editor.ListColumnShape}
 */
thin.editor.HeaderColumnShape = function(layout, affiliationGroup, columnName, opt_element) {
  thin.editor.ListColumnShape.call(this, layout, affiliationGroup, columnName, opt_element);
};
goog.inherits(thin.editor.HeaderColumnShape, thin.editor.ListColumnShape);


/**
 * @type {boolean}
 */
thin.editor.HeaderColumnShape.DEFAULT_ENABLED = true;


/**
 * @type {number}
 * @private
 */
thin.editor.HeaderColumnShape.prototype.defaultHeightRate_ = 0.2;


/**
 * @return {boolean}
 */
thin.editor.HeaderColumnShape.prototype.isEnabledForColumn = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.columnEnabled_, 
             thin.editor.HeaderColumnShape.DEFAULT_ENABLED));
};


/**
 * @private
 */
thin.editor.HeaderColumnShape.prototype.createPropertyComponent_ = function() {

  var scope = this;
  var listShape = this.affiliationGroup_;
  var columnNameForScope = this.columnName_;
  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');
  
  var containerGroup = proppane.addGroup('ヘッダー');
  
  var heightInputProperty = new thin.ui.PropertyPane.NumberInputProperty('高さ');
  var heightInput = heightInputProperty.getValueControl();
  heightInput.getNumberValidator().setAllowDecimal(true, 1);
  
  heightInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        listShape.setHeightForColumnShape(
            Number(e.target.getValue()), columnNameForScope);
      }, false, this);
  
  proppane.addProperty(heightInputProperty, containerGroup, 'band-header-height');
  
  
  var displayCheckProperty = new thin.ui.PropertyPane.CheckboxProperty('表示');
  displayCheckProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        scope.setEnabledForColumnShapePropertyUpdate(
            e.target.isChecked(), columnNameForScope);
      }, false, this);
  
  proppane.addProperty(displayCheckProperty, containerGroup, 'band-header-enable');
};


thin.editor.HeaderColumnShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }
  proppane.getPropertyControl('band-header-enable').setChecked(this.isEnabledForColumn());
  proppane.getPropertyControl('band-header-height').setValue(this.height_);
};


/**
 * @param {thin.editor.Layout} layout
 * @param {thin.editor.ListShape} affiliationGroup
 * @param {string} columnName
 * @param {Element=} opt_element
 * @constructor
 * @extends {thin.editor.ListColumnShape}
 */
thin.editor.DetailColumnShape = function(layout, affiliationGroup, columnName, opt_element) {
  thin.editor.ListColumnShape.call(this, layout, affiliationGroup, columnName, opt_element);
};
goog.inherits(thin.editor.DetailColumnShape, thin.editor.ListColumnShape);


/**
 * @type {boolean}
 */
thin.editor.DetailColumnShape.DEFAULT_ENABLED = true;


/**
 * @type {number}
 * @private
 */
thin.editor.DetailColumnShape.prototype.defaultHeightRate_ = 0.2;


/**
 * @return {boolean}
 */
thin.editor.DetailColumnShape.prototype.isEnabledForColumn = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.columnEnabled_, 
             thin.editor.DetailColumnShape.DEFAULT_ENABLED));
};


/**
 * @private
 */
thin.editor.DetailColumnShape.prototype.createPropertyComponent_ = function() {

  var scope = this;
  var listShape = this.affiliationGroup_;
  var columnNameForScope = this.columnName_;
  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');
  
  var containerGroup = proppane.addGroup('詳細');
  
  var heightInputProperty = new thin.ui.PropertyPane.NumberInputProperty('高さ');
  var heightInput = heightInputProperty.getValueControl();
  heightInput.getNumberValidator().setAllowDecimal(true, 1);
  
  heightInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        listShape.setHeightForColumnShape(
            Number(e.target.getValue()), columnNameForScope);
      }, false, this);
  
  proppane.addProperty(heightInputProperty, containerGroup, 'band-detail-height');
};


thin.editor.DetailColumnShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }
  proppane.getPropertyControl('band-detail-height').setValue(this.height_);
};


/**
 * @param {thin.editor.Layout} layout
 * @param {thin.editor.ListShape} affiliationGroup
 * @param {string} columnName
 * @param {Element=} opt_element
 * @constructor
 * @extends {thin.editor.ListColumnShape}
 */
thin.editor.PageFooterColumnShape = function(layout, affiliationGroup, columnName, opt_element) {
  thin.editor.ListColumnShape.call(this, layout, affiliationGroup, columnName, opt_element);
};
goog.inherits(thin.editor.PageFooterColumnShape, thin.editor.ListColumnShape);


/**
 * @type {boolean}
 */
thin.editor.PageFooterColumnShape.DEFAULT_ENABLED = true;


/**
 * @type {number}
 * @private
 */
thin.editor.PageFooterColumnShape.prototype.defaultHeightRate_ = 0.15;


/**
 * @return {boolean}
 */
thin.editor.PageFooterColumnShape.prototype.isEnabledForColumn = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.columnEnabled_, 
             thin.editor.PageFooterColumnShape.DEFAULT_ENABLED));
};


/**
 * @private
 */
thin.editor.PageFooterColumnShape.prototype.createPropertyComponent_ = function() {

  var scope = this;
  var listShape = this.affiliationGroup_;
  var columnNameForScope = this.columnName_;
  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');
  
  var containerGroup = proppane.addGroup('ページフッター');
  
  var heightInputProperty = new thin.ui.PropertyPane.NumberInputProperty('高さ');
  var heightInput = heightInputProperty.getValueControl();
  heightInput.getNumberValidator().setAllowDecimal(true, 1);
  
  heightInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        listShape.setHeightForColumnShape(
            Number(e.target.getValue()), columnNameForScope);
      }, false, this);
  
  proppane.addProperty(heightInputProperty, containerGroup, 'band-pagefooter-height');
  
  
  var displayCheckProperty = new thin.ui.PropertyPane.CheckboxProperty('表示');
  displayCheckProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        scope.setEnabledForColumnShapePropertyUpdate(
            e.target.isChecked(), columnNameForScope);
      }, false, this);
  
  proppane.addProperty(displayCheckProperty, containerGroup, 'band-pagefooter-enable');
};


thin.editor.PageFooterColumnShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }
  proppane.getPropertyControl('band-pagefooter-enable').setChecked(this.isEnabledForColumn());
  proppane.getPropertyControl('band-pagefooter-height').setValue(this.height_);
};


/**
 * @param {thin.editor.Layout} layout
 * @param {thin.editor.ListShape} affiliationGroup
 * @param {string} columnName
 * @param {Element=} opt_element
 * @constructor
 * @extends {thin.editor.ListColumnShape}
 */
thin.editor.FooterColumnShape = function(layout, affiliationGroup, columnName, opt_element) {
  thin.editor.ListColumnShape.call(this, layout, affiliationGroup, columnName, opt_element);
};
goog.inherits(thin.editor.FooterColumnShape, thin.editor.ListColumnShape);


/**
 * @type {boolean}
 */
thin.editor.FooterColumnShape.DEFAULT_ENABLED = true;


/**
 * @type {number}
 * @private
 */
thin.editor.FooterColumnShape.prototype.defaultHeightRate_ = 0.15;


/**
 * @return {boolean}
 */
thin.editor.FooterColumnShape.prototype.isEnabledForColumn = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.columnEnabled_, 
             thin.editor.FooterColumnShape.DEFAULT_ENABLED));
};


/**
 * @private
 */
thin.editor.FooterColumnShape.prototype.createPropertyComponent_ = function() {

  var scope = this;
  var listShape = this.affiliationGroup_;
  var columnNameForScope = this.columnName_;
  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');
  
  var containerGroup = proppane.addGroup('フッター');
  
  var heightInputProperty = new thin.ui.PropertyPane.NumberInputProperty('高さ');
  var heightInput = heightInputProperty.getValueControl();
  heightInput.getNumberValidator().setAllowDecimal(true, 1);
  
  heightInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        listShape.setHeightForColumnShape(
            Number(e.target.getValue()), columnNameForScope);
      }, false, this);
  
  proppane.addProperty(heightInputProperty, containerGroup, 'band-footer-height');
  
  
  var displayCheckProperty = new thin.ui.PropertyPane.CheckboxProperty('表示');
  displayCheckProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        scope.setEnabledForColumnShapePropertyUpdate(
            e.target.isChecked(), columnNameForScope);
      }, false, this);
  
  proppane.addProperty(displayCheckProperty, containerGroup, 'band-footer-enable');
};


thin.editor.FooterColumnShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }
  proppane.getPropertyControl('band-footer-enable').setChecked(this.isEnabledForColumn());
  proppane.getPropertyControl('band-footer-height').setValue(this.height_);
};