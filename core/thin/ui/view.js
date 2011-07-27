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

goog.provide('thin.ui.View');

goog.require('goog.ui.Component.Error');
goog.require('thin.ui.Panel');
goog.require('thin.ui.PanelRenderer');


/**
 * @param {string} caption
 * @constructor
 * @extends {thin.ui.Panel}
 */
thin.ui.View = function(caption) {
  thin.ui.Panel.call(this, caption, 
      thin.ui.PanelRenderer.getCustomRenderer(
          thin.ui.PanelRenderer, thin.ui.getCssName('thin-view')));  
};
goog.inherits(thin.ui.View, thin.ui.Panel);


/**
 * @type {goog.ui.Component?}
 * @private
 */
thin.ui.View.prototype.control_ = null;


/**
 * @return {goog.ui.Component?}
 */
thin.ui.View.prototype.getControl = function() {
  return this.control_;
};


/**
 * @param {goog.ui.Component} control
 */
thin.ui.View.prototype.setControl = function(control) {
  if (this.isInDocument()) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  this.control_ = control;
};


/** @inheritDoc */
thin.ui.View.prototype.createDom = function() {
  thin.ui.View.superClass_.createDom.call(this);
  
  if (this.control_) {
    this.addChild(this.control_, true);
  }
};


/** @inheritDoc */
thin.ui.View.prototype.disposeInternal = function() {
  thin.ui.View.superClass_.disposeInternal.call(this);
  
  delete this.control_;
};