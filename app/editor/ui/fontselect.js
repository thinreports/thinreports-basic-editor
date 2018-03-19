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
goog.provide('thin.ui.FontOptionMenuRenderer');

goog.require('goog.array');
goog.require('goog.style');
goog.require('thin.Font');

goog.require('thin.ui.ComboBox');
goog.require('thin.ui.ComboBoxItem');

goog.require('thin.ui.OptionMenu');
goog.require('thin.ui.OptionMenuRenderer');


/**
 * @param {Array.<thin.Font>} fonts
 * @param {!thin.ui.FontOptionMenuRenderer=} opt_menuRenderer
 * @constructor
 * @extends {thin.ui.ComboBox}
 */
thin.ui.FontSelect = function(fonts, opt_menuRenderer) {
  var menu = new thin.ui.OptionMenu(
              opt_menuRenderer || thin.ui.FontOptionMenuRenderer.getInstance());
  goog.base(this, menu);

  this.addFonts(fonts);
  this.setValue(thin.Font.getDefaultFontFamily());
  this.setTextAlignLeft();
};
goog.inherits(thin.ui.FontSelect, thin.ui.ComboBox);


/** @inheritDoc */
thin.ui.FontSelect.prototype.setValue = function(name) {
  goog.base(this, 'setValue', name || thin.Font.getDefaultFontFamily());
};


/**
 * @param {Array.<thin.Font>} fonts
 */
thin.ui.FontSelect.prototype.addFonts = function(fonts) {
  goog.array.forEach(fonts, function(font) {
    this.addFont(font);
  }, this);
};


/**
 * @param {thin.Font} font
 */
thin.ui.FontSelect.prototype.addFont = function(font) {
  var item = new thin.ui.ComboBoxItem(font.getFamily());
  item.setSticky(true);
  this.addItem(item);
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
