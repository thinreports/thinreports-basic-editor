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

goog.provide('thin.editor.ImageblockShape');
goog.provide('thin.editor.ImageblockShape.PositionX');
goog.provide('thin.editor.ImageblockShape.PositionY');
goog.provide('thin.editor.ImageblockShape.ClassIds');

goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('goog.graphics.SvgImageElement');
goog.require('thin.editor.IdShape');
goog.require('thin.editor.AbstractBoxGroup');
goog.require('thin.editor.ModuleShape');
goog.require('thin.editor.TextStyle');
goog.require('thin.editor.TextStyle.HorizonAlignType');
goog.require('thin.editor.TextStyle.VerticalAlignType');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.AbstractBoxGroup}
 */
thin.editor.ImageblockShape = function(element, layout) {
  goog.base(this, element, layout);
  
  this.setCss(thin.editor.ImageblockShape.CLASSID);
};
goog.inherits(thin.editor.ImageblockShape, thin.editor.AbstractBoxGroup);
goog.mixin(thin.editor.ImageblockShape.prototype, thin.editor.ModuleShape.prototype);


/**
 * @type {string}
 */
thin.editor.ImageblockShape.CLASSID = 's-iblock';


/**
 * @enum {string}
 */
thin.editor.ImageblockShape.ClassIds = {
  BOX: '-box',
  ID: '-id',
  MARK: '-mark'
};


/**
 * @enum {string|number}
 * @private
 */
thin.editor.ImageblockShape.Mark_ = {
  SOURCE: 'assets/icons/x-image-mark.png',
  SIZE: 32
};


/**
 * @enum {string}
 */
thin.editor.ImageblockShape.PositionX = {
  DEFAULT: 'left',
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right'
};


/**
 * @enum {string}
 */
thin.editor.ImageblockShape.PositionY = {
  DEFAULT: 'top',
  TOP: 'top',
  CENTER: 'center',
  BOTTOM: 'bottom'
};


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.editor.ImageblockShape.IDSHAPEFILL_ = new goog.graphics.SolidFill('#7C4007');


/**
 * @type {goog.graphics.Font}
 * @private
 */
thin.editor.ImageblockShape.IDSHAPEFONT_ = new goog.graphics.Font(11, 'Helvetica');


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.editor.ImageblockShape.BOX_FILL_ = new goog.graphics.SolidFill('#f4e2c4', 0.8);


/**
 * @type {goog.graphics.Stroke}
 * @private
 */
thin.editor.ImageblockShape.BOX_STROKE_ = new goog.graphics.Stroke(0.28, '#7C4007');


/**
 * @type {thin.editor.IdShape}
 * @private
 */
thin.editor.ImageblockShape.prototype.id_;


/**
 * @type {goog.graphics.SvgImageElement}
 * @private
 */
thin.editor.ImageblockShape.prototype.mark_;


/**
 * @type {string|thin.editor.ImageblockShape.PositionX}
 * @private
 */
thin.editor.ImageblockShape.prototype.positionX_ =
  thin.editor.ImageblockShape.PositionX.DEFAULT;


/**
 * @type {string|thin.editor.ImageblockShape.PositionY}
 * @private
 */
thin.editor.ImageblockShape.prototype.positionY_ = 
  thin.editor.ImageblockShape.PositionY.DEFAULT;


/**
 * @return {string}
 */
thin.editor.ImageblockShape.prototype.getClassId = function() {
  return thin.editor.ImageblockShape.CLASSID;
};


/**
 * @param {string|thin.editor.ImageblockShape.PositionX} position
 */
thin.editor.ImageblockShape.prototype.setPositionX = function(position) {
  this.positionX_ = position || thin.editor.ImageblockShape.PositionX.DEFAULT;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-position-x': this.positionX_
  });
};


/**
 * @param {string|thin.editor.ImageblockShape.PositionY} position
 */
thin.editor.ImageblockShape.prototype.setPositionY = function(position) {
  this.positionY_ = position || thin.editor.ImageblockShape.PositionY.DEFAULT;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-position-y': this.positionY_
  });
};


/**
 * @return {string|thin.editor.ImageblockShape.PositionX}
 */
thin.editor.ImageblockShape.prototype.getPositionX = function() {
  return this.positionX_;
};


/**
 * @return {string|thin.editor.ImageblockShape.PositionY}
 */
thin.editor.ImageblockShape.prototype.getPositionY = function() {
  return this.positionY_;
};


/** @inheritDoc */
thin.editor.ImageblockShape.prototype.setLeft = function(left) {
  goog.base(this, 'setLeft', left);
  
  this.id_.setLeft(this.left_ + 2);
  this.updateMarkStyle_();
};


/** @inheritDoc */
thin.editor.ImageblockShape.prototype.setTop = function(top) {
  goog.base(this, 'setTop', top);
  
  this.id_.setTop(this.top_ + 11);
  this.updateMarkStyle_();
};


/** @inheritDoc */
thin.editor.ImageblockShape.prototype.setWidth = function(width) {
  goog.base(this, 'setWidth', width);
  this.updateMarkStyle_();
};


/** @inheritDoc */
thin.editor.ImageblockShape.prototype.setHeight = function(height) {
  goog.base(this, 'setHeight', height);
  this.updateMarkStyle_();
};


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {thin.editor.ShapeIdManager=} opt_shapeIdManager
 * @return {thin.editor.ImageblockShape}
 */
thin.editor.ImageblockShape.createFromElement = function(element, layout, opt_shapeIdManager) {
  var shape = new thin.editor.ImageblockShape(element, layout);
  
  shape.setShapeId(layout.getElementAttribute(element, 'x-id'), opt_shapeIdManager);
  shape.setDisplay(layout.getElementAttribute(element, 'x-display') == 'true');
  shape.setDesc(layout.getElementAttribute(element, 'x-desc'));
  shape.setPositionX(layout.getElementAttribute(element, 'x-position-x'));
  shape.setPositionY(layout.getElementAttribute(element, 'x-position-y'));
  shape.initIdentifier();

  return shape;
};


/**
 * @param {Element=} opt_element
 * @return {thin.editor.Box}
 * @private
 */
thin.editor.ImageblockShape.prototype.createBox_ = function(opt_element) {
  var box = goog.base(this, 'createBox_', opt_element,
    !opt_element ? this.getBoxClassId_() : undefined);
  
  box.setStroke(thin.editor.ImageblockShape.BOX_STROKE_);
  box.setFill(thin.editor.ImageblockShape.BOX_FILL_);
  
  return box;
};


/**
 * @param {Element=} opt_element
 * @return {thin.editor.IdShape}
 * @private
 */
thin.editor.ImageblockShape.prototype.createId_ = function(opt_element) {
  var layout = this.getLayout();
  var font = thin.editor.ImageblockShape.IDSHAPEFONT_;
  var element = opt_element ||
    layout.createSvgElement('text', {
      'class': this.getIdClassId_(),
      'font-size': font.size,
      'font-family': font.family,
      'font-weight': 'normal',
      'font-style': 'normal',
      'text-decoration': 'none',
      'text-anchor': thin.editor.TextStyle.HorizonAlignType.START,
      'kerning': thin.editor.TextStyle.DEFAULT_ELEMENT_KERNING
    });

  return new thin.editor.IdShape(element, layout, null, 
                  thin.editor.ImageblockShape.IDSHAPEFILL_);
};


/**
 * @param {Element=} opt_element
 * @return {goog.graphics.SvgImageElement}
 * @private
 */
thin.editor.ImageblockShape.prototype.createMark_ = function(opt_element) {
  var layout = this.getLayout();
  var mark = new goog.graphics.SvgImageElement(
    opt_element || layout.createSvgElement('image'), layout);
  
  if (!opt_element) {
    var element = mark.getElement();
    var config = thin.editor.ImageblockShape.Mark_;
    
    mark.setSize(/** @type {number} */ (config.SIZE), /** @type {number} */ (config.SIZE));
    layout.setElementAttributes(mark.getElement(), {'class': this.getMarkClassId_(), 'opacity': 0.5});
    layout.setElementAttributesNS(thin.editor.Layout.SVG_NS_XLINK, mark.getElement(),
      {'xlink:href': config.SOURCE});
  }
  
  return mark;
};


thin.editor.ImageblockShape.prototype.updateMarkStyle_ = function() {
  var config = thin.editor.ImageblockShape.Mark_;
  var basis = config.SIZE / 2;
  var layout = this.getLayout();
  
  var w = this.getWidth();
  var h = this.getHeight();
  var x = this.getLeft();
  var y = this.getTop();
  
  if (h < config.SIZE + 5 || w < config.SIZE + 5) {
    layout.setElementAttributes(this.mark_.getElement(), {'display': 'none'});
  } else if (layout.getElementAttribute(this.mark_.getElement(), 'display') == 'none') {
    layout.setElementAttributes(this.mark_.getElement(), {'display': 'inline'});
  }
  
  this.mark_.setPosition(x + Math.floor(w / 2) - basis - this.getParentTransLateX(),
                         y + Math.floor(h / 2) - basis - this.getParentTransLateY());
};


/**
 * @return {string}
 * @private
 */
thin.editor.ImageblockShape.prototype.getBoxClassId_ = function() {
  return thin.editor.ImageblockShape.CLASSID +
         thin.editor.ImageblockShape.ClassIds.BOX;
};


/**
 * @return {string}
 * @private
 */
thin.editor.ImageblockShape.prototype.getMarkClassId_ = function() {
  return thin.editor.ImageblockShape.CLASSID +
         thin.editor.ImageblockShape.ClassIds.MARK;
};


/**
 * @return {string}
 * @private
 */
thin.editor.ImageblockShape.prototype.getIdClassId_ = function() {
  return thin.editor.ImageblockShape.CLASSID +
         thin.editor.ImageblockShape.ClassIds.ID;  
};


/** @inheritDoc */
thin.editor.ImageblockShape.prototype.setup = function() {
  var element = this.getElement();
  var layout = this.getLayout();
  
  // Setup Box element.
  var boxElement = thin.editor.getElementByClassNameForChildNodes(
    this.getBoxClassId_(), element.childNodes);

  this.box_ = this.createBox_(boxElement);
  if (!boxElement) {
    layout.appendChild(this.box_, this);
  }
  
  // Setup Mark element.
  var markElement = thin.editor.getElementByClassNameForChildNodes(
    this.getMarkClassId_(), element.childNodes);
  
  this.mark_ = this.createMark_(markElement);
  if (!markElement) {
    layout.appendChild(this.mark_, this);
  }
  
  // Setup ID element.
  var idElement = thin.editor.getElementByClassNameForChildNodes(
    this.getIdClassId_(), element.childNodes);
  
  this.id_ = this.createId_(idElement);
  if (!idElement) {
    layout.appendChild(this.id_, this);
  }
};


thin.editor.ImageblockShape.prototype.setDefaultOutline = function() {
  this.setTargetOutline(this.getLayout().getHelpers().getImageblockOutline());
};


/**
 * @param {string} shapeId
 * @param {thin.editor.ShapeIdManager=} opt_shapeIdManager
 */
thin.editor.ImageblockShape.prototype.setShapeId = function(shapeId, opt_shapeIdManager) {
  if (!thin.isExactlyEqual(shapeId, thin.editor.ModuleShape.DEFAULT_SHAPEID)) {
    this.id_.setText(shapeId);
    this.setShapeId_(shapeId, opt_shapeIdManager);
  }
};


/**
 * @param {thin.editor.Helpers} helpers
 * @param {thin.editor.MultiOutlineHelper} multiOutlineHelper
 */
thin.editor.ImageblockShape.prototype.toOutline = function(helpers, multiOutlineHelper) {
  multiOutlineHelper.toImageblockOutline(this, helpers);
};


/**
 * @return {Function}
 */
thin.editor.ImageblockShape.prototype.getCloneCreator = function() {
  var sourceCoordinate = new goog.math.Coordinate(this.getLeft(), this.getTop()).clone();
  var deltaCoordinateForList = this.getDeltaCoordinateForList().clone();
  var deltaCoordinateForGuide = this.getDeltaCoordinateForGuide().clone();

  var width = this.getWidth();
  var height = this.getHeight();
  var posX = this.getPositionX();
  var posY = this.getPositionY();
  var display = this.getDisplay();
  var shapeIdPrefix = thin.editor.ShapeIdManager.getShapeIdPrefix(this.getShapeId());
  var isAffiliationListShape = this.isAffiliationListShape();
  var deltaCoordinate = this.getDeltaCoordinateForList();

  /**
   * @param {thin.editor.Layout} layout
   * @param {boolean=} opt_isAdaptDeltaForList
   * @param {goog.graphics.SvgGroupElement=} opt_renderTo
   * @param {goog.math.Coordinate=} opt_basisCoordinate
   * @param {thin.editor.ShapeIdManager=} opt_shapeIdManager
   * @return {thin.editor.ImageblockShape}
   */
  return function(layout, opt_isAdaptDeltaForList, opt_renderTo,
            opt_basisCoordinate, opt_shapeIdManager) {

    var shape = layout.createImageblockShape();
    layout.appendChild(shape, opt_renderTo);
    shape.setShapeId(layout.getNextShapeId(shapeIdPrefix, 
                     opt_shapeIdManager), opt_shapeIdManager);
    
    var pasteCoordinate = layout.calculatePasteCoordinate(isAffiliationListShape,
      deltaCoordinateForList, deltaCoordinateForGuide, sourceCoordinate,
      opt_isAdaptDeltaForList, opt_renderTo, opt_basisCoordinate);
    shape.setBounds(new goog.math.Rect(pasteCoordinate.x, pasteCoordinate.y, width, height));
    
    shape.setPositionX(posX);
    shape.setPositionY(posY);
    shape.setDisplay(display);
    
    return shape;
  };
};


/**
 * @private
 */
thin.editor.ImageblockShape.prototype.createPropertyComponent_ = function() {
  var scope = this;
  var layout = this.getLayout();
  var workspace = layout.getWorkspace();
  var guide = layout.getHelpers().getGuideHelper();
  
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


  var positionGroup = proppane.addGroup(thin.t('property_group_position'));
  
  var positionX = thin.editor.ImageblockShape.PositionX;
  var posXSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_horizontal_position'));
  var posXSelect = posXSelectProperty.getValueControl();
  
  posXSelect.setTextAlignLeft();
  posXSelect.addItem(new thin.ui.Option(thin.t('label_left_position'), positionX.LEFT));
  posXSelect.addItem(new thin.ui.Option(thin.t('label_center_position'), positionX.CENTER));
  posXSelect.addItem(new thin.ui.Option(thin.t('label_right_position'), positionX.RIGHT));
  posXSelect.setValue(positionX.DEFAULT);

  posXSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var posX = e.target.getValue();
        var capturePosX = scope.getPositionX();
        
        workspace.normalVersioning(function(version) {
          version.upHandler(function() {
            this.setPositionX(posX);
            proppane.getPropertyControl('position-x').setValue(posX);
          }, scope);
          version.downHandler(function() {
            this.setPositionX(capturePosX);
            proppane.getPropertyControl('position-x').setValue(capturePosX);
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(posXSelectProperty , positionGroup, 'position-x');
  
  var positionY = thin.editor.ImageblockShape.PositionY;
  var posYSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_vertical_position'));
  var posYSelect = posYSelectProperty.getValueControl();
  
  posYSelect.setTextAlignLeft();
  posYSelect.addItem(new thin.ui.Option(thin.t('label_top_position'), positionY.TOP));
  posYSelect.addItem(new thin.ui.Option(thin.t('label_middle_position'), positionY.CENTER));
  posYSelect.addItem(new thin.ui.Option(thin.t('label_bottom_position'), positionY.BOTTOM));
  posYSelect.setValue(positionY.DEFAULT);

  posYSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var posY = e.target.getValue();
        var capturePosY = scope.getPositionY();
        
        workspace.normalVersioning(function(version) {
          version.upHandler(function() {
            this.setPositionY(posY);
            proppane.getPropertyControl('position-y').setValue(posY);
          }, scope);
          version.downHandler(function() {
            this.setPositionY(capturePosY);
            proppane.getPropertyControl('position-y').setValue(capturePosY);
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(posYSelectProperty , positionGroup, 'position-y');
  
  var cooperationGroup = proppane.addGroup(thin.t('property_group_association'));
  
  var idInputProperty = new thin.ui.PropertyPane.IdInputProperty(this, 'ID');
  idInputProperty.getIdValidator().setValidatePresence(true);
  
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
thin.editor.ImageblockShape.prototype.getProperties = function() {
  return {
    'left': this.getLeft(),
    'top': this.getTop(),
    'width': this.getWidth(),
    'height': this.getHeight(),
    'display': this.getDisplay(),
    'shape-id': this.getShapeId(),
    'position-x': this.getPositionX(),
    'position-y': this.getPositionY(),
    'desc': this.getDesc()
  };
};


thin.editor.ImageblockShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
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
  proppane.getPropertyControl('position-x').setValue(properties['position-x']);
  proppane.getPropertyControl('position-y').setValue(properties['position-y']);
  proppane.getPropertyControl('shape-id').setValue(properties['shape-id']);
  proppane.getPropertyControl('desc').setValue(properties['desc']);
};


/**
 * @param {Object} properties
 */
thin.editor.ImageblockShape.prototype.setInitShapeProperties = function(properties) {
  var opt_shapeIdManager;
  if (this.isAffiliationListShape()) {
    opt_shapeIdManager = this.getAffiliationSectionShape().getManager().getShapeIdManager();
  }
  
  this.setShapeId(this.getLayout().getNextShapeId(
        thin.editor.ShapeIdManager.DefaultPrefix.IMAGE_BLOCK, opt_shapeIdManager),
        opt_shapeIdManager);
  this.setBounds(properties.BOUNDS);
};


/** @inheritDoc */
thin.editor.ImageblockShape.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.disposeInternalForShape();
  
  this.id_.dispose();
  delete this.id_;
  
  delete this.positionX_;
  delete this.positionY_;
};
