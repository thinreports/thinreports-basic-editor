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

goog.provide('thin.ui.Component');

goog.require('goog.ui.Component');


/**
 * @constructor
 * @extends {goog.ui.Component}
 */
thin.ui.Component = function() {
  goog.ui.Component.call(this);
};
goog.inherits(thin.ui.Component, goog.ui.Component);


/**
 * @param {goog.ui.Component} child
 * @param {boolean=} opt_render
 * @return {goog.ui.Component}
 */
thin.ui.Component.prototype.addChild = function(child, opt_render) {
  thin.ui.Component.superClass_.addChild.call(this, child, opt_render);
  return child;
};


/**
 * @param {goog.ui.Component} child
 * @param {string=} opt_id
 * @param {boolean=} opt_render
 * @return {goog.ui.Component}
 */
thin.ui.Component.prototype.addChildWithId = function(child, opt_id, opt_render) {
  if (opt_id) {
    child.setId(opt_id);
  }
  return this.addChild(child, opt_render);
};


/**
 * @param {goog.ui.Component} child
 * @param {string=} opt_id
 * @param {Function=} opt_setupHandler
 * @param {boolean=} opt_render
 * @return {goog.ui.Component}
 */
thin.ui.Component.prototype.setupChild = function(child, opt_id, opt_setupHandler, opt_render) {
  this.addChildWithId(child, opt_id, opt_render);

  if (goog.isFunction(opt_setupHandler)) {
    opt_setupHandler.call(this, child);
  }
  return child;
};