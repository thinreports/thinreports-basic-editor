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

goog.provide('thin.editor.StateManager');

goog.require('goog.Disposable');
goog.require('thin.editor.ShapeManager');
goog.require('thin.editor.ActiveShapeManager');
goog.require('thin.editor.ShapeIdManager');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {goog.Disposable}
 */
thin.editor.StateManager = function(layout) {
  
  /**
   * @type {thin.editor.Workspace}
   * @private
   */
  this.workspace_ = layout.getWorkspace();
  
  /**
   * @type {thin.editor.Layout}
   * @private
   */
  this.layout_ = layout;
  
  this.setup();
};
goog.inherits(thin.editor.StateManager, goog.Disposable);


/**
 * @type {thin.editor.ShapeManager}
 * @private
 */
thin.editor.StateManager.prototype.shapes_;


/**
 * @type {thin.editor.ActiveShapeManager}
 * @private
 */
thin.editor.StateManager.prototype.activeShapes_;


/**
 * @type {thin.editor.ShapeIdManager}
 * @private
 */
thin.editor.StateManager.prototype.shapeIds_;


thin.editor.StateManager.prototype.setup = function() {
  var layout = this.layout_;
  this.shapes_ = new thin.editor.ShapeManager(layout);
  this.activeShapes_ = new thin.editor.ActiveShapeManager(layout);
  this.shapeIds_ = new thin.editor.ShapeIdManager(layout);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {thin.editor.ListColumnShape=} opt_columnShapeForScope
 */
thin.editor.StateManager.prototype.addShape = function(shape, opt_columnShapeForScope) {
  if(opt_columnShapeForScope) {
    shape.setAffiliationColumn(opt_columnShapeForScope);
  }
  this.shapes_.add(shape);
};


/**
 * @param {goog.graphics.Element} shape
 */
thin.editor.StateManager.prototype.setActiveShape = function(shape) {
  this.activeShapes_.add(shape);
};


/**
 * @return {thin.editor.ShapeManager}
 */
thin.editor.StateManager.prototype.getShapesManager = function() {
  return this.shapes_;
};


/**
 * @return {thin.editor.ActiveShapeManager}
 */
thin.editor.StateManager.prototype.getActiveShape = function() {
  return this.activeShapes_;
};


/**
 * @return {Array}
 */
thin.editor.StateManager.prototype.getAllShapesWithId = function() {
  var shapes = this.shapeIds_.getAll();
  var compare = goog.array.defaultCompare;
  goog.array.sort(shapes, function(a, b) {
    return compare(a.getShapeId(), b.getShapeId());
  });
  return shapes;
};


/**
 * @param {Function} fn
 * @param {Object=} opt_obj
 */
thin.editor.StateManager.prototype.forEachShapeWithId = function(fn, opt_obj) {
  goog.array.forEach(this.getAllShapesWithId(), function(shape) {
    fn.call(opt_obj, shape.getShapeId(), shape);
  });
};


/**
 * @return {thin.editor.ActiveShapeManager}
 */
thin.editor.StateManager.prototype.getActiveShapeByIncludeList = function() {
  var listHelper = this.layout_.getHelpers().getListHelper();
  if (!listHelper.isActived()) {
    var activeShapeManagerForList = listHelper.getActiveShape();
    if (!activeShapeManagerForList.isEmpty()) {
      return activeShapeManagerForList;
    }
  }
  return this.activeShapes_;
};


/**
 * @return {thin.editor.ShapeIdManager}
 */
thin.editor.StateManager.prototype.getShapeIdManager = function() {
  return this.shapeIds_;
};


/** @inheritDoc */
thin.editor.StateManager.prototype.disposeInternal = function() {
  thin.editor.StateManager.superClass_.disposeInternal.call(this);
  
  this.shapes_.dispose();
  this.activeShapes_.dispose();
  this.shapeIds_.dispose();
  delete this.shapes_;
  delete this.activeShapes_;
  delete this.shapeIds_;
};