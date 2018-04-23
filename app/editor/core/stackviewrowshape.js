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

goog.provide('thin.core.StackViewRowShape');

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
 * @param {thin.core.StackViewShape} affiliationGroup
 * @param {string} sectionName
 * @param {Element=} opt_element
 * @constructor
 * @extends {goog.Disposable}
 */
thin.core.StackViewRowShape = function(layout, affiliationGroup) {
  /**
   * @type {thin.core.Layout}
   * @private
   */
  this.layout_ = layout;

  /**
   * @type {thin.core.StackViewShape}
   * @private
   */
  this.affiliationGroup_ = affiliationGroup;

  /**
   * @type {thin.core.StackViewRowHelper}
   * @private
   */
  this.helper_ = new thin.core.StackViewRowHelper(layout, this);

  /**
   * @type {string}
   * @private
   */
  this.setup();
};
goog.inherits(thin.core.StackViewRowShape, goog.Disposable);
goog.mixin(thin.core.StackViewRowShape.prototype, thin.core.ModuleElement.prototype);
goog.mixin(thin.core.StackViewRowShape.prototype, thin.core.ModuleShape.prototype);


/**
 * @type {boolean}
 */
thin.core.StackViewRowShape.DEFAULT_ENABLED = true;


/**
 * @type {goog.graphics.SvgGroupElement}
 * @private
 */
thin.core.StackViewRowShape.prototype.group_;


/**
 * @type {thin.core.StateManager}
 * @private
 */
thin.core.StackViewRowShape.prototype.manager_;


/**
 * @type {boolean}
 * @private
 */
thin.core.StackViewRowShape.prototype.isEnabled_;


/**
 * @type {thin.core.StackViewRowShape}
 * @private
 */
thin.core.StackViewRowShape.prototype.nextSectionShape_;


/**
 * @type {thin.core.StackViewRowShape}
 * @private
 */
thin.core.StackViewRowShape.prototype.previousSectionShape_;


/**
 * @type {number}
 * @private
 */
thin.core.StackViewRowShape.prototype.lastActiveHeight_;


/**
 * @return {string}
 */
thin.core.StackViewRowShape.prototype.getSectionName = function() {
  return this.sectionName_;
};


/**
 * @param {Element=} opt_element
 */
thin.core.StackViewRowShape.prototype.setup = function(opt_element) {
  var layout = this.layout_;
  var classId = thin.core.StackViewShape.ClassIds;

  var group = new goog.graphics.SvgGroupElement(opt_element ||
                      layout.createSvgElement('g', {
                        'class': 'stack-view-row'//thin.core.StackViewShape.CLASSID + classId[this.sectionName_]
                      }), layout);
  group.setTransformation(0, 0, 0, 0, 0);

  this.helper_.init();
  this.group_ = group;
  this.manager_ = new thin.core.StateManager(layout);
};


/**
 * @return {thin.core.StateManager}
 */
thin.core.StackViewRowShape.prototype.getManager = function() {
  return this.manager_;
};


/**
 * @return {goog.graphics.SvgGroupElement}
 */
thin.core.StackViewRowShape.prototype.getGroup = function() {
  return this.group_;
};


/**
 * @param {boolean} enabled
 */
thin.core.StackViewRowShape.prototype.setEnabled = function(enabled) {
  this.isEnabled_ = enabled;
};


/**
 * @return {boolean}
 */
thin.core.StackViewRowShape.prototype.isEnabled = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.isEnabled_,
             thin.core.StackViewRowShape.DEFAULT_ENABLED));
};


/**
 * @return {thin.core.StackViewRowHelper}
 */
thin.core.StackViewRowShape.prototype.getHelper = function () {
  return this.helper_;
};

/**
 * @param {number} top
 */
thin.core.StackViewRowShape.prototype.setTop = function(top) {
  top = thin.numberWithPrecision(top);
  this.top_ = top;
  this.layout_.setElementAttributes(this.group_.getElement(), {
    'x-top': top
  });
};


/**
 * @param {number} height
 */
thin.core.StackViewRowShape.prototype.setHeight = function(height) {
  height = thin.numberWithPrecision(height);
  this.height_ = height;
  this.layout_.setElementAttributes(this.group_.getElement(), {
    'x-height': height
  });
};


thin.core.StackViewRowShape.prototype.initHeightForLastActive = function() {
  delete this.lastActiveHeight_;
};


/**
 * @param {number} height
 */
thin.core.StackViewRowShape.prototype.setHeightForLastActive = function(height) {
  this.lastActiveHeight_ = height;
};


/**
 * @return {number}
 */
thin.core.StackViewRowShape.prototype.getHeightForLastActive = function() {
  return this.lastActiveHeight_;
};


/**
 * @return {number}
 */
thin.core.StackViewRowShape.prototype.getDefaultHeight = function() {
  return thin.numberWithPrecision(100.0);
};


/**
 * @return {goog.math.Rect}
 */
thin.core.StackViewRowShape.prototype.getBounds = function() {
  var listShapeBounds = this.affiliationGroup_.getBounds();
  return new goog.math.Rect(listShapeBounds.left, this.top_,
           listShapeBounds.width, this.height_);
};


/**
 * @param {goog.math.Coordinate} translate
 */
thin.core.StackViewRowShape.prototype.setTransLate = function(translate) {
  var group = this.group_;
  var existTransLate = group.getTransform();
  group.setTransformation(
      thin.numberWithPrecision(translate.x + existTransLate.getTranslateX()),
      thin.numberWithPrecision(translate.y + existTransLate.getTranslateY()), 0, 0, 0);
};


/**
 * @param {thin.core.StackViewRowShape} nextSectionHelperForScope
 */
thin.core.StackViewRowShape.prototype.setNextSectionShape = function(nextSectionHelperForScope) {
  if (goog.isDefAndNotNull(nextSectionHelperForScope)) {
    this.nextSectionShape_ = nextSectionHelperForScope;
  }
};


/**
 * @param {thin.core.StackViewRowShape} previousSectionHelperForScope
 */
thin.core.StackViewRowShape.prototype.setPreviousSectionShape = function(previousSectionHelperForScope) {
  if (goog.isDefAndNotNull(previousSectionHelperForScope)) {
    this.previousSectionShape_ = previousSectionHelperForScope;
  }
};


/**
 * @return {thin.core.StackViewRowShape}
 */
thin.core.StackViewRowShape.prototype.getNextSectionShape = function() {
  return this.nextSectionShape_;
};


/**
 * @return {Array.<thin.core.StackViewRowShape>}
 */
thin.core.StackViewRowShape.prototype.getNextSectionShapes = function() {
  var sectionShapes = [];

  /**
   * @param {thin.core.StackViewRowShape=} opt_sectionShape
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
 * @return {thin.core.StackViewRowShape}
 */
thin.core.StackViewRowShape.prototype.getPreviousSectionShape = function() {
  return this.previousSectionShape_;
};


/**
 * @private
 */
thin.core.StackViewRowShape.prototype.createPropertyComponent_ = function() {

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


thin.core.StackViewRowShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }
  proppane.getPropertyControl('section-header-enable').setChecked(this.isEnabled());
  proppane.getPropertyControl('section-header-height').setValue(this.height_);
};


/** @inheritDoc */
thin.core.StackViewRowShape.prototype.disposeInternal = function() {
  thin.core.StackViewRowShape.superClass_.disposeInternal.call(this);
  this.group_.dispose();
  this.manager_.dispose();
  this.helper_.dispose();

  delete this.group_;
  delete this.manager_;
  delete this.affiliationGroup_;
  delete this.nextSectionShape_;
  delete this.previousSectionShape_;
  delete this.helper_;
};


thin.core.StackViewRowShape.prototype.getType = function() {
  return thin.core.StackViewShape.ClassIds[this.getSectionName()].replace(/^\-/, '');
};


/**
 * @return {Object}
 */
thin.core.StackViewRowShape.prototype.asJSON = function() {
  var object = {
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
      return manager.getShapeByIdentifier(identifier).asJSON();
    });
  } else {
    var items = [];
  }

  goog.object.extend(object, {
    'translate': {
      'x': transform.getTranslateX(),
      'y': transform.getTranslateY()
    },
    'items': items
  });

  return object;
};


/**
 * @param {Object} attrs
 */
thin.core.StackViewRowShape.prototype.update = function(attrs) {
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
