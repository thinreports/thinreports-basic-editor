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

goog.provide('thin.ui.FontSelect');
goog.provide('thin.ui.FontSelectOption');
goog.provide('thin.ui.FontOptionMenuRenderer');

goog.require('goog.array');
goog.require('goog.style');
goog.require('goog.ui.ControlRenderer');
goog.require('goog.ui.MenuItemRenderer');
goog.require('goog.ui.MenuSeparator');
goog.require('thin.Font');
goog.require('thin.ui.Select');
goog.require('thin.ui.Option');
goog.require('thin.ui.OptionMenu');
goog.require('thin.ui.OptionMenuRenderer');


/**
 * @param {Array.<thin.Font>} fonts
 * @param {thin.ui.MenuButtonRenderer=} opt_renderer
 * @constructor
 * @extends {thin.ui.Select}
 */
thin.ui.FontSelect = function(fonts, opt_renderer) {
  var menu = new thin.ui.OptionMenu(
              thin.ui.FontOptionMenuRenderer.getInstance());
  goog.base(this, '', menu, opt_renderer);
  
  this.addFonts(fonts);
  this.setValue(thin.Font.getDefaultFontFamily());
  this.setTextAlignLeft();
};
goog.inherits(thin.ui.FontSelect, thin.ui.Select);


/** @inheritDoc */
thin.ui.FontSelect.prototype.setValue = function(name) {
  goog.base(this, 'setValue', name || thin.Font.getDefaultFontFamily());
};


/**
 * @param {Array.<thin.Font>} fonts
 */
thin.ui.FontSelect.prototype.addFonts = function(fonts) {
  var family;

  goog.array.forEach(fonts, function(font) {
    family = font.getFamily();
    if (family == 'IPAMincho') {
      this.addItem(new goog.ui.MenuSeparator());
    }
    this.addBuiltinFont(family, font.getName());
  }, this);
};


/**
 * @param {string} family
 * @param {string} name
 */
thin.ui.FontSelect.prototype.addBuiltinFont = function(family, name) {
  this.addFont(thin.ui.FontSelectOption.Type.BUILTIN, family, name);
};


/**
 * @param {thin.ui.FontSelectOption.Type} type
 * @param {string} family
 * @param {string} name
 */
thin.ui.FontSelect.prototype.addFont = function(type, family, name) {
  this.addItem(new thin.ui.FontSelectOption(type, family, name));
};


/**
 * @param {thin.ui.FontSelectOption.Type} type
 * @param {string} family
 * @param {goog.ui.ControlContent} name
 * @constructor
 * @extends {thin.ui.Option}
 */
thin.ui.FontSelectOption = function(type, family, name) {
  var renderer = goog.ui.ControlRenderer.getCustomRenderer(
        goog.ui.MenuItemRenderer, thin.ui.getCssName('thin-font-option'));
  goog.base(this, name, family,
      /** @type {goog.ui.MenuItemRenderer} */ (renderer));
  
  this.addClassName(thin.ui.getCssName(type, 'font'));
};
goog.inherits(thin.ui.FontSelectOption, thin.ui.Option);


/**
 * @enum {string}
 */
thin.ui.FontSelectOption.Type = {
  BUILTIN: 'builtin'
};


/**
 * @constructor
 * @extends {thin.ui.OptionMenuRenderer}
 */
thin.ui.FontOptionMenuRenderer = function() {
  goog.base(this);
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
