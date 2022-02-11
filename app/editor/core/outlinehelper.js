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

goog.provide('thin.core.OutlineHelper');

goog.require('thin.core.Component');
goog.require('thin.core.SelectorOutline');


/**
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {thin.core.Component}
 */
thin.core.OutlineHelper = function(layout) {
  thin.core.Component.call(this, layout);
};
goog.inherits(thin.core.OutlineHelper, thin.core.Component);


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.core.OutlineHelper.FILL_ = new goog.graphics.SolidFill('none');


/**
 * @type {goog.graphics.Stroke}
 * @private
 */
thin.core.OutlineHelper.STROKE_ = new goog.graphics.Stroke('1px', '#0096fd');


/**
 * @type {boolean}
 * @private
 */
thin.core.OutlineHelper.MULTIPLE_ = false;


/**
 * @type {thin.core.RectOutline}
 * @private
 */
thin.core.OutlineHelper.prototype.rectOutline_;


/**
 * @type {thin.core.EllipseOutline}
 * @private
 */
thin.core.OutlineHelper.prototype.ellipseOutline_;


/**
 * @type {thin.core.LineOutline}
 * @private
 */
thin.core.OutlineHelper.prototype.lineOutline_;


/**
 * @type {thin.core.TblockOutline}
 * @private
 */
thin.core.OutlineHelper.prototype.tblockOutline_;


/**
 * @type {thin.core.PageNumberOutline}
 * @private
 */
thin.core.OutlineHelper.prototype.pageNumberOutline_;


/**
 * @type {thin.core.ImageblockOutline}
 * @private
 */
thin.core.OutlineHelper.prototype.imageblockOutline_;


/**
 * @type {thin.core.TextOutline}
 * @private
 */
thin.core.OutlineHelper.prototype.textOutline_;


/**
 * @type {thin.core.ListOutline}
 * @private
 */
thin.core.OutlineHelper.prototype.listOutline_;


/**
 * @type {thin.core.SelectorOutline}
 * @private
 */
thin.core.OutlineHelper.prototype.selectorOutline_;


/**
 * @type {thin.core.ImageOutline}
 * @private
 */
thin.core.OutlineHelper.prototype.imageOutline_;


thin.core.OutlineHelper.prototype.reapplyStroke = function() {
  this.listOutline_.reapplyStroke();
  this.ellipseOutline_.reapplyStroke();
  this.rectOutline_.reapplyStroke();
  this.lineOutline_.reapplyStroke();
  this.tblockOutline_.reapplyStroke();
  this.pageNumberOutline_.reapplyStroke();
  this.textOutline_.reapplyStroke();
  this.selectorOutline_.reapplyStroke();
  this.getImageOutline().reapplyStroke();
};


/**
 * @return {thin.core.RectOutline}
 */
thin.core.OutlineHelper.prototype.getRectOutline = function() {
  return this.rectOutline_;
};


/**
 * @return {thin.core.EllipseOutline}
 */
thin.core.OutlineHelper.prototype.getEllipseOutline = function() {
  return this.ellipseOutline_;
};


/**
 * @return {thin.core.LineOutline}
 */
thin.core.OutlineHelper.prototype.getLineOutline = function() {
  return this.lineOutline_;
};


/**
 * @return {thin.core.TblockOutline}
 */
thin.core.OutlineHelper.prototype.getTblockOutline = function() {
  return this.tblockOutline_;
};


/**
 * @return {thin.core.PageNumberOutline}
 */
thin.core.OutlineHelper.prototype.getPageNumberOutline = function() {
  return this.pageNumberOutline_;
};


/**
 * @return {thin.core.ImageblockOutline}
 */
thin.core.OutlineHelper.prototype.getImageblockOutline = function() {
  return this.imageblockOutline_;
};


/**
 * @return {thin.core.TextOutline}
 */
thin.core.OutlineHelper.prototype.getTextOutline = function() {
  return this.textOutline_;
};


/**
 * @return {thin.core.ListOutline}
 */
thin.core.OutlineHelper.prototype.getListOutline = function() {
  return this.listOutline_;
};


/**
 * @return {thin.core.ImageOutline}
 */
thin.core.OutlineHelper.prototype.getImageOutline = function() {
  return this.imageOutline_;
};


/**
 * @return {thin.core.SelectorOutline}
 */
thin.core.OutlineHelper.prototype.getSelectorOutline = function() {
  return this.selectorOutline_;
};


/**
 * @param {goog.graphics.Element} outline
 */
thin.core.OutlineHelper.prototype.disable = function(outline) {
  outline.setVisibled(false);
};


/**
 * @param {goog.graphics.Element} outline
 */
thin.core.OutlineHelper.prototype.enable = function(outline) {
  outline.setVisibled(true);
};


/**
 * @return {boolean}
 */
thin.core.OutlineHelper.prototype.isMultiple = function() {
  return thin.core.OutlineHelper.MULTIPLE_;
};


thin.core.OutlineHelper.prototype.setup = function() {
  var layout = this.getLayout();
  var helpers = layout.getHelpers();
  var fill = thin.core.OutlineHelper.FILL_;
  var stroke = thin.core.OutlineHelper.STROKE_;

  var list = helpers.createListOutline(this, stroke, fill);
  var rect = helpers.createRectOutline(this, stroke, fill);
  var tblock = helpers.createTblockOutline(this, stroke, fill);
  var pagenumber = helpers.createPageNumberOutline(this, stroke, fill);
  var iblock = helpers.createImageblockOutline(this, stroke, fill);
  var image = helpers.createImageOutline(this, stroke, fill);
  var ellipse = helpers.createEllipseOutline(this, stroke, fill);
  var line = helpers.createLineOutline(this, stroke);
  var text = helpers.createTextOutline(this, stroke, fill);
  var selector = new thin.core.SelectorOutline(
        layout.createSvgElement('rect'), layout, stroke, null);
  selector.setOutlineHelper(this);

  list.disable();
  rect.disable();
  tblock.disable();
  pagenumber.disable();
  iblock.disable();
  ellipse.disable();
  line.disable();
  text.disable();
  selector.disable();
  image.disable();
  this.listOutline_ = list;
  this.rectOutline_ = rect;
  this.tblockOutline_ = tblock;
  this.pageNumberOutline_ = pagenumber;
  this.imageblockOutline_ = iblock;
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
  layout.appendChild(this.pageNumberOutline_, this);
  layout.appendChild(this.imageblockOutline_, this);
  layout.appendChild(this.textOutline_, this);
  layout.appendChild(this.selectorOutline_, this);
  layout.appendChild(this.imageOutline_, this);
};


/** @inheritDoc */
thin.core.OutlineHelper.prototype.disposeInternal = function() {

  this.rectOutline_.dispose();
  this.ellipseOutline_.dispose();
  this.tblockOutline_.dispose();
  this.pageNumberOutline_.dispose();
  this.imageblockOutline_.dispose();
  this.textOutline_.dispose();
  this.lineOutline_.dispose();
  this.selectorOutline_.dispose();
  this.listOutline_.dispose();
  this.imageOutline_.dispose();

  delete this.rectOutline_;
  delete this.ellipseOutline_;
  delete this.tblockOutline_;
  delete this.pageNumberOutline_;
  delete this.imageblockOutline_;
  delete this.textOutline_;
  delete this.lineOutline_;
  delete this.selectorOutline_;
  delete this.listOutline_;
  delete this.imageOutline_;

  thin.core.OutlineHelper.superClass_.disposeInternal.call(this);
};
