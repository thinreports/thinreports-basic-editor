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

goog.provide('thin.core.DraggableLine');
goog.provide('thin.core.DraggableLine.Direction');

goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.events');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('thin.core.Cursor');
goog.require('thin.core.Cursor.Type');
goog.require('thin.core.Rect');
goog.require('thin.core.AbstractDragger');
goog.require('thin.core.AbstractDragger.EventType');
goog.require('thin.core.DragEvent');
goog.require('thin.core.SvgDragger');
goog.require('thin.core.Layer');


/**
 * @param {number} direction
 * @param {thin.core.Layout} layout
 * @param {goog.graphics.Fill} fill
 * @constructor
 * @extends {thin.core.Rect}
 */
thin.core.DraggableLine = function(direction, layout, fill) {
  
  var stroke = thin.core.DraggableLine.STROKE;
  thin.core.Rect.call(this, layout.createSvgElement('rect', {
    'stroke-opacity': 0
  }), layout, stroke, fill);
  
  /**
   * @type {number}
   * @private
   */
  this.direction_ = direction;
};
goog.inherits(thin.core.DraggableLine, thin.core.Rect);


/**
 * @enum {number}
 */
thin.core.DraggableLine.Direction = {
  HORIZONTAL: 0x01,
  VERTICAL: 0x02
};


/**
 * @type {goog.graphics.Stroke}
 */
thin.core.DraggableLine.STROKE = new goog.graphics.Stroke('4px', '#FFFFFF');


/**
 * @type {number}
 * @private
 */
thin.core.DraggableLine.TOLERANCE_ = 10;


/**
 * @type {thin.core.SvgDragger}
 * @private
 */
thin.core.DraggableLine.prototype.dragger_;


/**
 * @type {number}
 * @private
 */
thin.core.DraggableLine.prototype.position_ = 0;


thin.core.DraggableLine.prototype.reapplySizeAndStroke = function() {
  var layout = this.getLayout();
  this.reapplyStroke();
  if (this.isHorizontal()) {
    layout.setHeightByScale(this, 1);
  }
  if (this.isVertical()) {
    layout.setWidthByScale(this, 1);
  }
};


/**
 * @param {number} left
 */
thin.core.DraggableLine.prototype.setLeft = function(left) {
  thin.core.DraggableLine.superClass_.setLeft.call(this, left);
  if(this.isVertical()) {
    this.position_ = this.getLeft();
  }
};


/**
 * @param {number} top
 */
thin.core.DraggableLine.prototype.setTop = function(top) {
  thin.core.DraggableLine.superClass_.setTop.call(this, top);
  if(this.isHorizontal()) {
    this.position_ = this.getTop();
  }
};


/**
 * @return {boolean}
 */
thin.core.DraggableLine.prototype.isHorizontal = function() {
  return this.direction_ == thin.core.DraggableLine.Direction.HORIZONTAL;
};


/**
 * @return {boolean}
 */
thin.core.DraggableLine.prototype.isVertical = function() {
  return this.direction_ == thin.core.DraggableLine.Direction.VERTICAL;
};


thin.core.DraggableLine.prototype.init = function() {
  
  var scope = this;
  var layout = this.getLayout();
  var body = goog.dom.getDocument().body;
  var dragLayer = layout.getHelpers().getDragLayer();
  var dragger = new thin.core.SvgDragger(this);
  dragger.setDragModeByCoordinate(this.isVertical(), this.isHorizontal());
  var cursor = this.getCursor();
  var eventType = goog.fx.Dragger.EventType;

  goog.events.listen(dragger,
    thin.core.AbstractDragger.EventType.BEFORESTART, function(e) {
    dragLayer.setCursor(cursor);
    layout.setElementCursor(dragLayer.getElement(), cursor);
    goog.style.setStyle(body, 'cursor', cursor.getType());
    dragLayer.setVisibled(true);
  }, false, dragger);

  goog.events.listen(dragger, eventType.END, function(e) {
    var defaultType = thin.core.Cursor.Type.DEFAULT;
    var defaultCursor = new thin.core.Cursor(defaultType);
    dragLayer.setCursor(defaultCursor);
    layout.setElementCursor(dragLayer.getElement(), defaultCursor);
    goog.style.setStyle(body, 'cursor', defaultType);
    dragLayer.setVisibled(false);
  }, false, dragger);
  this.dragger_ = dragger;
};


/**
 * @return {thin.core.SvgDragger}
 */
thin.core.DraggableLine.prototype.getDragger = function() {
  return this.dragger_;
};


/**
 * @private
 */
thin.core.DraggableLine.prototype.createPropertyComponent_ = function() {
  var shape = this;
  var layout = this.getLayout();

  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');
  
  var baseGroup = proppane.addGroup(thin.t('property_group_basis'));
  
  
  var positionInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_position'));
  var positionInput = positionInputProperty.getValueControl();
  positionInput.getNumberValidator().setAllowDecimal(true, 1);
  
  positionInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var position = Number(e.target.getValue());
        if (shape.isHorizontal()) {
          shape.setTop(shape.getAllowTop(position));
        }
        if (shape.isVertical()) {
          shape.setLeft(shape.getAllowLeft(position));
        }
        shape.updateProperties();
      }, false, this);
  
  proppane.addProperty(positionInputProperty, baseGroup, 'position');
};


thin.core.DraggableLine.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }
  proppane.getPropertyControl('position').setValue(this.position_);
};


/** @inheritDoc */
thin.core.DraggableLine.prototype.disposeInternal = function() {
  thin.core.DraggableLine.superClass_.disposeInternal.call(this);
  this.disposeInternalForDragger_();
};
