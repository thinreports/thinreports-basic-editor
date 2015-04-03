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

goog.provide('thin.core.ListSectionHelper');
goog.provide('thin.core.HeaderSectionHelper');
goog.provide('thin.core.DetailSectionHelper');
goog.provide('thin.core.PageFooterSectionHelper');
goog.provide('thin.core.FooterSectionHelper');

goog.require('goog.dom');
goog.require('goog.array');
goog.require('goog.Disposable');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('goog.graphics.StrokeAndFillElement');
goog.require('thin.core.Cursor');
goog.require('thin.core.Cursor.Type');
goog.require('thin.core.TextShape');
goog.require('thin.core.TextStyle');
goog.require('thin.core.TextStyle.HorizonAlignType');
goog.require('thin.core.TextStyle.VerticalAlignType');
goog.require('thin.core.DrawActionLayer');
goog.require('thin.core.DraggableLine');
goog.require('thin.core.DraggableLine.Direction');
goog.require('thin.core.ModuleElement');
goog.require('thin.core.ModuleShape');


/**
 * @param {thin.core.Layout} layout
 * @param {string} sectionName
 * @constructor
 * @extends {goog.Disposable}
 */
thin.core.ListSectionHelper = function(layout, sectionName) {

  /**
   * @type {thin.core.Layout}
   * @private
   */
  this.layout_ = layout;

  /**
   * @type {string}
   * @private
   */
  this.sectionName_ = sectionName;

  /**
   * @type {thin.core.ListSectionHelper.Separator_}
   * @private
   */
  this.separator_ = new thin.core.ListSectionHelper.Separator_(layout);

  /**
   * @type {thin.core.Layer}
   * @private
   */
  this.drawLayer_ = this.createDrawLayer_();

  /**
   * @type {thin.core.Layer}
   * @private
   */
  this.selectorLayer_ = this.createSelectorLayer_();

  /**
   * @type {thin.core.TextShape}
   * @private
   */
  this.label_ = this.createSectionLabel_();
};
goog.inherits(thin.core.ListSectionHelper, goog.Disposable);
goog.mixin(thin.core.ListSectionHelper.prototype, thin.core.ModuleShape.prototype);


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.core.ListSectionHelper.FILL_ = new goog.graphics.SolidFill('#AAAAAA');


/**
 * @type {boolean}
 * @private
 */
thin.core.ListSectionHelper.prototype.active_ = false;


/**
 * @param {thin.core.Component=} opt_renderTo
 */
thin.core.ListSectionHelper.prototype.init = function(opt_renderTo) {
  var layout = this.layout_;
  var separator = this.separator_;
  var renderTo = opt_renderTo || layout.getHelpers().getListHelper();

  layout.appendChild(this.label_, renderTo);
  layout.appendChild(this.drawLayer_, renderTo);
  layout.appendChild(separator, renderTo);
  layout.appendChild(this.selectorLayer_, renderTo);

  separator.init(this.sectionName_);
};


/**
 * @return {boolean}
 */
thin.core.ListSectionHelper.prototype.isActive = function() {
  return this.active_;
};


/**
 * @return {thin.core.Layer}
 */
thin.core.ListSectionHelper.prototype.getDrawLayer = function() {
  return this.drawLayer_;
};


/**
 * @return {thin.core.Layer}
 */
thin.core.ListSectionHelper.prototype.getSelectorLayer = function() {
  return this.selectorLayer_;
};


/**
 * @return {thin.core.ListSectionHelper.Separator_}
 */
thin.core.ListSectionHelper.prototype.getSeparator = function() {
  return this.separator_;
};


/**
 * @param {thin.core.ListShape} target
 * @param {goog.math.Rect} bounds
 */
thin.core.ListSectionHelper.prototype.update = function(target, bounds) {
  var top = bounds.top;
  var width = bounds.width;
  var height = bounds.height;
  this.drawLayer_.setBounds(bounds);
  this.selectorLayer_.setBounds(bounds);
  var label = this.label_;
  label.setBounds(bounds);
  label.setVisibled(label.getMinHeight() <= height &&
                    label.getMinWidth() <= width);

  var separator = this.separator_;
  separator.setWidth(width);
  separator.setLeft(bounds.left);
  separator.setTop(top + height);
  var sectionShape = target.getSectionShape(this.sectionName_);
  sectionShape.setTop(top);
  sectionShape.setHeight(height);
};


/**
 * @param {thin.core.ListShape} target
 * @param {boolean=} opt_visibled
 */
thin.core.ListSectionHelper.prototype.active = function(target, opt_visibled) {
  var sectionShape = target.getSectionShape(this.sectionName_);
  var isEnabled = sectionShape.isEnabled();
  var separator = this.separator_;

  separator.setVisibled(isEnabled);
  separator.getDragger().setEnabled(isEnabled);

  if (goog.isBoolean(opt_visibled)) {
    this.drawLayer_.setVisibled(opt_visibled);
  } else {
    this.drawLayer_.setVisibled(
      this.layout_.getWorkspace().getUiStatusForAction() != 'selector');
  }

  if (isEnabled) {
    var selectorLayer = this.selectorLayer_;
    var selectorElement = selectorLayer.getElement();

    goog.dom.insertSiblingBefore(selectorElement, sectionShape.getGroup().getElement());
    selectorLayer.setVisibled(true);
    goog.dom.insertSiblingBefore(this.label_.getElement(), selectorElement);
  }

  this.active_ = true;
};


thin.core.ListSectionHelper.prototype.inactive = function() {
  if (this.isActive()) {
    var layout = this.layout_;

    this.drawLayer_.setVisibled(false);
    this.separator_.setVisibled(false);
    this.selectorLayer_.setVisibled(false);

    var listHelperGroup = layout.getHelpers().getListHelper();

    layout.appendChild(this.selectorLayer_, listHelperGroup);

    var label = this.label_;
    layout.appendChild(label, listHelperGroup);
    label.setVisibled(false);

    this.active_ = false;
  }
};


/**
 * @return {thin.core.Layer}
 * @private
 */
thin.core.ListSectionHelper.prototype.createDrawLayer_ = function() {
  return new thin.core.DrawActionLayer(this.layout_);
};


/**
 * @return {thin.core.Layer}
 * @private
 */
thin.core.ListSectionHelper.prototype.createSelectorLayer_ = function() {
  var layout = this.layout_;
  var selectorLayer = new thin.core.ActionLayer(layout,
          new thin.core.Cursor(thin.core.Cursor.Type.CROSSHAIR));
  selectorLayer.setFill(new goog.graphics.SolidFill('#FFFFFF', 0.3));
  return selectorLayer;
};


/**
 * @return {thin.core.TextShape}
 * @private
 */
thin.core.ListSectionHelper.prototype.createSectionLabel_ = function() {
  var layout = this.layout_;
  var sectionLabel = new thin.core.TextShape(layout.createSvgElement('g'), layout);
  sectionLabel.createTextContent(this.sectionName_.toLowerCase());
  sectionLabel.setFontFamily('Helvetica,Arial');
  sectionLabel.setFontSize(12);
  sectionLabel.setTextAnchor(thin.core.TextStyle.HorizonAlignType.MIDDLE);
  sectionLabel.setVerticalAlign(thin.core.TextStyle.VerticalAlignType.CENTER);
  sectionLabel.setFill(new goog.graphics.SolidFill('#AAAAAA'));
  sectionLabel.setVisibled(false);
  return sectionLabel;
};


/** @inheritDoc */
thin.core.ListSectionHelper.prototype.disposeInternal = function() {
  this.inactive();
  var layout = this.layout_;

  var separator = this.separator_;
  var drawLayer = this.drawLayer_;
  var selectorLayer = this.selectorLayer_;

  separator.dispose();
  selectorLayer.dispose();
  drawLayer.dispose();

  layout.remove(separator);
  layout.remove(selectorLayer);
  layout.remove(drawLayer);
  delete this.separator_;
  delete this.drawLayer_;
  delete this.selectorLayer_;
};


/**
 * @param {thin.core.Layout} layout
 * @param {string} sectionName
 * @constructor
 * @extends {thin.core.ListSectionHelper}
 */
thin.core.HeaderSectionHelper = function(layout, sectionName) {
  thin.core.ListSectionHelper.call(this, layout, sectionName);
};
goog.inherits(thin.core.HeaderSectionHelper, thin.core.ListSectionHelper);


/**
 * @param {thin.core.Layout} layout
 * @param {string} sectionName
 * @constructor
 * @extends {thin.core.ListSectionHelper}
 */
thin.core.DetailSectionHelper = function(layout, sectionName) {
  thin.core.ListSectionHelper.call(this, layout, sectionName);
};
goog.inherits(thin.core.DetailSectionHelper, thin.core.ListSectionHelper);



/**
 * @param {thin.core.Layout} layout
 * @param {string} sectionName
 * @constructor
 * @extends {thin.core.ListSectionHelper}
 */
thin.core.PageFooterSectionHelper = function(layout, sectionName) {
  thin.core.ListSectionHelper.call(this, layout, sectionName);
};
goog.inherits(thin.core.PageFooterSectionHelper, thin.core.ListSectionHelper);


/**
 * @param {thin.core.Layout} layout
 * @param {string} sectionName
 * @constructor
 * @extends {thin.core.ListSectionHelper}
 */
thin.core.FooterSectionHelper = function(layout, sectionName) {
  thin.core.ListSectionHelper.call(this, layout, sectionName);
};
goog.inherits(thin.core.FooterSectionHelper, thin.core.ListSectionHelper);


/**
 * @param {thin.core.Layout} layout
 * @constructor
 * @private
 * @extends {thin.core.Component}
 */
thin.core.ListSectionHelper.Separator_ = function(layout) {

  /**
   * @type {thin.core.Layout}
   * @private
   */
  this.layout_ = layout;

  /**
   * @type {thin.core.DraggableLine}
   * @private
   */
  this.line_ = this.createLine_();

  /**
   * @type {thin.core.ListSectionHelper.SeparatorHandle_}
   * @private
   */
  this.leftHandle_ = this.createHandle_();

  /**
   * @type {thin.core.ListSectionHelper.SeparatorHandle_}
   * @private
   */
  this.rightHandle_ = this.createHandle_();

  goog.base(this, layout);
  this.setVisibled(false);
  this.left_ = 0;
  this.top_ = 0;
};
goog.inherits(thin.core.ListSectionHelper.Separator_, thin.core.Component);


/**
 * @return {thin.core.DraggableLine}
 * @private
 */
thin.core.ListSectionHelper.Separator_.prototype.createLine_ = function() {
  return new thin.core.DraggableLine(
                    thin.core.DraggableLine.Direction.HORIZONTAL, this.layout_,
                    thin.core.ListSectionHelper.FILL_);
};


/**
 * @private
 */
thin.core.ListSectionHelper.Separator_.prototype.createHandle_ = function() {
  return new thin.core.ListSectionHelper.SeparatorHandle_(
      this.layout_.createSvgElement('rect'), this.layout_);
};


/**
 * @return {thin.core.DraggableLine}
 */
thin.core.ListSectionHelper.Separator_.prototype.getLineHeight = function() {
  return this.line_.getHeight();
};


/** @override */
thin.core.ListSectionHelper.Separator_.prototype.setup = function() {
  var cursor = new thin.core.Cursor(thin.core.Cursor.Type.TCENTER);
  this.setCursor(cursor);
  this.layout_.setElementCursor(this.getElement(), cursor);
  this.layout_.appendChild(this.line_, this);
  this.layout_.appendChild(this.leftHandle_, this);
  this.layout_.appendChild(this.rightHandle_, this);
};


/**
 * @param {string} sectionName
 * @return {void}
 */
thin.core.ListSectionHelper.Separator_.prototype.init = function(sectionName) {
  var scope = this;
  var layout = this.layout_;
  var line = this.line_;
  var helpers = layout.getHelpers();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var guide = helpers.getGuideHelper();
  var listHelper = helpers.getListHelper();

  var body = goog.dom.getDocument().body;
  var dragLayer = layout.getHelpers().getDragLayer();
  var dragger = new thin.core.SvgDragger(this);
  dragger.setDragModeByCoordinate(line.isVertical(), line.isHorizontal());
  var cursor = this.getCursor();
  var eventType = thin.core.AbstractDragger.EventType;
  var fxEventType = goog.fx.Dragger.EventType;

  goog.events.listen(dragger, eventType.BEFORESTART, function(e) {
    dragLayer.setCursor(cursor);
    layout.setElementCursor(dragLayer.getElement(), cursor);
    goog.style.setStyle(body, 'cursor', cursor.getType());
    dragLayer.setVisibled(true);
  }, false, dragger);

  goog.events.listen(dragger, fxEventType.END, function(e) {
    var defaultType = thin.core.Cursor.Type.DEFAULT;
    var defaultCursor = new thin.core.Cursor(defaultType);
    dragLayer.setCursor(defaultCursor);
    layout.setElementCursor(dragLayer.getElement(), defaultCursor);
    goog.style.setStyle(body, 'cursor', defaultType);
    dragLayer.setVisibled(false);
  }, false, dragger);

  goog.events.listen(dragger, eventType.BEFORESTART, function(e) {
    var listShape = listHelper.getTarget();
    var listShapeBounds = listShape.getBounds();
    var sectionShape = listShape.getSectionShape(sectionName);

    var blankRangeHeight = listHelper.getBlankRangeBounds().height;
    var sectionBoundsByShapes = layout.calculateActiveShapeBounds(
          sectionShape.getManager().getShapesManager().get());
    var sectionBounds = sectionShape.getBounds();
    var limitTop = sectionBoundsByShapes.toBox().bottom || sectionBounds.top;
    this.setLimits(new goog.math.Rect(listShapeBounds.left,
                   limitTop, listShapeBounds.width, (sectionBounds.toBox().bottom + blankRangeHeight) - limitTop));
  }, false, dragger);

  goog.events.listen(dragger, fxEventType.END, function(e) {
    var captureProperties = multipleShapesHelper.getCloneProperties();
    var listShape = listHelper.getTarget();
    var sectionShape = listShape.getSectionShape(sectionName);
    var captureSectionBounds = sectionShape.getBounds();
    var captureSectionHeight = captureSectionBounds.height;
    var captureSectionBottom = captureSectionBounds.toBox().bottom;
    var newSectionBottom = line.getTop();
    var transLateY = newSectionBottom - captureSectionBottom;
    var transLateCoordinate = new goog.math.Coordinate(0, transLateY);
    var retransLateCoordinate = new goog.math.Coordinate(0, captureSectionBottom - newSectionBottom);
    var newSectionHeight = thin.numberWithPrecision(captureSectionHeight + transLateY);
    var activeShapeManagerByListShape = listHelper.getActiveShape();
    var shapes = activeShapeManagerByListShape.getClone();
    var singleShape = activeShapeManagerByListShape.getIfSingle();
    var isMultiple = activeShapeManagerByListShape.isMultiple();
    var isEmpty = activeShapeManagerByListShape.isEmpty();

    /**
     * @param {number} sectionHeight
     * @param {goog.math.Coordinate} transLate
     */
    var updateListShape = function(sectionHeight, transLate) {
      sectionShape.setHeight(sectionHeight);
      listHelper.setTransLateOfNextSectionShapes(transLate, sectionShape);
      listHelper.update();
      if (guide.isEnable()) {
        goog.array.forEach(shapes, function(shape) {
          shape.getTargetOutline().setBounds(shape.getBounds());
        });
        if (isMultiple) {
          multipleShapesHelper.setCloneProperties(captureProperties);
        }
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isEmpty) {
        listShape.updateProperties();
      } else {
        if (isMultiple) {
          multipleShapesHelper.updateProperties();
        } else {
          singleShape.updateProperties();
        }
      }
    };

    layout.getWorkspace().normalVersioning(function(version) {
      if (newSectionHeight == captureSectionHeight &&
           goog.math.Coordinate.equals(transLateCoordinate, retransLateCoordinate)) {
        version.setChanged(false);
      }

      version.upHandler(function() {
        updateListShape(newSectionHeight, transLateCoordinate);
      }, scope);

      version.downHandler(function() {
        updateListShape(captureSectionHeight, retransLateCoordinate);
      }, scope);
    });

  }, false, dragger);

  this.dragger_ = dragger;
};


/**
 * @param {number} left
 */
thin.core.ListSectionHelper.Separator_.prototype.setLeft = function(left) {
  this.line_.setLeft(left);
  this.setHandleLeft_(left);

  left = thin.numberWithPrecision(left - this.getParentTransLateX());
  this.left_ = left;
};


/**
 * @param {number} left
 * @private
 */
thin.core.ListSectionHelper.Separator_.prototype.setHandleLeft_ = function(left) {
  var listGuideHelper = this.layout_.getHelpers().getListHelper().getListGuideHelper();

  this.leftHandle_.setLeft(left - listGuideHelper.getStrokeWidth());
  this.rightHandle_.setLeft(left + this.line_.getWidth());
};


/**
 * @param {number} top
 */
thin.core.ListSectionHelper.Separator_.prototype.setTop = function(top) {
  this.line_.setTop(top);
  this.leftHandle_.setTop(top - (this.leftHandle_.getHeight() / 2));
  this.rightHandle_.setTop(top - (this.rightHandle_.getHeight() / 2));

  top = thin.numberWithPrecision(top - this.getParentTransLateY());
  this.top_ = top;
};


/**
 * @param {number} width
 */
thin.core.ListSectionHelper.Separator_.prototype.setWidth = function(width) {
  this.line_.setWidth(width);

  width = thin.numberWithPrecision(width);
  this.width_ = width;
};


/**
 * @return {void}
 */
thin.core.ListSectionHelper.Separator_.prototype.reapplySizeAndStroke = function() {
  this.line_.reapplySizeAndStroke();

  this.leftHandle_.reapplySizeAndStroke();
  this.rightHandle_.reapplySizeAndStroke();

  this.setLeft(this.getLeft());
  this.setTop(this.getTop());
};


/**
 * @return {thin.core.SvgDragger}
 */
thin.core.ListSectionHelper.Separator_.prototype.getDragger = function() {
  return this.dragger_;
};


/** @override */
thin.core.ListSectionHelper.Separator_.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.line_.dispose();
  this.leftHandle_.dispose();
  this.rightHandle_.dispose();

  delete this.layout_;
  delete this.line_;
  delete this.leftHandle_;
  delete this.rightHandle_;
};


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {thin.core.Rect}
 * @private
 */
thin.core.ListSectionHelper.SeparatorHandle_ = function(element, layout) {
  goog.base(this, element, layout,
      null, new goog.graphics.SolidFill('#ffffff'));
};
goog.inherits(thin.core.ListSectionHelper.SeparatorHandle_, thin.core.Rect);


thin.core.ListSectionHelper.SeparatorHandle_.prototype.reapplySizeAndStroke = function() {
  var scale = this.getLayout().getPixelScale();

  this.setWidth(8 / scale);
  this.setHeight(2 / scale);
};
