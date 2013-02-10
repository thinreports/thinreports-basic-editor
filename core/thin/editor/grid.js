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

goog.provide('thin.editor.Grid');

goog.require('goog.graphics.Element');
goog.require('thin.editor.ModuleElement');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {goog.graphics.Element}
 */
thin.editor.Grid = function(layout) {
  goog.base(this, this.createElement_(layout), layout);
};
goog.inherits(thin.editor.Grid, goog.graphics.Element);
goog.mixin(thin.editor.Grid.prototype, thin.editor.ModuleElement.prototype);


/**
 * @type {string}
 * @private
 */
thin.editor.Grid.DEF_KEY_ = 'grid';


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.editor.Grid.BLACK_FILL_ = new goog.graphics.SolidFill('#F2F2F2');


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.editor.Grid.WHITE_FILL_ = new goog.graphics.SolidFill('#FFFFFF');


/**
 * @type {number}
 * @private
 */
thin.editor.RECT_SIZE_ = 15;


/**
 * @return {string}
 */
thin.editor.Grid.prototype.getDefKey = function() {
  return thin.editor.Grid.DEF_KEY_;
};


/**
 * @return {string}
 */
thin.editor.Grid.prototype.getDefId = function() {
  return this.getLayout().getElementAttribute(this.element_, 'id');
};


/**
 * @return {goog.graphics.SolidFill}
 */
thin.editor.Grid.prototype.getPatternFill = function() {
  return new goog.graphics.SolidFill('url(#' + this.getDefId() + ')');
};


/**
 * @param {thin.editor.Layout} layout
 * @return {Element}
 * @private
 */
thin.editor.Grid.prototype.createElement_ = function(layout) {
  var pattern = this.createPattern_(layout);
  var size = thin.editor.RECT_SIZE_;
  pattern.appendChild(this.createRect_(layout, new goog.math.Rect(0, 0, size, size),
      thin.editor.Grid.BLACK_FILL_).getElement());
  pattern.appendChild(this.createRect_(layout, new goog.math.Rect(size, 0, size, size),
      thin.editor.Grid.WHITE_FILL_).getElement());
  pattern.appendChild(this.createRect_(layout, new goog.math.Rect(size, size, size, size),
      thin.editor.Grid.BLACK_FILL_).getElement());
  pattern.appendChild(this.createRect_(layout, new goog.math.Rect(0, size, size, size),
      thin.editor.Grid.WHITE_FILL_).getElement());
  
  return pattern;
};


/**
 * @param {thin.editor.Layout} layout
 * @param {goog.math.Rect} bounds
 * @param {goog.graphics.SolidFill} fill
 * @return {thin.editor.Rect}
 * @private
 */
thin.editor.Grid.prototype.createRect_ = function(layout, bounds, fill) {
  var rect = new thin.editor.Rect(layout.createSvgElement('rect'), layout, null, fill);
  rect.setBounds(bounds);
  return rect;
};


/**
 * @param {thin.editor.Layout} layout
 * @return {Element}
 * @private
 */
thin.editor.Grid.prototype.createPattern_ = function(layout) {
  var size = thin.editor.RECT_SIZE_ * 2;
  return layout.createSvgElement('pattern', {
    'patternUnits': 'userSpaceOnUse',
    'x': 0,
    'y': 0,
    'width': size,
    'height': size
  });
};