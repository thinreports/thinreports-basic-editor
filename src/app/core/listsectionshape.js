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

goog.provide('thin.core.ListSectionShape');
goog.provide('thin.core.HeaderSectionShape');
goog.provide('thin.core.DetailSectionShape');
goog.provide('thin.core.PageFooterSectionShape');
goog.provide('thin.core.FooterSectionShape');

goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.math.Rect');
goog.require('goog.Disposable');
goog.require('goog.graphics.SvgGroupElement');
goog.require('thin.core.ShapeManager');
goog.require('thin.core.ModuleElement');
goog.require('thin.core.ModuleShape');


/**
 * @param {thin.core.Layout} layout
 * @param {thin.core.ListShape} affiliationGroup
 * @param {string} sectionName
 * @param {Element=} opt_element
 * @constructor
 * @extends {goog.Disposable}
 */
thin.core.ListSectionShape = function(layout, affiliationGroup, sectionName, opt_element) {

  /**
   * @type {thin.core.Layout}
   * @private
   */
  this.layout_ = layout;

  /**
   * @type {thin.core.ListShape}
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
goog.inherits(thin.core.ListSectionShape, goog.Disposable);
goog.mixin(thin.core.ListSectionShape.prototype, thin.core.ModuleElement.prototype);
goog.mixin(thin.core.ListSectionShape.prototype, thin.core.ModuleShape.prototype);


/**
 * @type {boolean}
 */
thin.core.ListSectionShape.DEFAULT_ENABLED = true;


/**
 * @type {goog.graphics.SvgGroupElement}
 * @private
 */
thin.core.ListSectionShape.prototype.group_;


/**
 * @type {thin.core.StateManager}
 * @private
 */
thin.core.ListSectionShape.prototype.manager_;


/**
 * @type {number}
 * @private
 */
thin.core.ListSectionShape.prototype.defaultHeightRate_;


/**
 * @type {boolean}
 * @private
 */
thin.core.ListSectionShape.prototype.isEnabled_;


/**
 * @type {thin.core.ListSectionShape}
 * @private
 */
thin.core.ListSectionShape.prototype.nextSectionShape_;


/**
 * @type {thin.core.ListSectionShape}
 * @private
 */
thin.core.ListSectionShape.prototype.previousSectionShape_;


/**
 * @type {number}
 * @private
 */
thin.core.ListSectionShape.prototype.lastActiveHeight_;


/**
 * @return {string}
 */
thin.core.ListSectionShape.prototype.getSectionName = function() {
  return this.sectionName_;
};


/**
 * @param {Element=} opt_element
 */
thin.core.ListSectionShape.prototype.setup = function(opt_element) {
  var layout = this.layout_;
  var classId = thin.core.ListShape.ClassIds;

  var group = new goog.graphics.SvgGroupElement(opt_element ||
                      layout.createSvgElement('g', {
                        'class': thin.core.ListShape.CLASSID + classId[this.sectionName_]
                      }), layout);
  group.setTransformation(0, 0, 0, 0, 0);

  this.group_ = group;

  this.manager_ = new thin.core.StateManager(layout);
};


/**
 * @return {thin.core.StateManager}
 */
thin.core.ListSectionShape.prototype.getManager = function() {
  return this.manager_;
};


/**
 * @return {goog.graphics.SvgGroupElement}
 */
thin.core.ListSectionShape.prototype.getGroup = function() {
  return this.group_;
};


/**
 * @param {boolean} enabled
 */
thin.core.ListSectionShape.prototype.setEnabled = function(enabled) {
  this.isEnabled_ = enabled;
};


/**
 * @return {boolean}
 */
thin.core.ListSectionShape.prototype.isEnabled = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.isEnabled_,
             thin.core.ListSectionShape.DEFAULT_ENABLED));
};


/**
 * @param {number} top
 */
thin.core.ListSectionShape.prototype.setTop = function(top) {
  top = thin.numberWithPrecision(top);
  this.top_ = top;
  this.layout_.setElementAttributes(this.group_.getElement(), {
    'x-top': top
  });
};


/**
 * @param {number} height
 */
thin.core.ListSectionShape.prototype.setHeight = function(height) {
  height = thin.numberWithPrecision(height);
  this.height_ = height;
  this.layout_.setElementAttributes(this.group_.getElement(), {
    'x-height': height
  });
};


thin.core.ListSectionShape.prototype.initHeightForLastActive = function() {
  delete this.lastActiveHeight_;
};


/**
 * @param {number} height
 */
thin.core.ListSectionShape.prototype.setHeightForLastActive = function(height) {
  this.lastActiveHeight_ = height;
};


/**
 * @return {number}
 */
thin.core.ListSectionShape.prototype.getHeightForLastActive = function() {
  return this.lastActiveHeight_;
};


/**
 * @return {number}
 */
thin.core.ListSectionShape.prototype.getDefaultHeight = function() {
  return thin.numberWithPrecision(this.affiliationGroup_.getHeight() * this.defaultHeightRate_);
};


/**
 * @return {goog.math.Rect}
 */
thin.core.ListSectionShape.prototype.getBounds = function() {
  var listShapeBounds = this.affiliationGroup_.getBounds();
  return new goog.math.Rect(listShapeBounds.left, this.top_,
           listShapeBounds.width, this.height_);
};


/**
 * @param {goog.math.Coordinate} translate
 */
thin.core.ListSectionShape.prototype.setTransLate = function(translate) {
  var group = this.group_;
  var existTransLate = group.getTransform();
  group.setTransformation(
      thin.numberWithPrecision(translate.x + existTransLate.getTranslateX()),
      thin.numberWithPrecision(translate.y + existTransLate.getTranslateY()), 0, 0, 0);
};


/**
 * @param {thin.core.ListSectionShape} nextSectionHelperForScope
 */
thin.core.ListSectionShape.prototype.setNextSectionShape = function(nextSectionHelperForScope) {
  if (goog.isDefAndNotNull(nextSectionHelperForScope)) {
    this.nextSectionShape_ = nextSectionHelperForScope;
  }
};


/**
 * @param {thin.core.ListSectionShape} previousSectionHelperForScope
 */
thin.core.ListSectionShape.prototype.setPreviousSectionShape = function(previousSectionHelperForScope) {
  if (goog.isDefAndNotNull(previousSectionHelperForScope)) {
    this.previousSectionShape_ = previousSectionHelperForScope;
  }
};


/**
 * @return {thin.core.ListSectionShape}
 */
thin.core.ListSectionShape.prototype.getNextSectionShape = function() {
  return this.nextSectionShape_;
};


/**
 * @return {Array.<thin.core.ListSectionShape>}
 */
thin.core.ListSectionShape.prototype.getNextSectionShapes = function() {
  var sectionShapes = [];

  /**
   * @param {thin.core.ListSectionShape=} opt_sectionShape
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
 * @return {thin.core.ListSectionShape}
 */
thin.core.ListSectionShape.prototype.getPreviousSectionShape = function() {
  return this.previousSectionShape_;
};


/** @inheritDoc */
thin.core.ListSectionShape.prototype.disposeInternal = function() {
  thin.core.ListSectionShape.superClass_.disposeInternal.call(this);
  this.group_.dispose();
  this.manager_.dispose();

  delete this.group_;
  delete this.manager_;
  delete this.affiliationGroup_;
  delete this.nextSectionShape_;
  delete this.previousSectionShape_;
};


thin.core.ListSectionShape.prototype.getType = function() {
  return thin.core.ListShape.ClassIds[this.getSectionName()].replace(/^\-/, '');
};


/**
 * @return {Object}
 */
thin.core.ListSectionShape.prototype.toHash = function() {
  var hash = {
    'enabled': this.isEnabled(),
    'height': this.height_
  };

  var transform = this.getGroup().getTransform();

  if (this.isEnabled()) {
    var childNodes = this.getGroup().getElement().childNodes;
    var identifiers = goog.array.map(childNodes, function(element, i) {
      return element.getAttribute('id');
    });

    var manager = this.getManager().getShapesManager();
    var items = goog.array.map(identifiers, function(identifier, i) {
      return manager.getShapeByIdentifier(identifier).toHash();
    });
  } else {
    var items = [];
  }

  goog.object.extend(hash, {
    'translate': {
      'x': transform.getTranslateX(),
      'y': transform.getTranslateY()
    },
    'items': items
  });

  return hash;
};


/**
 * @param {Object} attrs
 */
thin.core.ListSectionShape.prototype.update = function(attrs) {
  goog.object.forEach(attrs, function(value, attr) {
    switch (attr) {
      case 'enabled':
        this.setEnabled(value);
        break;
      case 'height':
        this.setHeight(value);
        break;
      case 'translate':
        this.setTransLate(new goog.math.Coordinate(
          value['x'], value['y']));
        break;
      case 'items':
        this.getLayout().drawShapes(value, this);
        break;
      default:
        break;
      }
  }, this);
};


/**
 * @param {thin.core.Layout} layout
 * @param {thin.core.ListShape} affiliationGroup
 * @param {string} sectionName
 * @param {Element=} opt_element
 * @constructor
 * @extends {thin.core.ListSectionShape}
 */
thin.core.HeaderSectionShape = function(layout, affiliationGroup, sectionName, opt_element) {
  thin.core.ListSectionShape.call(this, layout, affiliationGroup, sectionName, opt_element);
};
goog.inherits(thin.core.HeaderSectionShape, thin.core.ListSectionShape);


/**
 * @type {boolean}
 */
thin.core.HeaderSectionShape.DEFAULT_ENABLED = true;


/**
 * @type {number}
 * @private
 */
thin.core.HeaderSectionShape.prototype.defaultHeightRate_ = 0.2;


/**
 * @return {boolean}
 */
thin.core.HeaderSectionShape.prototype.isEnabled = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.isEnabled_,
             thin.core.HeaderSectionShape.DEFAULT_ENABLED));
};


/**
 * @private
 */
thin.core.HeaderSectionShape.prototype.createPropertyComponent_ = function() {

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


thin.core.HeaderSectionShape.prototype.updateProperties = function() {
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
 * @param {thin.core.Layout} layout
 * @param {thin.core.ListShape} affiliationGroup
 * @param {string} sectionName
 * @param {Element=} opt_element
 * @constructor
 * @extends {thin.core.ListSectionShape}
 */
thin.core.DetailSectionShape = function(layout, affiliationGroup, sectionName, opt_element) {
  thin.core.ListSectionShape.call(this, layout, affiliationGroup, sectionName, opt_element);
};
goog.inherits(thin.core.DetailSectionShape, thin.core.ListSectionShape);


/**
 * @type {boolean}
 */
thin.core.DetailSectionShape.DEFAULT_ENABLED = true;


/**
 * @type {number}
 * @private
 */
thin.core.DetailSectionShape.prototype.defaultHeightRate_ = 0.2;


/**
 * @return {boolean}
 */
thin.core.DetailSectionShape.prototype.isEnabled = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.isEnabled_,
             thin.core.DetailSectionShape.DEFAULT_ENABLED));
};


/**
 * @private
 */
thin.core.DetailSectionShape.prototype.createPropertyComponent_ = function() {

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


thin.core.DetailSectionShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }
  proppane.getPropertyControl('section-detail-height').setValue(this.height_);
};


/**
 * @return {Object}
 */
thin.core.DetailSectionShape.prototype.toHash = function() {
  var hash = goog.base(this, 'toHash');

  goog.object.remove(hash, 'enabled');

  return hash;
};


/**
 * @param {thin.core.Layout} layout
 * @param {thin.core.ListShape} affiliationGroup
 * @param {string} sectionName
 * @param {Element=} opt_element
 * @constructor
 * @extends {thin.core.ListSectionShape}
 */
thin.core.PageFooterSectionShape = function(layout, affiliationGroup, sectionName, opt_element) {
  thin.core.ListSectionShape.call(this, layout, affiliationGroup, sectionName, opt_element);
};
goog.inherits(thin.core.PageFooterSectionShape, thin.core.ListSectionShape);


/**
 * @type {boolean}
 */
thin.core.PageFooterSectionShape.DEFAULT_ENABLED = true;


/**
 * @type {number}
 * @private
 */
thin.core.PageFooterSectionShape.prototype.defaultHeightRate_ = 0.15;


/**
 * @return {boolean}
 */
thin.core.PageFooterSectionShape.prototype.isEnabled = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.isEnabled_,
             thin.core.PageFooterSectionShape.DEFAULT_ENABLED));
};


/**
 * @private
 */
thin.core.PageFooterSectionShape.prototype.createPropertyComponent_ = function() {

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


thin.core.PageFooterSectionShape.prototype.updateProperties = function() {
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
 * @param {thin.core.Layout} layout
 * @param {thin.core.ListShape} affiliationGroup
 * @param {string} sectionName
 * @param {Element=} opt_element
 * @constructor
 * @extends {thin.core.ListSectionShape}
 */
thin.core.FooterSectionShape = function(layout, affiliationGroup, sectionName, opt_element) {
  thin.core.ListSectionShape.call(this, layout, affiliationGroup, sectionName, opt_element);
};
goog.inherits(thin.core.FooterSectionShape, thin.core.ListSectionShape);


/**
 * @type {boolean}
 */
thin.core.FooterSectionShape.DEFAULT_ENABLED = true;


/**
 * @type {number}
 * @private
 */
thin.core.FooterSectionShape.prototype.defaultHeightRate_ = 0.15;


/**
 * @return {boolean}
 */
thin.core.FooterSectionShape.prototype.isEnabled = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.isEnabled_,
             thin.core.FooterSectionShape.DEFAULT_ENABLED));
};


/**
 * @private
 */
thin.core.FooterSectionShape.prototype.createPropertyComponent_ = function() {

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


thin.core.FooterSectionShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }
  proppane.getPropertyControl('section-footer-enable').setChecked(this.isEnabled());
  proppane.getPropertyControl('section-footer-height').setValue(this.height_);
};
