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

goog.provide('thin.editor.LineShape');

goog.require('goog.string');
goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('thin.editor.Line');
goog.require('thin.editor.ModuleShape');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @constructor
 * @extends {thin.editor.Line}
 */
thin.editor.LineShape = function(element, layout, stroke) {
  thin.editor.Line.call(this, element, layout, stroke);
  this.setCss(thin.editor.LineShape.CLASSID);
  this.calculateDirection(this.y1_, this.y2_);
};
goog.inherits(thin.editor.LineShape, thin.editor.Line);
goog.mixin(thin.editor.LineShape.prototype, thin.editor.ModuleShape.prototype);


/**
 * @type {string}
 */
thin.editor.LineShape.CLASSID = 's-line';


/**
 * @type {goog.graphics.Stroke}
 */
thin.editor.LineShape.DEFAULT_STROKE = new goog.graphics.Stroke(1, '#000000');


/**
 * @return {string}
 */
thin.editor.LineShape.prototype.getClassId = function() {
  return thin.editor.LineShape.CLASSID;
};


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {thin.editor.ShapeIdManager=} opt_shapeIdManager
 * @return {thin.editor.LineShape}
 */
thin.editor.LineShape.createFromElement = function(element, layout, opt_shapeIdManager) {

  var shape = new thin.editor.LineShape(element, layout, 
                  new goog.graphics.Stroke(
                      Number(layout.getElementAttribute(element, 'stroke-width')),
                      layout.getElementAttribute(element, 'stroke')));
  
  shape.setShapeId(layout.getElementAttribute(element, 'x-id'), opt_shapeIdManager);
  shape.setDisplay(layout.getElementAttribute(element, 'x-display') == 'true');
  shape.setDesc(layout.getElementAttribute(element, 'x-desc'));
  shape.setStrokeDashFromType(layout.getElementAttribute(element, 'x-stroke-type'));
  shape.initIdentifier();
  return shape;
};


thin.editor.LineShape.prototype.setDefaultOutline = function() {
  this.setTargetOutline(this.getLayout().getHelpers().getLineOutline());
};


/**
 * @param {thin.editor.Helpers} helpers
 * @param {thin.editor.MultiOutlineHelper} multiOutlineHelper
 */
thin.editor.LineShape.prototype.toOutline = function(helpers, multiOutlineHelper) {
  multiOutlineHelper.toLineOutline(this, helpers);
};


/**
 * @return {Function}
 */
thin.editor.LineShape.prototype.getCloneCreator = function() {

  var sourceCoordinate = new goog.math.Coordinate(this.getLeft(), this.getTop()).clone();
  var deltaCoordinateForList = this.getDeltaCoordinateForList().clone();
  var deltaCoordinateForGuide = this.getDeltaCoordinateForGuide().clone();

  var y1 = this.y1_;
  var y2 = this.y2_;
  var width = this.getWidth();
  var height = this.getHeight();
  var stroke = this.getStroke();
  var strokeWidth = this.getStrokeWidth();
  var fill = this.getFill();
  var strokeDashType = this.getStrokeDashType();
  var display = this.getDisplay();
  
  var isAffiliationListShape = this.isAffiliationListShape();
  var deltaCoordinate = this.getDeltaCoordinateForList();

  /**
   * @param {thin.editor.Layout} layout
   * @param {boolean=} opt_isAdaptDeltaForList
   * @param {goog.graphics.SvgGroupElement=} opt_renderTo
   * @param {goog.math.Coordinate=} opt_basisCoordinate
   * @return {thin.editor.LineShape}
   */
  return function(layout, opt_isAdaptDeltaForList, opt_renderTo, opt_basisCoordinate) {
  
    var shape = layout.createLineShape();
    layout.appendChild(shape, opt_renderTo);
    
    var pasteCoordinate = layout.calculatePasteCoordinate(isAffiliationListShape,
          deltaCoordinateForList, deltaCoordinateForGuide, sourceCoordinate,
          opt_isAdaptDeltaForList, opt_renderTo, opt_basisCoordinate);

    shape.calculateDirection(y1, y2);
    shape.setBounds(new goog.math.Rect(pasteCoordinate.x, pasteCoordinate.y, width, height));

    shape.setStrokeDashFromType(strokeDashType);
    shape.setStroke(stroke);
    shape.setStrokeWidth(strokeWidth);
    shape.setFill(fill);
    shape.setDisplay(display);
    return shape;
  };
};


/**
 * @private
 */
thin.editor.LineShape.prototype.createPropertyComponent_ = function() {
  
  var scope = this;
  var layout = this.getLayout();
  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');
  
  var baseGroup = proppane.addGroup(thin.t('property_group_basis'));
  
  
  var leftInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_left_position'));
  var leftInput = leftInputProperty.getValueControl();
  leftInput.getNumberValidator().setAllowDecimal(true, 1);
  
  leftInputProperty.addEventListener(propEventType.CHANGE,
      this.setLeftForPropertyUpdate, false, this);
  
  proppane.addProperty(leftInputProperty, baseGroup, 'left');


  var topInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_top_position'));
  var topInput = topInputProperty.getValueControl();
  topInput.getNumberValidator().setAllowDecimal(true, 1);
  
  topInputProperty.addEventListener(propEventType.CHANGE,
      this.setTopForPropertyUpdate, false, this);
  
  proppane.addProperty(topInputProperty, baseGroup, 'top');
  
  
  var widthInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_width'));
  var widthInput = widthInputProperty.getValueControl();
  widthInput.getNumberValidator().setAllowDecimal(true, 1);
  
  widthInputProperty.addEventListener(propEventType.CHANGE,
      this.setWidthForPropertyUpdate, false, this);
  
  proppane.addProperty(widthInputProperty, baseGroup, 'width');
  
  
  var heightInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_height'));
  var heightInput = heightInputProperty.getValueControl();
  heightInput.getNumberValidator().setAllowDecimal(true, 1);
  
  heightInputProperty.addEventListener(propEventType.CHANGE,
      this.setHeightForPropertyUpdate, false, this);
  
  proppane.addProperty(heightInputProperty, baseGroup, 'height');
  
  
  var displayCheckProperty = new thin.ui.PropertyPane.CheckboxProperty(thin.t('field_display'));
  displayCheckProperty.addEventListener(propEventType.CHANGE,
      this.setDisplayForPropertyUpdate, false, this);
  
  proppane.addProperty(displayCheckProperty, baseGroup, 'display');

  
  var shapeGroup = proppane.addGroup(thin.t('property_group_shape'));


  var strokeInputProperty = new thin.ui.PropertyPane.ColorProperty(thin.t('field_stroke_color'));
  strokeInputProperty.getValueControl().getInput().setLabel('none');
  strokeInputProperty.addEventListener(propEventType.CHANGE,
      this.setStrokeForPropertyUpdate, false, this);
  
  proppane.addProperty(strokeInputProperty , shapeGroup, 'stroke');
  
  
  var strokeWidthCombProperty = new thin.ui.PropertyPane.ComboBoxProperty(thin.t('field_stroke_width'));
  var strokeWidthComb = strokeWidthCombProperty.getValueControl();
  var strokeWidthInput = strokeWidthComb.getInput();
  strokeWidthInput.setLabel('none');
  var strokeWidthInputValidation = new thin.ui.Input.NumberValidator(this);
  strokeWidthInputValidation.setAllowBlank(true);
  strokeWidthInputValidation.setAllowDecimal(true, 1);
  strokeWidthInput.setValidator(strokeWidthInputValidation);

  var strokeWidthList = ['1', '2', '3', '4', '8', '12', '16', '24'];
  var strokeWidthItem;
  goog.array.forEach(strokeWidthList, function(strokeWidthValue) {
    strokeWidthItem = new thin.ui.ComboBoxItem(strokeWidthValue);
    strokeWidthItem.setSticky(true);
    strokeWidthComb.addItem(strokeWidthItem);
  });
  strokeWidthCombProperty.addEventListener(propEventType.CHANGE,
      this.setStrokeWidthForPropertyUpdate, false, this);
  
  proppane.addProperty(strokeWidthCombProperty , shapeGroup, 'stroke-width');

  
  var strokeDashTypeName = thin.editor.ModuleElement.StrokeTypeName;
  var strokeDashSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_stroke_type'));
  var strokeDashSelect = strokeDashSelectProperty.getValueControl();
  strokeDashSelect.setTextAlignLeft();
  strokeDashSelect.addItem(new thin.ui.Option(strokeDashTypeName.SOLID));
  strokeDashSelect.addItem(new thin.ui.Option(strokeDashTypeName.DASHED));
  strokeDashSelect.addItem(new thin.ui.Option(strokeDashTypeName.DOTTED));
  
  strokeDashSelectProperty.addEventListener(propEventType.CHANGE,
      this.setStrokeDashTypeForPropertyUpdate, false, this);
  
  proppane.addProperty(strokeDashSelectProperty , shapeGroup, 'stroke-dash-type');


  var cooperationGroup = proppane.addGroup(thin.t('property_group_association'));
  
  var idInputProperty = new thin.ui.PropertyPane.IdInputProperty(this, 'ID');
  idInputProperty.addEventListener(propEventType.CHANGE,
      this.setShapeIdForPropertyUpdate, false, this);
  
  proppane.addProperty(idInputProperty, cooperationGroup, 'shape-id');
  
  var descProperty = new thin.ui.PropertyPane.InputProperty(thin.t('field_description'));
  descProperty.addEventListener(propEventType.CHANGE,
      this.setDescPropertyUpdate, false, this);
  
  proppane.addProperty(descProperty, cooperationGroup, 'desc');
};


/**
 * @return {Object}
 */
thin.editor.LineShape.prototype.getProperties = function() {

  return {
    'left': this.getLeft(),
    'top': this.getTop(),
    'width': this.getWidth(),
    'height': this.getHeight(),
    'display': this.getDisplay(),
    'stroke': this.getStroke().getColor(),
    'stroke-width': this.getStrokeWidth(),
    'stroke-dash-type': this.getStrokeDashType(),
    'shape-id': this.getShapeId(),
    'desc': this.getDesc()
  };
};


thin.editor.LineShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  proppane.updateAsync(function() {
    if (!proppane.isTarget(this)) {
      this.getLayout().updatePropertiesForEmpty();
      proppane.setTarget(this);
      this.createPropertyComponent_();
    }
    
    var properties = this.getProperties();
    var proppaneBlank = thin.editor.ModuleShape.PROPPANE_SHOW_BLANK;
    
    proppane.getPropertyControl('left').setValue(properties['left']);
    proppane.getPropertyControl('top').setValue(properties['top']);
    proppane.getPropertyControl('width').setValue(properties['width']);
    proppane.getPropertyControl('height').setValue(properties['height']);
    proppane.getPropertyControl('display').setChecked(properties['display']);
    
    var stroke = properties['stroke'];
    if (thin.isExactlyEqual(stroke, thin.editor.ModuleShape.NONE)) {
      stroke = proppaneBlank
    }
    proppane.getPropertyControl('stroke').setValue(stroke);
    var strokeWidth = properties['stroke-width'];
    if (thin.isExactlyEqual(strokeWidth, thin.editor.ModuleElement.DEFAULT_STROKEWIDTH_OF_PROPPANE)) {
      strokeWidth = proppaneBlank;
    }
    proppane.getPropertyControl('stroke-width').setInternalValue(strokeWidth);
    
    proppane.getPropertyControl('stroke-dash-type').setValue(thin.editor.ModuleElement.getStrokeValueFromType(properties['stroke-dash-type']));
    
    proppane.getPropertyControl('shape-id').setValue(properties['shape-id']);
    proppane.getPropertyControl('desc').setValue(properties['desc']);
  }, this);
};


/**
 * @param {Object} properties
 */
thin.editor.LineShape.prototype.setInitShapeProperties = function(properties) {

  var coordinate = properties.COORDINATE;
  var y1 = coordinate.y0;
  var y2 = coordinate.y1;
  this.setX1(coordinate.x0);
  this.setX2(coordinate.x1);
  this.setY1(y1);
  this.setY2(y2);
  this.calculateDirection(y1, y2);
  this.setBounds(properties.BOUNDS);
};


/** @inheritDoc */
thin.editor.LineShape.prototype.disposeInternal = function() {
  thin.editor.LineShape.superClass_.disposeInternal.call(this);
  this.disposeInternalForShape();
};
