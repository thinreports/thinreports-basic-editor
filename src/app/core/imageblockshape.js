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

goog.provide('thin.core.ImageblockShape');
goog.provide('thin.core.ImageblockShape.PositionX');
goog.provide('thin.core.ImageblockShape.PositionY');
goog.provide('thin.core.ImageblockShape.ClassIds');

goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('goog.graphics.SvgImageElement');
goog.require('thin.core.IdShape');
goog.require('thin.core.AbstractBoxGroup');
goog.require('thin.core.ModuleShape');
goog.require('thin.core.TextStyle');
goog.require('thin.core.TextStyle.HorizonAlignType');
goog.require('thin.core.TextStyle.VerticalAlignType');


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {thin.core.AbstractBoxGroup}
 */
thin.core.ImageblockShape = function(element, layout) {
  goog.base(this, element, layout);

  this.setCss(thin.core.ImageblockShape.CLASSID);
};
goog.inherits(thin.core.ImageblockShape, thin.core.AbstractBoxGroup);
goog.mixin(thin.core.ImageblockShape.prototype, thin.core.ModuleShape.prototype);


/**
 * @type {string}
 */
thin.core.ImageblockShape.CLASSID = 's-iblock';


/**
 * @enum {string}
 */
thin.core.ImageblockShape.ClassIds = {
  BOX: '-box',
  ID: '-id',
  MARK: '-mark'
};


/**
 * @enum {string|number}
 * @private
 */
thin.core.ImageblockShape.Mark_ = {
  SOURCE: 'assets/icons/x-image-mark.png',
  SIZE: 32
};


/**
 * @enum {string}
 */
thin.core.ImageblockShape.PositionX = {
  DEFAULT: 'left',
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right'
};


/**
 * @enum {string}
 */
thin.core.ImageblockShape.PositionY = {
  DEFAULT: 'top',
  TOP: 'top',
  CENTER: 'center',
  BOTTOM: 'bottom'
};


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.core.ImageblockShape.IDSHAPEFILL_ = new goog.graphics.SolidFill('#0096fd');


/**
 * @type {goog.graphics.Font}
 * @private
 */
thin.core.ImageblockShape.IDSHAPEFONT_ = new goog.graphics.Font(10, 'Helvetica');


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.core.ImageblockShape.BOX_FILL_ = new goog.graphics.SolidFill('#0096fd', 0.1);


/**
 * @type {goog.graphics.Stroke}
 * @private
 */
thin.core.ImageblockShape.BOX_STROKE_ = new goog.graphics.Stroke(0.5, '#0096fd');


/**
 * @type {thin.core.IdShape}
 * @private
 */
thin.core.ImageblockShape.prototype.id_;


/**
 * @type {goog.graphics.SvgImageElement}
 * @private
 */
thin.core.ImageblockShape.prototype.mark_;


/**
 * @type {string|thin.core.ImageblockShape.PositionX}
 * @private
 */
thin.core.ImageblockShape.prototype.positionX_ =
  thin.core.ImageblockShape.PositionX.DEFAULT;


/**
 * @type {string|thin.core.ImageblockShape.PositionY}
 * @private
 */
thin.core.ImageblockShape.prototype.positionY_ =
  thin.core.ImageblockShape.PositionY.DEFAULT;


/**
 * @return {string}
 */
thin.core.ImageblockShape.prototype.getClassId = function() {
  return thin.core.ImageblockShape.CLASSID;
};


/**
 * @param {string|thin.core.ImageblockShape.PositionX} position
 */
thin.core.ImageblockShape.prototype.setPositionX = function(position) {
  this.positionX_ = position || thin.core.ImageblockShape.PositionX.DEFAULT;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-position-x': this.positionX_
  });
};


/**
 * @param {string|thin.core.ImageblockShape.PositionY} position
 */
thin.core.ImageblockShape.prototype.setPositionY = function(position) {
  this.positionY_ = position || thin.core.ImageblockShape.PositionY.DEFAULT;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-position-y': this.positionY_
  });
};


/**
 * @return {string|thin.core.ImageblockShape.PositionX}
 */
thin.core.ImageblockShape.prototype.getPositionX = function() {
  return this.positionX_;
};


/**
 * @return {string|thin.core.ImageblockShape.PositionY}
 */
thin.core.ImageblockShape.prototype.getPositionY = function() {
  return this.positionY_;
};


/** @inheritDoc */
thin.core.ImageblockShape.prototype.setLeft = function(left) {
  goog.base(this, 'setLeft', left);

  this.id_.setLeft(this.left_ + 4);
  this.updateMarkStyle_();
};


/** @inheritDoc */
thin.core.ImageblockShape.prototype.setTop = function(top) {
  goog.base(this, 'setTop', top);

  this.id_.setTop(this.top_ + 11);
  this.updateMarkStyle_();
};


/** @inheritDoc */
thin.core.ImageblockShape.prototype.setWidth = function(width) {
  goog.base(this, 'setWidth', width);
  this.updateMarkStyle_();
};


/** @inheritDoc */
thin.core.ImageblockShape.prototype.setHeight = function(height) {
  goog.base(this, 'setHeight', height);
  this.updateMarkStyle_();
};


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
 * @return {thin.core.ImageblockShape}
 */
thin.core.ImageblockShape.createFromElement = function(element, layout, opt_shapeIdManager) {
  var shape = new thin.core.ImageblockShape(element, layout);

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
 * @return {thin.core.Box}
 * @private
 */
thin.core.ImageblockShape.prototype.createBox_ = function(opt_element) {
  var box = goog.base(this, 'createBox_', opt_element,
    !opt_element ? this.getBoxClassId_() : undefined);

  box.setStroke(thin.core.ImageblockShape.BOX_STROKE_);
  box.setFill(thin.core.ImageblockShape.BOX_FILL_);

  return box;
};


/**
 * @param {Element=} opt_element
 * @return {thin.core.IdShape}
 * @private
 */
thin.core.ImageblockShape.prototype.createId_ = function(opt_element) {
  var layout = this.getLayout();
  var font = thin.core.ImageblockShape.IDSHAPEFONT_;
  var element = opt_element ||
    layout.createSvgElement('text', {
      'class': this.getIdClassId_(),
      'font-size': font.size,
      'font-family': font.family,
      'font-weight': 'normal',
      'font-style': 'normal',
      'text-decoration': 'none',
      'text-anchor': thin.core.TextStyle.HorizonAlignType.START,
      'kerning': thin.core.TextStyle.DEFAULT_ELEMENT_KERNING
    });

  return new thin.core.IdShape(element, layout, null,
                  thin.core.ImageblockShape.IDSHAPEFILL_);
};


/**
 * @param {Element=} opt_element
 * @return {goog.graphics.SvgImageElement}
 * @private
 */
thin.core.ImageblockShape.prototype.createMark_ = function(opt_element) {
  var layout = this.getLayout();
  var mark = new goog.graphics.SvgImageElement(
    opt_element || layout.createSvgElement('image'), layout);

  if (!opt_element) {
    var element = mark.getElement();
    var config = thin.core.ImageblockShape.Mark_;

    mark.setSize(/** @type {number} */ (config.SIZE), /** @type {number} */ (config.SIZE));
    layout.setElementAttributes(mark.getElement(), {'class': this.getMarkClassId_(), 'opacity': 0.5});
    layout.setElementAttributesNS(thin.core.Layout.SVG_NS_XLINK, mark.getElement(),
      {'xlink:href': config.SOURCE});
  }

  return mark;
};


thin.core.ImageblockShape.prototype.updateMarkStyle_ = function() {
  var config = thin.core.ImageblockShape.Mark_;
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
thin.core.ImageblockShape.prototype.getBoxClassId_ = function() {
  return thin.core.ImageblockShape.CLASSID +
         thin.core.ImageblockShape.ClassIds.BOX;
};


/**
 * @return {string}
 * @private
 */
thin.core.ImageblockShape.prototype.getMarkClassId_ = function() {
  return thin.core.ImageblockShape.CLASSID +
         thin.core.ImageblockShape.ClassIds.MARK;
};


/**
 * @return {string}
 * @private
 */
thin.core.ImageblockShape.prototype.getIdClassId_ = function() {
  return thin.core.ImageblockShape.CLASSID +
         thin.core.ImageblockShape.ClassIds.ID;
};


/** @inheritDoc */
thin.core.ImageblockShape.prototype.setup = function() {
  var element = this.getElement();
  var layout = this.getLayout();

  // Setup Box element.
  var boxElement = thin.core.getElementByClassNameForChildNodes(
    this.getBoxClassId_(), element.childNodes);

  this.box_ = this.createBox_(boxElement);
  if (!boxElement) {
    layout.appendChild(this.box_, this);
  }

  // Setup Mark element.
  var markElement = thin.core.getElementByClassNameForChildNodes(
    this.getMarkClassId_(), element.childNodes);

  this.mark_ = this.createMark_(markElement);
  if (!markElement) {
    layout.appendChild(this.mark_, this);
  }

  // Setup ID element.
  var idElement = thin.core.getElementByClassNameForChildNodes(
    this.getIdClassId_(), element.childNodes);

  this.id_ = this.createId_(idElement);
  if (!idElement) {
    layout.appendChild(this.id_, this);
  }
};


thin.core.ImageblockShape.prototype.setDefaultOutline = function() {
  this.setTargetOutline(this.getLayout().getHelpers().getImageblockOutline());
};


/**
 * @param {string} shapeId
 * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
 */
thin.core.ImageblockShape.prototype.setShapeId = function(shapeId, opt_shapeIdManager) {
  if (!thin.isExactlyEqual(shapeId, thin.core.ModuleShape.DEFAULT_SHAPEID)) {
    this.id_.setText(shapeId);
    this.setShapeId_(shapeId, opt_shapeIdManager);
  }
};


/**
 * @param {thin.core.Helpers} helpers
 * @param {thin.core.MultiOutlineHelper} multiOutlineHelper
 */
thin.core.ImageblockShape.prototype.toOutline = function(helpers, multiOutlineHelper) {
  multiOutlineHelper.toImageblockOutline(this, helpers);
};


/**
 * @return {Function}
 */
thin.core.ImageblockShape.prototype.getCloneCreator = function() {
  var sourceCoordinate = new goog.math.Coordinate(this.getLeft(), this.getTop()).clone();
  var deltaCoordinateForList = this.getDeltaCoordinateForList().clone();
  var deltaCoordinateForGuide = this.getDeltaCoordinateForGuide().clone();

  var width = this.getWidth();
  var height = this.getHeight();
  var posX = this.getPositionX();
  var posY = this.getPositionY();
  var display = this.getDisplay();
  var shapeIdPrefix = thin.core.ShapeIdManager.getShapeIdPrefix(this.getShapeId());
  var isAffiliationListShape = this.isAffiliationListShape();
  var deltaCoordinate = this.getDeltaCoordinateForList();

  /**
   * @param {thin.core.Layout} layout
   * @param {boolean=} opt_isAdaptDeltaForList
   * @param {goog.graphics.SvgGroupElement=} opt_renderTo
   * @param {goog.math.Coordinate=} opt_basisCoordinate
   * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
   * @return {thin.core.ImageblockShape}
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
thin.core.ImageblockShape.prototype.createPropertyComponent_ = function() {
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

  var positionX = thin.core.ImageblockShape.PositionX;
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

  var positionY = thin.core.ImageblockShape.PositionY;
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
thin.core.ImageblockShape.prototype.getProperties = function() {
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


thin.core.ImageblockShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }

  var properties = this.getProperties();
  var proppaneBlank = thin.core.ModuleShape.PROPPANE_SHOW_BLANK;

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
thin.core.ImageblockShape.prototype.setInitShapeProperties = function(properties) {
  var opt_shapeIdManager;
  if (this.isAffiliationListShape()) {
    opt_shapeIdManager = this.getAffiliationSectionShape().getManager().getShapeIdManager();
  }

  this.setShapeId(this.getLayout().getNextShapeId(
        thin.core.ShapeIdManager.DefaultPrefix.IMAGE_BLOCK, opt_shapeIdManager),
        opt_shapeIdManager);
  this.setBounds(properties.BOUNDS);
};


/** @inheritDoc */
thin.core.ImageblockShape.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.disposeInternalForShape();

  this.id_.dispose();
  delete this.id_;

  delete this.positionX_;
  delete this.positionY_;
};
