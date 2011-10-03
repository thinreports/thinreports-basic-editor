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

goog.provide('thin.editor.ShapeIdManager');
goog.provide('thin.editor.ShapeIdManager.DefaultPrefix');

goog.require('goog.array');
goog.require('goog.object');
goog.require('thin.editor.AbstractManager');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.AbstractManager}
 */
thin.editor.ShapeIdManager = function(layout) {
  thin.editor.AbstractManager.call(this, layout);
  
  /**
   * @type {Object}
   * @private
   */
  this.indexes_ = {};
};
goog.inherits(thin.editor.ShapeIdManager, thin.editor.AbstractManager);


/**
 * @enum {string}
 */
thin.editor.ShapeIdManager.DefaultPrefix = {
  TEXT_BLOCK: 'text',
  IMAGE_BLOCK: 'image',
  LIST: 'list'
};


/**
 * @type {string}
 * @private
 */
thin.editor.ShapeIdManager.DEFAULT_CONNECT_ = '#';


/**
 * @type {number}
 * @private
 */
thin.editor.ShapeIdManager.DEFAULT_INDEX_ = 0;


/**
 * @type {RegExp}
 * @private
 */
thin.editor.ShapeIdManager.PATTERN_ = /#[1-9]?\d+$/;


/**
 * @param {string} shapeId
 * @return {string}
 */
thin.editor.ShapeIdManager.getShapeIdPrefix = function(shapeId) {
  return shapeId ? shapeId.replace(thin.editor.ShapeIdManager.PATTERN_, '') : '';
};


/**
 * @param {string} shapeId
 * @return {number}
 */
thin.editor.ShapeIdManager.getShapeIdIndexes = function(shapeId) {
  var result = shapeId.match(thin.editor.ShapeIdManager.PATTERN_);
  if(goog.isDefAndNotNull(result)) {
    return Number(result[0].replace(/#/, ''));
  } else {
    return 0;
  }
};


/**
 * @param {string} prefix
 * @return {string}
 */
thin.editor.ShapeIdManager.prototype.getNextId = function(prefix) {
  var suffixes = this.get(prefix);
  
  if (goog.array.isEmpty(suffixes)) {
    return prefix;
  } else {
    var suffix = 1;
    var suffixeIndexes = goog.array.map(suffixes, goog.bind(function(shape, count) {
      return thin.editor.ShapeIdManager.getShapeIdIndexes(shape.getShapeId());
    }, this));
    goog.array.sort(suffixeIndexes);
    goog.array.forEach(suffixeIndexes, function(existSuffix) {
      if (suffix >= existSuffix) {
        suffix = existSuffix + 1;
      }
    });
    return prefix + thin.editor.ShapeIdManager.DEFAULT_CONNECT_ + suffix;
  }
};


/**
 * @param {string} shapeId
 * @return {goog.graphics.Element?}
 */
thin.editor.ShapeIdManager.prototype.getShapeForShapeId = function(shapeId) {
  var targetArray = this.get(thin.editor.ShapeIdManager.getShapeIdPrefix(shapeId));
  var resultIndex = goog.array.findIndex(targetArray, function(shape) {
    return shape.getShapeId() == shapeId;
  });
  return targetArray[resultIndex];
};


/**
 * @param {goog.graphics.Element} shape
 * @param {string} oldPrefix
 * @param {string} newPrefix
 */
thin.editor.ShapeIdManager.prototype.changePrefix = function(shape, oldPrefix, newPrefix) {
  this.remove(shape, oldPrefix);
  if (!goog.string.isEmpty(newPrefix)) {
    this.add(shape, newPrefix);
  }
};


/**
 * @return {Array.<Object>}
 */
thin.editor.ShapeIdManager.prototype.getAll = function() {
  return goog.array.flatten(goog.object.getValues(this.indexes_));
};


/**
 * @param {string} prefix
 * @return {Array}
 */
thin.editor.ShapeIdManager.prototype.get = function(prefix) {
  if(!goog.isDef(goog.object.get(this.indexes_, prefix))) {
    goog.object.set(this.indexes_, prefix, []);
  }
  return this.indexes_[prefix];
};


/**
 * @param {string} prefix
 * @return {number}
 */
thin.editor.ShapeIdManager.prototype.getCount = function(prefix) {
  return this.get(prefix).length;
};


/**
 * @param {goog.graphics.Element} shape
 * @param {string=} opt_prefix
 */
thin.editor.ShapeIdManager.prototype.remove = function(shape, opt_prefix) {
  if (goog.isDefAndNotNull(opt_prefix)) {
    this.remove_(shape, opt_prefix);
  } else {
    var shapeId = shape.getShapeId();
    if (goog.isDefAndNotNull(shapeId)) {
      this.remove_(shape, thin.editor.ShapeIdManager.getShapeIdPrefix(shapeId));
    }
  }
};


/**
 * @param {goog.graphics.Element} shape
 * @param {string} prefix
 * @private
 */
thin.editor.ShapeIdManager.prototype.remove_ = function(shape, prefix) {
  goog.array.remove(this.get(prefix), shape);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {string} prefix
 */
thin.editor.ShapeIdManager.prototype.add = function(shape, prefix) {
  goog.array.insert(this.get(prefix), shape);
};


/** @inheritDoc */
thin.editor.ShapeIdManager.prototype.disposeInternal = function() {
  thin.editor.ShapeIdManager.superClass_.disposeInternal.call(this);
  
  delete this.indexes_;
};