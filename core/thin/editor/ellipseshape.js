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

goog.provide('thin.editor.EllipseShape');

goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('thin.editor.Ellipse');
goog.require('thin.editor.ModuleShape');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @constructor
 * @extends {thin.editor.Ellipse}
 */
thin.editor.EllipseShape = function(element, layout, stroke, fill) {
  thin.editor.Ellipse.call(this, element, layout, stroke, fill);
  this.setCss(thin.editor.EllipseShape.CLASSID);
};
goog.inherits(thin.editor.EllipseShape, thin.editor.Ellipse);
goog.mixin(thin.editor.EllipseShape.prototype, thin.editor.ModuleShape.prototype);


/**
 * @type {string}
 */
thin.editor.EllipseShape.CLASSID = 's-ellipse';


/**
 * @type {goog.graphics.SolidFill}
 */
thin.editor.EllipseShape.DEFAULT_FILL = new goog.graphics.SolidFill('#FFFFFF');


/**
 * @type {goog.graphics.Stroke}
 */
thin.editor.EllipseShape.DEFAULT_STROKE = new goog.graphics.Stroke(1, '#000000');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {thin.editor.ShapeIdManager=} opt_shapeIdManager
 * @return {thin.editor.EllipseShape}
 */
thin.editor.EllipseShape.createFromElement = function(element, layout, opt_shapeIdManager) {
  var shape = new thin.editor.EllipseShape(element, layout, 
                new goog.graphics.Stroke(
                      Number(layout.getElementAttribute(element, 'stroke-width')),
                      layout.getElementAttribute(element, 'stroke')),
                new goog.graphics.SolidFill(layout.getElementAttribute(element, 'fill')));
  shape.setShapeId(layout.getElementAttribute(element, 'x-id'), opt_shapeIdManager);
  shape.setDisplay(layout.getElementAttribute(element, 'x-display') == 'true');
  shape.setStrokeDashFromType(layout.getElementAttribute(element, 'x-stroke-type'));
  return shape;
};


thin.editor.EllipseShape.prototype.setDefaultOutline = function() {
  this.setTargetOutline(this.getLayout().getHelpers().getEllipseOutline());
};


/**
 * @param {thin.editor.Helpers} helpers
 * @param {thin.editor.MultiOutlineHelper} multiOutlineHelper
 */
thin.editor.EllipseShape.prototype.toOutline = function(helpers, multiOutlineHelper) {
  multiOutlineHelper.toEllipseOutline(this, helpers);
};


/**
 * @return {Function}
 */
thin.editor.EllipseShape.prototype.getCloneCreator = function() {

  var sourceCoordinate = new goog.math.Coordinate(this.getLeft(), this.getTop());
  var deltaCoordinateForList = this.getDeltaCoordinateForList().clone();
  var deltaCoordinateForGuide = this.getDeltaCoordinateForGuide().clone();
  var width = this.getWidth();
  var height = this.getHeight();
  var strokeDashType = this.getStrokeDashType();
  var stroke = this.getStroke();
  var strokeWidth = this.getStrokeWidth();
  var fill = this.getFill();
  var display = this.getDisplay();
  var isAffiliationListShape = this.isAffiliationListShape();
  
  /**
   * @param {thin.editor.Layout} layout
   * @param {boolean=} opt_isAdaptDeltaForList
   * @param {goog.graphics.SvgGroupElement=} opt_renderTo
   * @param {goog.math.Coordinate=} opt_basisCoordinate
   * @return {thin.editor.EllipseShape}
   */
  return function(layout, opt_isAdaptDeltaForList, opt_renderTo, opt_basisCoordinate) {

    var shape = layout.createEllipseShape();
    layout.appendChild(shape, opt_renderTo);
    var pasteCoordinate = layout.calculatePasteCoordinate(
                            isAffiliationListShape, deltaCoordinateForList, deltaCoordinateForGuide,
                            sourceCoordinate, opt_isAdaptDeltaForList, opt_renderTo, opt_basisCoordinate);
    shape.setBounds(new goog.math.Rect(pasteCoordinate.x, pasteCoordinate.y, width, height).clone());

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
thin.editor.EllipseShape.prototype.createPropertyComponent_ = function() {
  var scope = this;
  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');
  
  var baseGroup = proppane.addGroup('基本');
  
  
  var leftInputProperty = new thin.ui.PropertyPane.InputProperty('左位置');
  var leftInput = leftInputProperty.getValueControl();
  
  var leftInputValidation = new thin.ui.Input.NumberValidator(this);
  leftInputValidation.setAllowDecimal(true, 1);
  leftInput.setValidator(leftInputValidation);
  leftInputProperty.addEventListener(propEventType.CHANGE,
      this.setLeftForPropertyUpdate, false, this);
  
  proppane.addProperty(leftInputProperty, baseGroup, 'left');


  var topInputProperty = new thin.ui.PropertyPane.InputProperty('上位置');
  var topInput = topInputProperty.getValueControl();

  var topInputValidation = new thin.ui.Input.NumberValidator(this);
  topInputValidation.setAllowDecimal(true, 1);
  topInput.setValidator(topInputValidation);
  topInputProperty.addEventListener(propEventType.CHANGE,
      this.setTopForPropertyUpdate, false, this);
  
  proppane.addProperty(topInputProperty, baseGroup, 'top');
  
  
  var widthInputProperty = new thin.ui.PropertyPane.InputProperty('幅');
  var widthInput = widthInputProperty.getValueControl();
  
  var widthInputValidation = new thin.ui.Input.NumberValidator(this);
  widthInputValidation.setAllowDecimal(true, 1);
  widthInput.setValidator(widthInputValidation);
  widthInputProperty.addEventListener(propEventType.CHANGE,
      this.setWidthForPropertyUpdate, false, this);
  
  proppane.addProperty(widthInputProperty, baseGroup, 'width');
  
  
  var heightInputProperty = new thin.ui.PropertyPane.InputProperty('高さ');
  var heightInput = heightInputProperty.getValueControl();

  var heightInputValidation = new thin.ui.Input.NumberValidator(this);
  heightInputValidation.setAllowDecimal(true, 1);
  heightInput.setValidator(heightInputValidation);
  heightInputProperty.addEventListener(propEventType.CHANGE,
      this.setHeightForPropertyUpdate, false, this);
  
  proppane.addProperty(heightInputProperty, baseGroup, 'height');
  
  
  var displayCheckProperty = new thin.ui.PropertyPane.CheckboxProperty('表示');
  displayCheckProperty.addEventListener(propEventType.CHANGE,
      this.setDisplayForPropertyUpdate, false, this);
  
  proppane.addProperty(displayCheckProperty, baseGroup, 'display');

  
  var shapeGroup = proppane.addGroup('図形');
  
  
  var fillInputProperty = new thin.ui.PropertyPane.ColorProperty('塗り');
  fillInputProperty.getValueControl().getInput().setLabel('none');
  fillInputProperty.addEventListener(propEventType.CHANGE,
      this.setFillForPropertyUpdate, false, this);
  
  proppane.addProperty(fillInputProperty , shapeGroup, 'fill');
  
  
  var strokeInputProperty = new thin.ui.PropertyPane.ColorProperty('線の色');
  strokeInputProperty.getValueControl().getInput().setLabel('none');
  strokeInputProperty.addEventListener(propEventType.CHANGE,
      this.setStrokeForPropertyUpdate, false, this);
  
  proppane.addProperty(strokeInputProperty , shapeGroup, 'stroke');
  
  
  var strokeWidthCombProperty = new thin.ui.PropertyPane.ComboBoxProperty('線の幅');
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
  var strokeDashSelectProperty = new thin.ui.PropertyPane.SelectProperty('線の種類');
  var strokeDashSelect = strokeDashSelectProperty.getValueControl();
  strokeDashSelect.setTextAlignLeft();
  strokeDashSelect.addItem(new thin.ui.Option(strokeDashTypeName.SOLID));
  strokeDashSelect.addItem(new thin.ui.Option(strokeDashTypeName.DASHED));
  strokeDashSelect.addItem(new thin.ui.Option(strokeDashTypeName.DOTTED));
  
  strokeDashSelectProperty.addEventListener(propEventType.CHANGE,
      this.setStrokeDashTypeForPropertyUpdate, false, this);
  
  proppane.addProperty(strokeDashSelectProperty , shapeGroup, 'stroke-dash-type');


  var cooperationGroup = proppane.addGroup('連携');
  
  var idInputProperty = new thin.ui.PropertyPane.IdInputProperty(this, 'ID');
  idInputProperty.addEventListener(propEventType.CHANGE,
      this.setShapeIdForPropertyUpdate, false, this);
  
  proppane.addProperty(idInputProperty, cooperationGroup, 'shape-id');
};


/**
 * @return {Object}
 */
thin.editor.EllipseShape.prototype.getProperties = function() {

  return {
    'left': this.getLeft(),
    'top': this.getTop(),
    'width': this.getWidth(),
    'height': this.getHeight(),
    'display': this.getDisplay(),
    'fill': this.getFill().getColor(),
    'stroke': this.getStroke().getColor(),
    'stroke-width': this.getStrokeWidth(),
    'stroke-dash-type': this.getStrokeDashType(),
    'shape-id': this.getShapeId()
  };
};


thin.editor.EllipseShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  proppane.updateAsync(function() {
    if (!proppane.isTarget(this)) {
      this.getLayout().updatePropertiesForEmpty();
      proppane.setTarget(this);
      this.createPropertyComponent_();
    }

    var properties = this.getProperties();
    var proppaneBlank = thin.editor.ModuleShape.PROPPANE_SHOW_BLANK;
    var noneColor = thin.editor.ModuleShape.NONE;
    
    proppane.getPropertyControl('left').setValue(properties['left']);
    proppane.getPropertyControl('top').setValue(properties['top']);
    proppane.getPropertyControl('width').setValue(properties['width']);
    proppane.getPropertyControl('height').setValue(properties['height']);
    proppane.getPropertyControl('display').setChecked(properties['display']);
    var fill = properties['fill'];
    if (thin.isExactlyEqual(fill, noneColor)) {
      fill = proppaneBlank
    }
    proppane.getPropertyControl('fill').setValue(fill);
    var stroke = properties['stroke'];
    if (thin.isExactlyEqual(stroke, noneColor)) {
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
  }, this);
};


/**
 * @param {Object} properties
 */
thin.editor.EllipseShape.prototype.setInitShapeProperties = function(properties) {
  var radius = properties.RADIUS;
  var center = properties.CENTER;
  this.setRadius(radius.x, radius.y);
  this.setCenter(center.x, center.y);
  this.setBounds(properties.BOUNDS);
};


/** @inheritDoc */
thin.editor.EllipseShape.prototype.disposeInternal = function() {
  thin.editor.EllipseShape.superClass_.disposeInternal.call(this);
  this.disposeInternalForShape();
};