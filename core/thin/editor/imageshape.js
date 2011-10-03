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

goog.provide('thin.editor.ImageShape');

goog.require('goog.graphics.SvgImageElement');
goog.require('thin.core.File.Mode');
goog.require('thin.editor.ModuleElement');
goog.require('thin.editor.ModuleShape');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {goog.graphics.SvgImageElement}
 */
thin.editor.ImageShape = function(element, layout) {

  goog.graphics.SvgImageElement.call(this, element, layout);
  
  /**
   * @type {number}
   * @private
   */
  this.left_ = Number(layout.getElementAttribute(element, 'x'));
  
  /**
   * @type {number}
   * @private
   */
  this.top_ = Number(layout.getElementAttribute(element, 'y'));
  
  /**
   * @type {number}
   * @private
   */
  this.width_ = Number(layout.getElementAttribute(element, 'width'));
  
  /**
   * @type {number}
   * @private
   */
  this.height_ = Number(layout.getElementAttribute(element, 'height'));

  this.setCss(thin.editor.ImageShape.CLASSID);
};
goog.inherits(thin.editor.ImageShape, goog.graphics.SvgImageElement);
goog.mixin(thin.editor.ImageShape.prototype, thin.editor.ModuleElement.prototype);
goog.mixin(thin.editor.ImageShape.prototype, thin.editor.ModuleShape.prototype);


/**
 * @type {string}
 */
thin.editor.ImageShape.CLASSID = 's-image';


/**
 * @type {number}
 * @private
 */
thin.editor.ImageShape.prototype.naturalWidth_;


/**
 * @type {number}
 * @private
 */
thin.editor.ImageShape.prototype.naturalHeight_;


/**
 * @type {thin.editor.ImageFile}
 * @private
 */
thin.editor.ImageShape.prototype.file_;


/**
 * @return {string}
 */
thin.editor.ImageShape.prototype.getClassId = function() {
  return thin.editor.ImageShape.CLASSID;
};


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {thin.editor.ShapeIdManager=} opt_shapeIdManager
 * @return {thin.editor.ImageShape}
 */
thin.editor.ImageShape.createFromElement = function(element, layout, opt_shapeIdManager) {
  var shape = new thin.editor.ImageShape(element, layout);
  shape.setShapeId(layout.getElementAttribute(element, 'x-id'), opt_shapeIdManager);
  shape.setDisplay(layout.getElementAttribute(element, 'x-display') == 'true');
  shape.setDesc(layout.getElementAttribute(element, 'x-desc'));
  shape.setNaturalSize(Number(layout.getElementAttribute(element, 'x-natural-width')), 
                       Number(layout.getElementAttribute(element, 'x-natural-height')));
  
  return shape;
};


/**
 * @param {number} width
 * @param {number} height
 */
thin.editor.ImageShape.prototype.setNaturalSize = function(width, height) {
  this.naturalWidth_ = width;
  this.naturalHeight_ = height;
  
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-natural-width': width
  });
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-natural-height': height
  });
};


/**
 * @return {number}
 */
thin.editor.ImageShape.prototype.getNaturalWidth = function() {
  return this.naturalWidth_;
};


/**
 * @return {number}
 */
thin.editor.ImageShape.prototype.getNaturalHeight = function() {
  return this.naturalHeight_;
};


/**
 * @param {number} width
 * @param {number} height
 * @param {number=} opt_left
 * @param {number=} opt_top
 * @param {number=} opt_naturalWidth
 * @param {number=} opt_naturalHeight
 * @return {goog.math.Size}
 */
thin.editor.ImageShape.prototype.getAllowSize = function(width, height, opt_left, opt_top, 
                                                         opt_naturalWidth, opt_naturalHeight) {

  var allowWidth = this.getAllowWidth(width, opt_left);
  var allowHeight = this.getAllowHeight(height, opt_top);

  var naturalWidth = opt_naturalWidth || this.getNaturalWidth();
  var naturalHeight = opt_naturalHeight || this.getNaturalHeight();

  if (naturalWidth > naturalHeight) {
    var unlimitedHeight = thin.numberWithPrecision(allowWidth *
                            thin.numberWithPrecision(naturalHeight / naturalWidth, 2));

    var limitedHeight = this.getAllowHeight(unlimitedHeight, opt_top);
    return new goog.math.Size(thin.isExactlyEqual(limitedHeight, unlimitedHeight) ? allowWidth : 
             thin.numberWithPrecision(limitedHeight *
               thin.numberWithPrecision(naturalWidth / naturalHeight, 2)), limitedHeight);
    
  } else {
    var unlimitedWidth = thin.numberWithPrecision(allowHeight *
                           thin.numberWithPrecision(naturalWidth / naturalHeight, 2));

    var limitedWidth = this.getAllowWidth(unlimitedWidth, opt_left);
    return new goog.math.Size(limitedWidth, thin.isExactlyEqual(limitedWidth, unlimitedWidth) ? allowHeight : 
             thin.numberWithPrecision(limitedWidth *
               thin.numberWithPrecision(naturalHeight / naturalWidth, 2)));
  }
};


thin.editor.ImageShape.prototype.adjustToAllowSize = function() {
  var element = this.getElement();
  element.removeAttribute('width');
  element.removeAttribute('height');
  this.setNaturalSize(element.clientWidth, element.clientHeight);
  
  var allowSize = this.getAllowSize(this.getNaturalWidth(), this.getNaturalHeight());
  this.setWidth(allowSize.width);
  this.setHeight(allowSize.height);
};


/**
 * @param {string?} src
 */
thin.editor.ImageShape.prototype.setSource = function(src) {
  if (goog.isString(src)) {
    this.getElement().setAttributeNS(thin.editor.Layout.SVG_NS_XLINK, 'xlink:href', src);
  }
};


/**
 * @param {number} left
 */
thin.editor.ImageShape.prototype.setLeft = function(left) {
  left = thin.numberWithPrecision(left - this.getParentTransLateX());
  this.left_ = left;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x': left
  });
};


/**
 * @param {number} top
 */
thin.editor.ImageShape.prototype.setTop = function(top) {
  top = thin.numberWithPrecision(top - this.getParentTransLateY());
  this.top_ = top;
  this.getLayout().setElementAttributes(this.getElement(), {
    'y': top
  });
};


/**
 * @param {number} width
 */
thin.editor.ImageShape.prototype.setWidth = function(width) {
  width = thin.numberWithPrecision(width);
  this.width_ = width;
  this.getLayout().setElementAttributes(this.getElement(), {
    'width': width
  });
};


/**
 * @param {number} height
 */
thin.editor.ImageShape.prototype.setHeight = function(height) {
  height = thin.numberWithPrecision(height);
  this.height_ = height;
  this.getLayout().setElementAttributes(this.getElement(), {
    'height': height
  });
};


thin.editor.ImageShape.prototype.setDefaultOutline = function() {
  this.setTargetOutline(this.getLayout().getHelpers().getImageOutline());
};


/**
 * @param {thin.editor.Helpers} helpers
 * @param {thin.editor.MultiOutlineHelper} multiOutlineHelper
 */
thin.editor.ImageShape.prototype.toOutline = function(helpers, multiOutlineHelper) {
  multiOutlineHelper.toImageOutline(this, helpers);
};


/**
 * @return {Function}
 */
thin.editor.ImageShape.prototype.getCloneCreator = function() {

  var sourceCoordinate = new goog.math.Coordinate(this.getLeft(), this.getTop()).clone();
  var deltaCoordinateForList = this.getDeltaCoordinateForList().clone();
  var deltaCoordinateForGuide = this.getDeltaCoordinateForGuide().clone();

  var width = this.getWidth();
  var height = this.getHeight();
  var naturalWidth = this.getNaturalWidth();
  var naturalHeight = this.getNaturalHeight();
  var file = this.getFile().clone();
  var display = this.getDisplay();
 
  var isAffiliationListShape = this.isAffiliationListShape();
  var deltaCoordinate = this.getDeltaCoordinateForList();

  /**
   * @param {thin.editor.Layout} layout
   * @param {boolean=} opt_isAdaptDeltaForList
   * @param {goog.graphics.SvgGroupElement=} opt_renderTo
   * @param {goog.math.Coordinate=} opt_basisCoordinate
   * @return {thin.editor.ImageShape}
   */
  return function(layout, opt_isAdaptDeltaForList, opt_renderTo, opt_basisCoordinate) {
    
    var shape = layout.createImageShape();
    layout.appendChild(shape, opt_renderTo);
    
    var pasteCoordinate = layout.calculatePasteCoordinate(isAffiliationListShape,
          deltaCoordinateForList, deltaCoordinateForGuide, sourceCoordinate,
          opt_isAdaptDeltaForList, opt_renderTo, opt_basisCoordinate);
    
    shape.setFile(file);
    shape.setNaturalSize(naturalWidth, naturalHeight);
    shape.setBounds(new goog.math.Rect(pasteCoordinate.x, pasteCoordinate.y, width, height));
    shape.setDisplay(display);
    return shape;
  };
};


/**
 * @private
 */
thin.editor.ImageShape.prototype.createPropertyComponent_ = function() {
  
  var scope = this;
  var layout = this.getLayout();
  var guide = layout.getHelpers().getGuideHelper();
  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');
  
  var baseGroup = proppane.addGroup('基本');
  
  
  var leftInputProperty = new thin.ui.PropertyPane.NumberInputProperty('左位置');
  var leftInput = leftInputProperty.getValueControl();
  leftInput.getNumberValidator().setAllowDecimal(true, 1);
  
  leftInputProperty.addEventListener(propEventType.CHANGE,
      this.setLeftForPropertyUpdate, false, this);
  
  proppane.addProperty(leftInputProperty, baseGroup, 'left');


  var topInputProperty = new thin.ui.PropertyPane.NumberInputProperty('上位置');
  var topInput = topInputProperty.getValueControl();
  topInput.getNumberValidator().setAllowDecimal(true, 1);
  
  topInputProperty.addEventListener(propEventType.CHANGE,
      this.setTopForPropertyUpdate, false, this);
  
  proppane.addProperty(topInputProperty, baseGroup, 'top');
  
  
  var widthInputProperty = new thin.ui.PropertyPane.NumberInputProperty('幅');
  var widthInput = widthInputProperty.getValueControl();
  widthInput.getNumberValidator().setAllowDecimal(true, 1);
  
  widthInputProperty.addEventListener(propEventType.CHANGE,
      this.setWidthForPropertyUpdate, false, this);
  
  proppane.addProperty(widthInputProperty, baseGroup, 'width');
  
  
  var heightInputProperty = new thin.ui.PropertyPane.NumberInputProperty('高さ');
  var heightInput = heightInputProperty.getValueControl();
  heightInput.getNumberValidator().setAllowDecimal(true, 1);
  
  heightInputProperty.addEventListener(propEventType.CHANGE,
      this.setHeightForPropertyUpdate, false, this);
  
  proppane.addProperty(heightInputProperty, baseGroup, 'height');
  

  var displayCheckProperty = new thin.ui.PropertyPane.CheckboxProperty('表示');
  displayCheckProperty.addEventListener(propEventType.CHANGE,
      this.setDisplayForPropertyUpdate, false, this);
  
  proppane.addProperty(displayCheckProperty, baseGroup, 'display');
  

  var cooperationGroup = proppane.addGroup('連携');
  
  var idInputProperty = new thin.ui.PropertyPane.IdInputProperty(this, 'ID');
  idInputProperty.addEventListener(propEventType.CHANGE,
      this.setShapeIdForPropertyUpdate, false, this);
  
  proppane.addProperty(idInputProperty, cooperationGroup, 'shape-id');
  
  var descProperty = new thin.ui.PropertyPane.InputProperty('説明');
  descProperty.addEventListener(propEventType.CHANGE,
      this.setDescPropertyUpdate, false, this);
  
  proppane.addProperty(descProperty, cooperationGroup, 'desc');
};


/**
 * @return {Object}
 */
thin.editor.ImageShape.prototype.getProperties = function() {

  return {
    'left': this.getLeft(),
    'top': this.getTop(),
    'width': this.getWidth(),
    'height': this.getHeight(),
    'display': this.getDisplay(),
    'shape-id': this.getShapeId(),
    'desc': this.getDesc()
  };
};


thin.editor.ImageShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  proppane.updateAsync(function() {
    if (!proppane.isTarget(this)) {
      this.getLayout().updatePropertiesForEmpty();
      proppane.setTarget(this);
      this.createPropertyComponent_();
    }
    
    var properties = this.getProperties();
    proppane.getPropertyControl('left').setValue(properties['left']);
    proppane.getPropertyControl('top').setValue(properties['top']);
    proppane.getPropertyControl('width').setValue(properties['width']);
    proppane.getPropertyControl('height').setValue(properties['height']);
    proppane.getPropertyControl('display').setChecked(properties['display']);
    proppane.getPropertyControl('shape-id').setValue(properties['shape-id']);
    proppane.getPropertyControl('desc').setValue(properties['desc']);
  }, this);
};


/**
 * @param {Object} properties
 */
thin.editor.ImageShape.prototype.setInitShapeProperties = function(properties) {
  var coordinate = properties.POSITION;
  this.setLeft(coordinate.x);
  this.setTop(coordinate.y);
};


/**
 * @param {thin.editor.ImageFile} file
 */
thin.editor.ImageShape.prototype.setFileInternal = function(file) {
  if (goog.isDef(this.file_)) {
    delete this.file_;
  }
  this.file_ = file;
};


/**
 * @param {thin.editor.ImageFile} file
 */
thin.editor.ImageShape.prototype.setFile = function(file) {
  this.setFileInternal(file);
  this.setSource(file.getContent());
};


/**
 * @return {thin.editor.ImageFile}
 */
thin.editor.ImageShape.prototype.getFile = function() {
  if (!goog.isDef(this.file_)) {
    var file = new thin.editor.ImageFile(thin.core.File.open(
                        '', thin.core.File.Mode.IMAGE));
    file.setContent(/** @type {string} */(
        this.getLayout().getElementAttribute(this.getElement(), 'xlink:href')));
    this.setFileInternal(file);
  }
  
  return this.file_;
};


/** @inheritDoc */
thin.editor.ImageShape.prototype.disposeInternal = function() {
  thin.editor.ImageShape.superClass_.disposeInternal.call(this);
  this.disposeInternalForShape();
};