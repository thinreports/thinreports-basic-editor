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

goog.provide('thin.editor.ClipPath');

goog.require('goog.graphics.Element');
goog.require('thin.editor.ModuleElement');


/**
 * @param {Element} element
 * @param {goog.graphics.Element} model
 * @param {goog.graphics.Element} target
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {goog.graphics.Element}
 */
thin.editor.ClipPath = function(element, model, target, layout) {
  element.appendChild(model.getElement());
  goog.graphics.Element.call(this, element, layout);
  
  /**
   * @type {goog.graphics.Element}
   * @private
   */
  this.model_ = model;
  
  /**
   * @type {goog.graphics.Element}
   * @private
   */
  this.target_ = target;

  layout.setElementAttributes(target.getElement(), {
    'clip-path': 'url(#' + layout.getElementAttribute(element, 'id') + ')'
  });
};
goog.inherits(thin.editor.ClipPath, goog.graphics.Element);


/** @inheritDoc */
thin.editor.ClipPath.prototype.disposeInternal = function() {
  this.target_.getElement().removeAttribute('clip-path');
  this.model_.dispose();

  delete this.target_;
  delete this.model_;

  thin.editor.ClipPath.superClass_.disposeInternal.call(this);
};