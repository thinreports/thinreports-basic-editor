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

goog.provide('thin.core.layout.AllUsedFontFamilies');

goog.require('goog.array');
goog.require('goog.Disposable');
goog.require('thin.core.ListShape');
goog.require('thin.core.AbstractTextGroup');


/**
 * @param {thin.core.Layout} layout 
 * @constructor
 * @extends {goog.Disposable}
 */
thin.core.layout.AllUsedFontFamilies = function (layout) {
  /**
   * @type {thin.core.layout}
   * @private
   */
  this.layout_ = layout;
};
goog.inherits(thin.core.layout.AllUsedFontFamilies, goog.Disposable);


/**
 * @param {thin.core.layout} layout
 * @return {Array.<string>}
 */
thin.core.layout.AllUsedFontFamilies.get = function (layout) {
  var action = new thin.core.layout.AllUsedFontFamilies(layout);
  return action.get();
};


/**
 * @return {Array.<string>}
 */
thin.core.layout.AllUsedFontFamilies.prototype.get = function () {
  var shapesInLayout = this.layout_.getManager().getShapesManager().get();
  return this.get_(shapesInLayout);
};


/**
 * @param {Array} shapes Array.<Shape>
 * @private
 */
thin.core.layout.AllUsedFontFamilies.prototype.get_ = function (shapes) {
  var targetShapes = this.filterTarget_(shapes);

  var families = goog.array.map(targetShapes,
      function (shape) {
        if (shape instanceof thin.core.ListShape) {
          return /** @type {Array.<string>} */(this.getInListShape_(shape));
        } else if (shape instanceof thin.core.AbstractTextGroup) {
          return /** @type {string} */(shape.getFontFamily());
        }
      }, this);

  return goog.array.flatten(families);
};


/**
 * @param {thin.core.ListShape} shape 
 * @return {Array.<string>}
 */
thin.core.layout.AllUsedFontFamilies.prototype.getInListShape_ = function (shape) {
  var familiesEachSection = [];

  shape.forEachSectionShape(function (section) {
    familiesEachSection.push(this.get_(section.getManager().getShapesManager().get()));
  }, this)

  return goog.array.flatten(familiesEachSection);
};


/*
 * @param {Array} shapes Array.<Shape>
 * @return {Array} Filtered shapes
 * @private
 */
thin.core.layout.AllUsedFontFamilies.prototype.filterTarget_ = function (shapes) {
  return goog.array.filter(shapes, function (shape) {
    return shape instanceof thin.core.ListShape || shape instanceof thin.core.AbstractTextGroup;
  });
};


/**
 * @override
 */
thin.core.layout.AllUsedFontFamilies.prototype.disposeInternal = function () {
  goog.base(this, 'disposeInternal');

  this.layout_ = null;
  delete this.layout_;
};
