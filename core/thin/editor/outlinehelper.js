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

goog.provide('thin.editor.OutlineHelper');

goog.require('thin.editor.Component');
goog.require('thin.editor.SelectorOutline');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.Component}
 */
thin.editor.OutlineHelper = function(layout) {
  thin.editor.Component.call(this, layout);
};
goog.inherits(thin.editor.OutlineHelper, thin.editor.Component);


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.editor.OutlineHelper.FILL_ = new goog.graphics.SolidFill('none');


/**
 * @type {goog.graphics.Stroke}
 * @private
 */
thin.editor.OutlineHelper.STROKE_ = new goog.graphics.Stroke('1px', '#0000FF');


/**
 * @type {boolean}
 * @private
 */
thin.editor.OutlineHelper.MULTIPLE_ = false;


/**
 * @type {thin.editor.RectOutline}
 * @private
 */
thin.editor.OutlineHelper.prototype.rectOutline_;


/**
 * @type {thin.editor.EllipseOutline}
 * @private
 */
thin.editor.OutlineHelper.prototype.ellipseOutline_;


/**
 * @type {thin.editor.LineOutline}
 * @private
 */
thin.editor.OutlineHelper.prototype.lineOutline_;


/**
 * @type {thin.editor.TblockOutline}
 * @private
 */
thin.editor.OutlineHelper.prototype.tblockOutline_;


/**
 * @type {thin.editor.TextOutline}
 * @private
 */
thin.editor.OutlineHelper.prototype.textOutline_;


/**
 * @type {thin.editor.ListOutline}
 * @private
 */
thin.editor.OutlineHelper.prototype.listOutline_;


/**
 * @type {thin.editor.SelectorOutline}
 * @private
 */
thin.editor.OutlineHelper.prototype.selectorOutline_;


/**
 * @type {thin.editor.ImageOutline}
 * @private
 */
thin.editor.OutlineHelper.prototype.imageOutline_;


thin.editor.OutlineHelper.prototype.reapplyStroke = function() {
  this.listOutline_.reapplyStroke();
  this.ellipseOutline_.reapplyStroke();
  this.rectOutline_.reapplyStroke();
  this.lineOutline_.reapplyStroke();
  this.tblockOutline_.reapplyStroke();
  this.textOutline_.reapplyStroke();
  this.selectorOutline_.reapplyStroke();
  this.getImageOutline().reapplyStroke();
};


/**
 * @return {thin.editor.RectOutline}
 */
thin.editor.OutlineHelper.prototype.getRectOutline = function() {
  return this.rectOutline_;
};


/**
 * @return {thin.editor.EllipseOutline}
 */
thin.editor.OutlineHelper.prototype.getEllipseOutline = function() {
  return this.ellipseOutline_;
};


/**
 * @return {thin.editor.LineOutline}
 */
thin.editor.OutlineHelper.prototype.getLineOutline = function() {
  return this.lineOutline_;
};


/**
 * @return {thin.editor.TblockOutline}
 */
thin.editor.OutlineHelper.prototype.getTblockOutline = function() {
  return this.tblockOutline_;
};


/**
 * @return {thin.editor.TextOutline}
 */
thin.editor.OutlineHelper.prototype.getTextOutline = function() {
  return this.textOutline_;
};


/**
 * @return {thin.editor.ListOutline}
 */
thin.editor.OutlineHelper.prototype.getListOutline = function() {
  return this.listOutline_;
};


/**
 * @return {thin.editor.ImageOutline}
 */
thin.editor.OutlineHelper.prototype.getImageOutline = function() {
  return this.imageOutline_;
};


/**
 * @return {thin.editor.SelectorOutline}
 */
thin.editor.OutlineHelper.prototype.getSelectorOutline = function() {
  return this.selectorOutline_;
};


/**
 * @param {goog.graphics.Element} outline
 */
thin.editor.OutlineHelper.prototype.disable = function(outline) {
  outline.setVisibled(false);
};


/**
 * @param {goog.graphics.Element} outline
 */
thin.editor.OutlineHelper.prototype.enable = function(outline) {
  outline.setVisibled(true);
};


/**
 * @return {boolean}
 */
thin.editor.OutlineHelper.prototype.isMultiple = function() {
  return thin.editor.OutlineHelper.MULTIPLE_;
};


thin.editor.OutlineHelper.prototype.setup = function() {
  var layout = this.getLayout();
  var helpers = layout.getHelpers();
  var outlineHelper = thin.editor.OutlineHelper;
  var fill = outlineHelper.FILL_;
  var stroke = outlineHelper.STROKE_;
  var rectAttr = {
    'x': 0,
    'y': 0,
    'width': 0,
    'height': 0
  };
  var list = helpers.createListOutline(rectAttr, stroke, fill, this);
  var rect = helpers.createRectOutline(rectAttr, stroke, fill, this);
  var tblock = helpers.createTblockOutline(rectAttr, stroke, fill, this);
  var image = helpers.createImageOutline(rectAttr, stroke, fill, this);

  var ellipse = helpers.createEllipseOutline({
    'cx': 0,
    'cy': 0,
    'rx': 0,
    'ry': 0
  }, stroke, fill, this);

  var line = helpers.createLineOutline({
    'x1': 0,
    'y1': 0,
    'x2': 0,
    'y2': 0
  }, stroke, this);

  var text = helpers.createTextOutline(rectAttr, stroke, fill, this);
  var workspace = this.getLayout().getWorkspace();
  var selector = new thin.editor.SelectorOutline(
        layout.createSvgElement('rect', rectAttr), layout, stroke, null);
  selector.setOutlineHelper(this);
  
  list.disable();
  rect.disable();
  tblock.disable();
  ellipse.disable();
  line.disable();
  text.disable();
  selector.disable();
  image.disable();
  this.listOutline_ = list;
  this.rectOutline_ = rect;
  this.tblockOutline_ = tblock;
  this.ellipseOutline_ = ellipse;
  this.lineOutline_ = line;
  this.textOutline_ = text;
  this.imageOutline_ = image;
  this.selectorOutline_ = selector;  
  layout.appendChild(this.listOutline_, this);
  layout.appendChild(this.lineOutline_, this);
  layout.appendChild(this.ellipseOutline_, this);
  layout.appendChild(this.rectOutline_, this);
  layout.appendChild(this.tblockOutline_, this);
  layout.appendChild(this.textOutline_, this);
  layout.appendChild(this.selectorOutline_, this);
  layout.appendChild(this.imageOutline_, this);
};


/** @inheritDoc */
thin.editor.OutlineHelper.prototype.disposeInternal = function() {

  this.rectOutline_.dispose();
  this.ellipseOutline_.dispose();
  this.tblockOutline_.dispose();
  this.textOutline_.dispose();
  this.lineOutline_.dispose();
  this.selectorOutline_.dispose();
  this.listOutline_.dispose();
  this.imageOutline_.dispose();

  delete this.rectOutline_;
  delete this.ellipseOutline_;
  delete this.tblockOutline_;
  delete this.textOutline_;
  delete this.lineOutline_;
  delete this.selectorOutline_;
  delete this.listOutline_;
  delete this.imageOutline_;
  
  thin.editor.OutlineHelper.superClass_.disposeInternal.call(this);
};