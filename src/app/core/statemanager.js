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

goog.provide('thin.core.StateManager');

goog.require('goog.Disposable');
goog.require('thin.core.ShapeManager');
goog.require('thin.core.ActiveShapeManager');
goog.require('thin.core.ShapeIdManager');


/**
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {goog.Disposable}
 */
thin.core.StateManager = function(layout) {
  
  /**
   * @type {thin.core.Workspace}
   * @private
   */
  this.workspace_ = layout.getWorkspace();
  
  /**
   * @type {thin.core.Layout}
   * @private
   */
  this.layout_ = layout;
  
  this.setup();
};
goog.inherits(thin.core.StateManager, goog.Disposable);


/**
 * @type {thin.core.ShapeManager}
 * @private
 */
thin.core.StateManager.prototype.shapes_;


/**
 * @type {thin.core.ActiveShapeManager}
 * @private
 */
thin.core.StateManager.prototype.activeShapes_;


/**
 * @type {thin.core.ShapeIdManager}
 * @private
 */
thin.core.StateManager.prototype.shapeIds_;


thin.core.StateManager.prototype.setup = function() {
  var layout = this.layout_;
  this.shapes_ = new thin.core.ShapeManager(layout);
  this.activeShapes_ = new thin.core.ActiveShapeManager(layout);
  this.shapeIds_ = new thin.core.ShapeIdManager(layout);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {thin.core.ListSectionShape=} opt_sectionShapeForScope
 */
thin.core.StateManager.prototype.addShape = function(shape, opt_sectionShapeForScope) {
  if(opt_sectionShapeForScope) {
    shape.setAffiliationSection(opt_sectionShapeForScope);
  }
  this.shapes_.add(shape);
};


/**
 * @param {goog.graphics.Element} shape
 */
thin.core.StateManager.prototype.setActiveShape = function(shape) {
  this.activeShapes_.add(shape);
};


/**
 * @return {thin.core.ShapeManager}
 */
thin.core.StateManager.prototype.getShapesManager = function() {
  return this.shapes_;
};


/**
 * @return {thin.core.ActiveShapeManager}
 */
thin.core.StateManager.prototype.getActiveShape = function() {
  return this.activeShapes_;
};


/**
 * @return {Array}
 */
thin.core.StateManager.prototype.getAllShapesWithId = function() {
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
thin.core.StateManager.prototype.forEachShapeWithId = function(fn, opt_obj) {
  goog.array.forEach(this.getAllShapesWithId(), function(shape) {
    fn.call(opt_obj, shape.getShapeId(), shape);
  });
};


/**
 * @return {thin.core.ActiveShapeManager}
 */
thin.core.StateManager.prototype.getActiveShapeByIncludeList = function() {
  var listHelper = this.layout_.getHelpers().getListHelper();
  if (listHelper.isActive()) {
    var activeShapeManagerForList = listHelper.getActiveShape();
    if (!activeShapeManagerForList.isEmpty()) {
      return activeShapeManagerForList;
    }
  }
  return this.activeShapes_;
};


/**
 * @return {thin.core.ShapeIdManager}
 */
thin.core.StateManager.prototype.getShapeIdManager = function() {
  return this.shapeIds_;
};


/** @inheritDoc */
thin.core.StateManager.prototype.disposeInternal = function() {
  thin.core.StateManager.superClass_.disposeInternal.call(this);
  
  this.shapes_.dispose();
  this.activeShapes_.dispose();
  this.shapeIds_.dispose();
  delete this.shapes_;
  delete this.activeShapes_;
  delete this.shapeIds_;
};