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

goog.provide('thin.editor.ModuleOutline');

goog.require('goog.array');
goog.require('goog.math.Rect');
goog.require('goog.events');
goog.require('goog.events.EventType');


/**
 * @constructor
 */
thin.editor.ModuleOutline = function() {};


/**
 * @type {goog.graphics.Element}
 * @private
 */
thin.editor.ModuleOutline.prototype.targetShape_ ;


/**
 * @type {boolean}
 * @private
 */
thin.editor.ModuleOutline.prototype.enable_ = false;


/**
 * @type {thin.editor.OutlineHelper|thin.editor.MultiOutlineHelper}
 * @private
 */
thin.editor.ModuleOutline.prototype.outlineHelper_;


thin.editor.ModuleOutline.prototype.toShape = goog.abstractMethod; 


thin.editor.ModuleOutline.prototype.getInitShapeProperties = goog.abstractMethod;


/**
 * @this {goog.graphics.Element}
 * @param {number} startPosX
 * @param {number} startPosY
 * @param {number} clientPosX
 * @param {number} clientPosY
 */
thin.editor.ModuleOutline.prototype.setBoundsByCoordinate = function(startPosX, startPosY, clientPosX, clientPosY) {
  this.setBounds(new goog.math.Rect(
    Math.min(startPosX, clientPosX), Math.min(startPosY, clientPosY),
    thin.numberWithPrecision(Math.abs(startPosX - clientPosX)),
    thin.numberWithPrecision(Math.abs(startPosY - clientPosY))));
};


/**
 * @this {goog.graphics.Element}
 * @param {goog.math.Coordinate} scale
 * @param {goog.math.Coordinate} transLate
 * @param {boolean} isVertex
 */
thin.editor.ModuleOutline.prototype.setBoundsByScale = function(scale, transLate, isVertex) {
  var scaleX = scale.x;
  var scaleY = scale.y;
  var deltaX = this.getLeft() - transLate.x;
  var deltaY = this.getTop() - transLate.y;

  this.setBounds(new goog.math.Rect(
    thin.numberWithPrecision(this.getLeft() + ((deltaX * scaleX) - deltaX)),
    thin.numberWithPrecision(this.getTop() + ((deltaY * scaleY) - deltaY)),
    thin.numberWithPrecision(this.getWidth() * scaleX),
    thin.numberWithPrecision(this.getHeight() * scaleY)));
};


/**
 * @this {goog.graphics.Element}
 * @param {goog.graphics.Element} shape
 */
thin.editor.ModuleOutline.prototype.setTargetShape = function(shape) {
  this.targetShape_ = shape;
};


/**
 * @this {goog.graphics.Element}
 * @return {goog.graphics.Element}
 */
thin.editor.ModuleOutline.prototype.getTargetShape = function() {
  return this.targetShape_;
};


/**
 * @this {goog.graphics.Element}
 * @param {thin.editor.OutlineHelper|thin.editor.MultiOutlineHelper} helper
 */
thin.editor.ModuleOutline.prototype.setOutlineHelper = function(helper) {
  this.outlineHelper_ = helper;
  this.forMultiple_ = helper.isMultiple();
};


/**
 * @this {goog.graphics.Element}
 * @return {thin.editor.OutlineHelper|thin.editor.MultiOutlineHelper}
 */
thin.editor.ModuleOutline.prototype.getOutlineHelper = function() {
  return this.outlineHelper_;
};


/**
 * @this {goog.graphics.Element}
 * @return {boolean}
 */
thin.editor.ModuleOutline.prototype.isEnable = function() {
  return this.enable_;
};


/**
 * @this {goog.graphics.Element}
 */
thin.editor.ModuleOutline.prototype.disable = function() {
  this.getOutlineHelper().disable(this);
  this.enable_ = false;
};


/**
 * @this {goog.graphics.Element}
 * @param {boolean=} opt_fromDraw
 * @private
 */
thin.editor.ModuleOutline.prototype.enableForCommon_ = function(opt_fromDraw) {
  if (!opt_fromDraw) {
    this.setBounds(this.getTargetShape().getBounds());
  }
  this.getOutlineHelper().enable(this);
  this.enable_ = true;
};


/**
 * @this {goog.graphics.Element}
 * @param {boolean=} opt_fromDraw
 */
thin.editor.ModuleOutline.prototype.enable = function(opt_fromDraw) {
  this.getLayout().getHelpers().disableAll();
  this.enableForCommon_(opt_fromDraw);
};


/**
 * @this {goog.graphics.Element}
 * @return {boolean}
 */
thin.editor.ModuleOutline.prototype.isForMultiple = function() {
  return this.getOutlineHelper().isMultiple();
};


/**
 * @this {goog.graphics.Element}
 * @private
 */
thin.editor.ModuleOutline.prototype.disposeInternalForOutline = function() {
  delete this.targetShape_;
  delete this.outlineHelper_;
};


/**
 * @this {goog.graphics.Element}
 * @param {number} width
 */
thin.editor.ModuleOutline.prototype.setStrokeWidth = function(width) {
  this.setStrokeWidth_(width);
};


/**
 * @this {goog.graphics.Element}
 */
thin.editor.ModuleOutline.prototype.setupMouseDownHandler = function() {
  var scope = this;
  var layout = this.getLayout();
  var helpers = layout.getHelpers();
  var guide = helpers.getGuideHelper();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  
  goog.events.listen(this, goog.events.EventType.MOUSEDOWN, function(e) {
    layout.getWorkspace().focusElement(e);

    if (e.ctrlKey && this.isForMultiple()) {
      var removeShape = this.getTargetShape();
      var listHelper = helpers.getListHelper();
      var captureProperties = multipleShapesHelper.getCloneProperties();
      var manager = !listHelper.isActive() ? layout.getManager() : listHelper;
      var activeShapeManager = manager.getActiveShape();
      var oldShapesByGlobal = activeShapeManager.getClone();
      var singleShapeForUp = (activeShapeManager.getCount() == 2) ? 
        goog.array.find(oldShapesByGlobal, function(target) {
          return target != removeShape;
        }) : false;
      
      e.stopPropagation();
      e.preventDefault();
      
      layout.getWorkspace().normalVersioning(function(version) {
        version.upHandler(function() {
          removeShape.getTargetOutline().disable();
          activeShapeManager.set(oldShapesByGlobal);
          activeShapeManager.remove(removeShape);
          
          if (singleShapeForUp) {
            singleShapeForUp.getTargetOutline().disable();
            singleShapeForUp.updateToolbarUI();
            guide.setEnableAndTargetShape(singleShapeForUp);
            singleShapeForUp.updateProperties();
          } else {
            layout.calculateGuideBounds(activeShapeManager.get());
            guide.adjustToTargetShapeBounds();
          }
          
        }, scope);
        
        version.downHandler(function() {
          activeShapeManager.set(oldShapesByGlobal);
          manager.setActiveShape(removeShape);
          var shapes = activeShapeManager.get();
          layout.setOutlineForMultiple(shapes);
          layout.calculateGuideBounds(shapes);
          guide.adjustToTargetShapeBounds();
          
          if (singleShapeForUp) {
            guide.setEnableAndTargetShape(helpers.getMultiOutlineHelper());
            multipleShapesHelper.setCloneProperties(captureProperties);
            multipleShapesHelper.updateProperties();
            thin.ui.setEnabledForFontUi(true);
          }
        }, scope);
      });
    }
  }, false, this);
};
