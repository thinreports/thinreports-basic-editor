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

goog.provide('thin.core.workspace.CustomFontRegistry');

goog.require('goog.Disposable');
goog.require('thin.Font');


/**
 * @param {Array.<string>=} opt_families
 * @extends {goog.Disposable}
 * @constructor
 */
thin.core.workspace.CustomFontRegistry = function (opt_families) {
  goog.base(this);

  /**
   * @type {Array.<thin.Font>}
   * @private
   */
  this.fonts_ = goog.array.map(opt_families || [],
    function (family) {
      return new thin.Font(family);
    });
};
goog.inherits(thin.core.workspace.CustomFontRegistry, goog.Disposable);


/**
 * @param {string} fontFamily 
 */
thin.core.workspace.CustomFontRegistry.prototype.register = function (fontFamily) {
  this.fonts_.push(new thin.Font(fontFamily));
};


/**
 * @return {Array.<thin.Font>}
 */
thin.core.workspace.CustomFontRegistry.prototype.get = function () {
  return this.fonts_;
};


/**
 * @param {string} fontFamily
 * @return {boolean}
 */
thin.core.workspace.CustomFontRegistry.prototype.contains = function (fontFamily) {
  var families = goog.array.map(this.fonts_, function (font) { font.getFamily() });
  return goog.array.contains(families, fontFamily);
};


/**
 * @override
 */
thin.core.workspace.CustomFontRegistry.prototype.disposeInternal = function () {
  goog.base(this, 'disposeInternal');

  this.fonts_ = null;
};
