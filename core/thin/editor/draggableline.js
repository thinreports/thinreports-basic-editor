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

goog.provide('thin.editor.DraggableLine');
goog.provide('thin.editor.DraggableLine.Direction');

goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.events');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('thin.editor.Cursor');
goog.require('thin.editor.Cursor.Type');
goog.require('thin.editor.Rect');
goog.require('thin.editor.AbstractDragger');
goog.require('thin.editor.AbstractDragger.EventType');
goog.require('thin.editor.DragEvent');
goog.require('thin.editor.SvgDragger');
goog.require('thin.editor.Layer');


/**
 * @param {number} direction
 * @param {thin.editor.Layout} layout
 * @param {goog.graphics.Fill} fill
 * @constructor
 * @extends {thin.editor.Rect}
 */
thin.editor.DraggableLine = function(direction, layout, fill) {
  
  var stroke = thin.editor.DraggableLine.STROKE;
  thin.editor.Rect.call(this, layout.createSvgElement('rect', {
    'stroke-opacity': 0
  }), layout, stroke, fill);
  
  /**
   * @type {number}
   * @private
   */
  this.direction_ = direction;
};
goog.inherits(thin.editor.DraggableLine, thin.editor.Rect);


/**
 * @enum {number}
 */
thin.editor.DraggableLine.Direction = {
  HORIZONTAL: 0x01,
  VERTICAL: 0x02
};


/**
 * @type {goog.graphics.Stroke}
 */
thin.editor.DraggableLine.STROKE = new goog.graphics.Stroke('4px', '#FFFFFF');


/**
 * @type {number}
 * @private
 */
thin.editor.DraggableLine.TOLERANCE_ = 10;


/**
 * @type {thin.editor.SvgDragger}
 * @private
 */
thin.editor.DraggableLine.prototype.dragger_;


/**
 * @type {number}
 * @private
 */
thin.editor.DraggableLine.prototype.position_ = 0;


thin.editor.DraggableLine.prototype.reapplySizeAndStroke = function() {
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
thin.editor.DraggableLine.prototype.setLeft = function(left) {
  thin.editor.DraggableLine.superClass_.setLeft.call(this, left);
  if(this.isVertical()) {
    this.position_ = this.getLeft();
  }
};


/**
 * @param {number} top
 */
thin.editor.DraggableLine.prototype.setTop = function(top) {
  thin.editor.DraggableLine.superClass_.setTop.call(this, top);
  if(this.isHorizontal()) {
    this.position_ = this.getTop();
  }
};


/**
 * @return {boolean}
 */
thin.editor.DraggableLine.prototype.isHorizontal = function() {
  return this.direction_ == thin.editor.DraggableLine.Direction.HORIZONTAL;
};


/**
 * @return {boolean}
 */
thin.editor.DraggableLine.prototype.isVertical = function() {
  return this.direction_ == thin.editor.DraggableLine.Direction.VERTICAL;
};


thin.editor.DraggableLine.prototype.init = function() {
  
  var scope = this;
  var layout = this.getLayout();
  var body = goog.dom.getDocument().body;
  var dragLayer = layout.getHelpers().getDragLayer();
  var dragger = new thin.editor.SvgDragger(this);
  dragger.setDragModeByCoordinate(this.isVertical(), this.isHorizontal());
  var cursor = this.getCursor();
  var eventType = goog.fx.Dragger.EventType;

  goog.events.listen(dragger,
    thin.editor.AbstractDragger.EventType.BEFORESTART, function(e) {
    dragLayer.setCursor(cursor);
    layout.setElementCursor(dragLayer.getElement(), cursor);
    goog.style.setStyle(body, 'cursor', cursor.getType());
    dragLayer.setVisibled(true);
  }, false, dragger);

  goog.events.listen(dragger, eventType.END, function(e) {
    var defaultType = thin.editor.Cursor.Type['DEFAULT'];
    var defaultCursor = new thin.editor.Cursor(defaultType);
    dragLayer.setCursor(defaultCursor);
    layout.setElementCursor(dragLayer.getElement(), defaultCursor);
    goog.style.setStyle(body, 'cursor', defaultType);
    dragLayer.setVisibled(false);
  }, false, dragger);
  this.dragger_ = dragger;
};


/**
 * @return {thin.editor.SvgDragger}
 */
thin.editor.DraggableLine.prototype.getDragger = function() {
  return this.dragger_;
};


/**
 * @private
 */
thin.editor.DraggableLine.prototype.createPropertyComponent_ = function() {
  var shape = this;
  var layout = this.getLayout();

  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');
  
  var baseGroup = proppane.addGroup('基本');
  
  
  var positionInputProperty = new thin.ui.PropertyPane.NumberInputProperty('位置');
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


thin.editor.DraggableLine.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  proppane.updateAsync(function() {
    if (!proppane.isTarget(this)) {
      this.getLayout().updatePropertiesForEmpty();
      proppane.setTarget(this);
      this.createPropertyComponent_();
    }
    proppane.getPropertyControl('position').setValue(this.position_);
  }, this);
};


/** @inheritDoc */
thin.editor.DraggableLine.prototype.disposeInternal = function() {
  thin.editor.DraggableLine.superClass_.disposeInternal.call(this);
  this.disposeInternalForDragger_();
};