//  Copyright (C) 2012 Matsukei Co.,Ltd.
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

goog.provide('thin.I18n');

goog.require('goog.Disposable');


/**
 * @constructor
 * @extends {goog.Disposable}
 */
thin.I18n = function() {
  goog.base(this);

  /**
   * @type {Object}
   * @private
   */
  this.translations_ = /** @type {Object} */(thin.$('translations'));
};
goog.inherits(thin.I18n, goog.Disposable);
goog.addSingletonGetter(thin.I18n);


/**
 * @param {string} name
 * @param {Object=} opt_values
 * @return {string}
 */
thin.I18n.prototype.translate = function(name, opt_values) {
  return goog.getMsg(this.translations_[name], opt_values) || name;
};


/**
 * Shorthand of #translate
 * @see thin.I18n.translate
 */
thin.I18n.prototype.t = thin.I18n.prototype.translate;


/** @override */
thin.I18n.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  
  this.translations_ = null;
};


thin.i18n = thin.I18n.getInstance();
