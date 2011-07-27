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

goog.provide('thin.ui.FontSelect');
goog.provide('thin.ui.FontSelectOption');
goog.provide('thin.ui.FontOptionMenuRenderer');

goog.require('goog.array');
goog.require('goog.style');
goog.require('goog.ui.ControlRenderer');
goog.require('goog.ui.MenuItemRenderer');
goog.require('goog.ui.MenuSeparator');
goog.require('thin.ui.Select');
goog.require('thin.ui.Option');
goog.require('thin.ui.OptionMenu');
goog.require('thin.ui.OptionMenuRenderer');


/**
 * @param {Array.<String>} builtinFonts
 * @param {Array.<String>} systemFonts
 * @param {thin.ui.MenuButtonRenderer=} opt_renderer
 * @constructor
 * @extends {thin.ui.Select}
 */
thin.ui.FontSelect = function(builtinFonts, systemFonts, opt_renderer) {
  var menu = new thin.ui.OptionMenu(
              thin.ui.FontOptionMenuRenderer.getInstance());
  thin.ui.Select.call(this, '', menu, opt_renderer);
  
  this.addFonts(builtinFonts, systemFonts);
  this.setValue(thin.core.Font.getDefaultFont());
  this.setTextAlignLeft();
};
goog.inherits(thin.ui.FontSelect, thin.ui.Select);


/** @inheritDoc */
thin.ui.FontSelect.prototype.setValue = function(value) {
  thin.ui.FontSelect.superClass_.setValue.call(
      this, value || thin.core.Font.getDefaultFont());
};


/**
 * @param {Array.<String>} builtinFonts
 * @param {Array.<String>} systemFonts
 */
thin.ui.FontSelect.prototype.addFonts = function(builtinFonts, systemFonts) {
  goog.array.forEach(builtinFonts, function(name) {
    this.addBuiltinFont(name);
  }, this);
  
  this.addItem(new goog.ui.MenuSeparator());
  
  goog.array.forEach(systemFonts, function(name) {
    this.addSystemFont(name);
  }, this);
};


/**
 * @param {string} name
 * @private
 */
thin.ui.FontSelect.prototype.addBuiltinFont = function(name) {
  this.addFont(thin.ui.FontSelectOption.Type.BUILTIN, name);
};


/**
 * @param {string} name
 * @private
 */
thin.ui.FontSelect.prototype.addSystemFont = function(name) {
  this.addFont(thin.ui.FontSelectOption.Type.SYSTEM, name);
};


/**
 * @param {thin.ui.FontSelectOption.Type} type
 * @param {string} name
 * @private
 */
thin.ui.FontSelect.prototype.addFont = function(type, name) {
  this.addItem(new thin.ui.FontSelectOption(type, name, name));
};


/**
 * @param {thin.ui.FontSelectOption.Type} type
 * @param {goog.ui.ControlContent} name
 * @param {*=} opt_value
 * @constructor
 * @extends {thin.ui.Option}
 */
thin.ui.FontSelectOption = function(type, name, opt_value) {
  var renderer = goog.ui.ControlRenderer.getCustomRenderer(
        goog.ui.MenuItemRenderer, thin.ui.getCssName('thin-font-option'));
  thin.ui.Option.call(this, name, opt_value, 
        /** @type {goog.ui.MenuItemRenderer} */ (renderer));
  
  this.addClassName(thin.ui.getCssName(type, 'font'));
};
goog.inherits(thin.ui.FontSelectOption, thin.ui.Option);


/**
 * @enum {string}
 */
thin.ui.FontSelectOption.Type = {
  BUILTIN: 'builtin',
  SYSTEM:  'system'
};


/**
 * @constructor
 * @extends {thin.ui.OptionMenuRenderer}
 */
thin.ui.FontOptionMenuRenderer = function() {
  thin.ui.OptionMenuRenderer.call(this);
};
goog.inherits(thin.ui.FontOptionMenuRenderer, thin.ui.OptionMenuRenderer);
goog.addSingletonGetter(thin.ui.FontOptionMenuRenderer);


/**
 * @type {string}
 */
thin.ui.FontOptionMenuRenderer.CSS_CLASS =
    thin.ui.getCssName('thin-font-optionmenu');


/** @inheritDoc */
thin.ui.FontOptionMenuRenderer.prototype.getCssClass = function() {
  return thin.ui.FontOptionMenuRenderer.CSS_CLASS;
};
