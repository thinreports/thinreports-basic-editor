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
thin.editor.Grid.BG_FILL_ = new goog.graphics.SolidFill('#FFFFFF');


/**
 * @type {goog.graphics.Stroke}
 * @private
 */
thin.editor.Grid.BG_STROKE_ = new goog.graphics.Stroke(0.5, '#666666');


/**
 * @type {goog.graphics.Stroke}
 * @private
 */
thin.editor.Grid.LINE_STROKE_ = new goog.graphics.Stroke(0.3, '#666666');


/**
 * @type {number}
 * @private
 */
thin.editor.Grid.BG_SIZE_ = 50;


/**
 * @type {number}
 * @private
 */
thin.editor.Grid.LINE_INTERVAL_ = 10;


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
  var bg = this.createRect_(layout);
  pattern.appendChild(bg.getElement());

  var bg_size = thin.editor.Grid.BG_SIZE_;
  var interval = thin.editor.Grid.LINE_INTERVAL_;
  for (var pos = interval; pos < bg_size; pos += interval) {
    var line_x = this.createLine_(layout, {
      'x1': 0,
      'x2': bg_size,
      'y1': pos,
      'y2': pos
    });
    pattern.appendChild(line_x.getElement());

    var line_y = this.createLine_(layout, {
      'x1': pos,
      'x2': pos,
      'y1': 0,
      'y2': bg_size
    });
    pattern.appendChild(line_y.getElement());
  }

  return pattern;
};


/**
 * @param {thin.editor.Layout} layout
 * @return {thin.editor.Rect}
 * @private
 */
thin.editor.Grid.prototype.createRect_ = function(layout) {
  var rect = new thin.editor.Rect(layout.createSvgElement('rect'),
    layout, thin.editor.Grid.BG_STROKE_, thin.editor.Grid.BG_FILL_);
  var bg_size = thin.editor.Grid.BG_SIZE_;
  rect.setBounds(new goog.math.Rect(0, 0, bg_size, bg_size));

  return rect;
};


/**
 * @param {thin.editor.Layout} layout
 * @param {Object} attrs
 * @return {thin.editor.Line}
 * @private
 */
thin.editor.Grid.prototype.createLine_ = function(layout, attrs) {
  var line = new thin.editor.Line(layout.createSvgElement('line', attrs),
    layout, thin.editor.Grid.LINE_STROKE_);
  line.setStrokeDashFromType(thin.editor.ModuleElement.StrokeType.DOTTED);

  return line;
};


/**
 * @param {thin.editor.Layout} layout
 * @return {Element}
 * @private
 */
thin.editor.Grid.prototype.createPattern_ = function(layout) {
  var bg_size = thin.editor.Grid.BG_SIZE_;
  return layout.createSvgElement('pattern', {
    'patternUnits': 'userSpaceOnUse',
    'x': 0,
    'y': 0,
    'width': bg_size,
    'height': bg_size
  });
};