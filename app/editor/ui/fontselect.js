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
goog.require('thin.platform.FontValidator');

goog.require('thin.ui.ComboBox');
goog.require('thin.ui.ComboBoxItem');

goog.require('thin.ui.OptionMenu');
goog.require('thin.ui.OptionMenuRenderer');
goog.require('thin.ui.MenuSeparator');

goog.require('thin.ui.Input.Validator');


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

  this.loadFonts_();
  this.setValue(thin.Font.getDefaultFontFamily());
  this.setTextAlignLeft();

  this.initValidator_();
};
goog.inherits(thin.ui.FontSelect, thin.ui.ComboBox);


/**
 * @type {Array.<thin.ui.FontSelect>}
 * @private
 */
thin.ui.FontSelect.activeControlRegistry_ = [];


/**
 * @param {thin.ui.FontSelect} control
 */
thin.ui.FontSelect.registerControl = function (control) {
  goog.array.insert(thin.ui.FontSelect.activeControlRegistry_, control);
};


/**
 * @param {thin.ui.FontSelect} control
 */
thin.ui.FontSelect.unregisterControl = function (control) {
  goog.array.remove(thin.ui.FontSelect.activeControlRegistry_, control);
};


thin.ui.FontSelect.reloadFontsOfAllControls = function () {
  goog.array.forEach(thin.ui.FontSelect.activeControlRegistry_,
    function (control) {
      control.reloadFonts();
    });
};


thin.ui.FontSelect.prototype.initValidator_ = function () {
  var fontValidator = new thin.ui.Input.Validator(this);

  fontValidator.setAllowBlank(false);
  fontValidator.setMethod(function (fontFamily) {
    fontValidator.setMessage(thin.t('error_family_is_not_a_valid_font', {'family': fontFamily}));

    if (thin.Font.isRegistered(fontFamily)) {
      return true;
    }
    if (thin.platform.FontValidator.validate(fontFamily)) {
      return true;
    }

    return false;
  });

  this.getInput().setValidator(fontValidator);
};


/** @inheritDoc */
thin.ui.FontSelect.prototype.setValue = function(name) {
  goog.base(this, 'setValue', name || thin.Font.getDefaultFontFamily());
};


thin.ui.FontSelect.prototype.reloadFonts = function () {
  this.getMenu().removeChildren(true);
  this.loadFonts_();
};


/**
 * @param {string} family
 * @private
 */
thin.ui.FontSelect.prototype.registerCustomFont_ = function (family) {
  if (!thin.Font.isRegistered(family)) {
    thin.Font.register(family);

    thin.ui.FontSelect.reloadFontsOfAllControls();
  }
};


/**
 * @private
 */
thin.ui.FontSelect.prototype.loadFonts_ = function () {
  goog.array.forEach(thin.Font.getBuiltinFonts(),
    function(font) {
      this.addFont_(font);
    }, this);

  var customFonts = thin.Font.getCustomFonts();

  if (!goog.array.isEmpty(customFonts)) {
    this.addItem(new thin.ui.MenuSeparator());

    goog.array.forEach(customFonts,
      function (font) {
        this.addFont_(font);
      }, this);
  }
};


/**
 * @param {thin.Font} font
 * @private
 */
thin.ui.FontSelect.prototype.addFont_ = function(font) {
  var item = new thin.ui.ComboBoxItem(font.getFamily());
  item.setSticky(true);
  this.addItem(item);
};


/** @override */
thin.ui.FontSelect.prototype.enterDocument = function () {
  goog.base(this, 'enterDocument');

  thin.ui.FontSelect.registerControl(this);

  var handler = this.getHandler();

  handler.listen(this.getInput(), goog.ui.Component.EventType.CHANGE,
    function (e) {
      this.registerCustomFont_(this.getValue());
    }, false, this);
};


/** @override */
thin.ui.FontSelect.prototype.exitDocument = function () {
  goog.base(this, 'exitDocument');

  thin.ui.FontSelect.unregisterControl(this);
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
