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

goog.provide('thin.core.ListGuideResizer');
goog.provide('thin.core.ListGuideResizer.DefaultSize_');

goog.require('goog.array');
goog.require('goog.math.Rect');
goog.require('goog.math.Size');
goog.require('thin.core.Cursor');
goog.require('thin.core.Cursor.Type');
goog.require('thin.core.Component');
goog.require('thin.core.Ellipse');
goog.require('thin.core.Rect');
goog.require('thin.core.Component');
goog.require('thin.core.SvgResizer');
goog.require('thin.core.AbstractGuideHelper');
goog.require('thin.core.AbstractGuideHelper.PositionName');


/**
 * @param {thin.core.Layout} layout
 * @param {thin.core.ListGuideHelper} affiliationGroup
 * @param {string} positionName
 * @constructor
 * @extends {thin.core.Component}
 */
thin.core.ListGuideResizer = function(layout, affiliationGroup, positionName) {

  /**
   * @type {Array.<thin.core.Ellipse>}
   */
  this.decorations_ = [];
  
  /**
   * @type {string}
   * @private
   */
  this.positionName_ = positionName;
  this.init_();
  thin.core.Component.call(this, layout);
  this.setVisibled(true);
  
  /**
   * @type {thin.core.ListGuideHelper}
   * @private
   */
  this.affiliationGroup_ = affiliationGroup;
};
goog.inherits(thin.core.ListGuideResizer, thin.core.Component);


/**
 * @enum {number}
 * @private
 */
thin.core.ListGuideResizer.DefaultSize_ = {
  HANDLERSIZE: 15,
  ELEMENTSIZE: 2
};


/**
 * @type {thin.core.Component}
 * @private
 */
thin.core.ListGuideResizer.prototype.decorationsContainer_;


/**
 * @type {number}
 * @private
 */
thin.core.ListGuideResizer.prototype.rotate_;


/**
 * @type {thin.core.Rect}
 * @private
 */
thin.core.ListGuideResizer.prototype.handler_;


/**
 * @type {thin.core.SvgResizer}
 * @private
 */
thin.core.ListGuideResizer.prototype.resizer_;


/**
 * @type {boolean}
 * @private
 */
thin.core.ListGuideResizer.prototype.isRightPosition_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.ListGuideResizer.prototype.isBottomPosition_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.ListGuideResizer.prototype.isVertical_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.ListGuideResizer.prototype.isHorizon_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.ListGuideResizer.prototype.isCorner_ = false;


/**
 * @private
 */
thin.core.ListGuideResizer.prototype.init_ = function() {
  
  var positionName = this.positionName_;
  var positionNameTemp = thin.core.AbstractGuideHelper.PositionName;
  
  var tleft = positionNameTemp.TLEFT;
  var tright = positionNameTemp.TRIGHT;
  var bleft = positionNameTemp.BLEFT;
  var bright = positionNameTemp.BRIGHT;
  
  if (positionName == tleft ||
  positionName == tright ||
  positionName == bleft ||
  positionName == bright) {
    this.isCorner_ = true;
  }
  
  if(positionName == tleft) {
    this.rotate_ = 0;
  }
  if(positionName == tright) {
    this.isRightPosition_ = true;
    this.rotate_ = 90;
  }
  if(positionName == bright) {
    this.isRightPosition_ = true;
    this.isBottomPosition_ = true;
    this.rotate_ = 180;
  }
  if(positionName == bleft) {
    this.isBottomPosition_ = true;
    this.rotate_ = 270;
  }

  if (positionName == positionNameTemp.MLEFT ||
  positionName == positionNameTemp.MRIGHT) {
    this.isVertical_ = true;
  }
  
  if (positionName == positionNameTemp.TCENTER ||
  positionName == positionNameTemp.BCENTER) {
    this.isHorizon_ = true;
  }

};


thin.core.ListGuideResizer.prototype.setup = function() {
  var layout = this.getLayout();
  var container = new thin.core.Component(layout);
  this.decorationsContainer_ = container;
  this.createResizers_();
  var element = layout.createSvgElement('rect', {
    'stroke-opacity': 0
  });
  var handler = new thin.core.Rect(element, layout, null, new goog.graphics.SolidFill('#FFFFFF', 0.0001));
  var cursor = thin.core.Cursor.getCursorByName(
        /** @type {string} */ (this.positionName_));

  handler.setCursor(cursor);
  layout.setElementCursor(element, cursor);
  layout.appendChild(container, this);
  layout.appendChild(handler, this);
  this.handler_ = handler;
};


/**
 * @private
 */
thin.core.ListGuideResizer.prototype.createResizers_ = function() {
  var layout = this.getLayout();
  var stroke = new goog.graphics.Stroke('0.8px', '#FFFFFF');
  var fill = new goog.graphics.SolidFill('#FFFFFF');
  
  var createResizer = goog.bind(function() {
    var decoration = new thin.core.Ellipse(layout.createSvgElement('ellipse'), layout, stroke, fill);
    decoration.setVisibled(true);
    layout.appendChild(decoration, this.decorationsContainer_);
    goog.array.insert(this.decorations_, decoration);
  }, this);
  for (var c = 0; c < 3; c++) {
    createResizer();
  }
};


/**
 * @param {number} x
 * @param {number} y
 * @param {number} strokeWidth
 */
thin.core.ListGuideResizer.prototype.adjustToResizerBounds = function(x, y, strokeWidth) {

  var layout = this.getLayout();
  var handlerSize = thin.core.ListGuideResizer.DefaultSize_.HANDLERSIZE / layout.getPixelScale();
  
  if (this.isCorner_) {
    var bounds = new goog.math.Rect(x, y, strokeWidth, strokeWidth);
    this.adjustToResizerBoundsForCorner(bounds);
  }
  if (this.isVertical_) {
    var bounds = new goog.math.Rect(x, y - (handlerSize / 2), strokeWidth, handlerSize);
    this.adjustToResizerBoundsForVertical(bounds);
  }
  if (this.isHorizon_) {
    var bounds = new goog.math.Rect(x - (handlerSize / 2), y, handlerSize, strokeWidth);
    this.adjustToResizerBoundsForHorizon(bounds);
  }
  
  this.handler_.setBounds(bounds);
  var rotate = this.rotate_;
  
  var margin = strokeWidth / 3;
  
  if(goog.isNumber(rotate)) {
    if(this.isRightPosition_) {
      var transLateX = strokeWidth - margin;
    } else {
      var transLateX = margin;
    }
    if(this.isBottomPosition_) {
      var transLateY = strokeWidth - margin;
    } else {
      var transLateY = margin;
    }
    layout.setElementTransform(this.decorationsContainer_, transLateX, transLateY, rotate, x, y);
  }
};


/**
 * @param {goog.math.Rect} bounds
 */
thin.core.ListGuideResizer.prototype.adjustToResizerBoundsForCorner = function(bounds) {
  var boxSize = bounds.toBox();
  var left = bounds.left;
  var top = bounds.top;
  
  var decorations = this.decorations_;
  var decorationLeft = decorations[0];
  var decorationRight = decorations[1];
  var decorationBottom = decorations[2];
  
  decorationLeft.setLeft(left);
  decorationLeft.setTop(top);
  decorationRight.setLeft(boxSize.right - decorationRight.getWidth());
  decorationRight.setTop(top);
  decorationBottom.setLeft(left);
  decorationBottom.setTop(boxSize.bottom - decorationBottom.getHeight());
};


/**
 * @param {goog.math.Rect} bounds
 */
thin.core.ListGuideResizer.prototype.adjustToResizerBoundsForVertical = function(bounds) {

  var left = bounds.left + bounds.width / 2;
  var top = bounds.top;
  
  var decorations = this.decorations_;
  var decorationTop = decorations[0];
  var decorationMiddle = decorations[1];
  var decorationBottom = decorations[2];
  
  decorationTop.setCenter(left, top + decorationTop.getHeight());
  decorationMiddle.setCenter(left, top + (bounds.height / 2));
  decorationBottom.setCenter(left, bounds.toBox().bottom - decorationBottom.getHeight());
};


/**
 * @param {goog.math.Rect} bounds
 */
thin.core.ListGuideResizer.prototype.adjustToResizerBoundsForHorizon = function(bounds) {

  var left = bounds.left;
  var top = bounds.top + bounds.height / 2;
  
  var decorations = this.decorations_;
  var decorationLeft = decorations[0];
  var decorationCenter = decorations[1];
  var decorationRight = decorations[2];
  
  decorationLeft.setCenter(left + decorationLeft.getWidth(), top);
  decorationCenter.setCenter(left + (bounds.width / 2), top);
  decorationRight.setCenter(bounds.toBox().right - decorationRight.getWidth(), top);
};


thin.core.ListGuideResizer.prototype.reapplyStrokeAndSize = function() {
  var size = thin.core.ListGuideResizer.DefaultSize_.ELEMENTSIZE;
  var sizeForScale = new goog.math.Size(size, size);
  var layout = this.getLayout();
  goog.array.forEach(this.decorations_, function(decoration, count) {
    layout.setSizeByScale(decoration, sizeForScale);
    decoration.reapplyStroke();
  });
};


/**
 * @return {thin.core.SvgResizer}
 */
thin.core.ListGuideResizer.prototype.getResizer = function() {
  if (!goog.isDef(this.resizer_)) {
    this.resizer_ = new thin.core.SvgResizer(this.affiliationGroup_, this);
  }
  return this.resizer_;
};


/** @inheritDoc */
thin.core.ListGuideResizer.prototype.disposeInternal = function() {
  this.resizer_.dispose();
  goog.array.forEach(this.decorations_, function(decoration) {
    decoration.dispose();
  });
  this.handler_.dispose();
  this.decorationsContainer_.dispose();
  delete this.handler_;
  delete this.decorationsContainer_;
  delete this.affiliationGroup_;
  delete this.resizer_;
  delete this.decorations_;
  thin.core.ListGuideResizer.superClass_.disposeInternal.call(this);
};
