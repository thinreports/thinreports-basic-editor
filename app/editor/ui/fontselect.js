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
goog.provide('thin.ui.FontSelectItem');

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


thin.ui.FontSelect.prototype.initValidator_ = function () {
  var fontValidator = new thin.ui.Input.Validator(this);

  fontValidator.setAllowBlank(false);
  fontValidator.setMethod(function (fontFamily) {
    fontValidator.setMessage(thin.t('error_family_is_not_a_valid_font', {'family': fontFamily}));

    var workspace = thin.core.getActiveWorkspace();

    if (workspace.getCustomFonts().contains(fontFamily)) {
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
  var customFontRegistry = thin.core.getActiveWorkspace().getCustomFonts();

  if (!customFontRegistry.contains(family)) {
    customFontRegistry.register(family);
  }
};


/**
 * @private
 */
thin.ui.FontSelect.prototype.loadFonts_ = function () {
  var workspace, customFonts;

  goog.array.forEach(thin.Font.getBuiltinFonts(),
    function(font) {
      this.addFont_(font);
    }, this);

  workspace = thin.core.getActiveWorkspace();

  if (workspace) {
    customFonts = workspace.getCustomFonts().get();

    if (!goog.array.isEmpty(customFonts)) {
      this.addItem(new thin.ui.MenuSeparator());

      goog.array.forEach(customFonts,
        function (font) {
          this.addFont_(font, !font.isValid());
        }, this);
    }
  }
};


/**
 * @param {thin.Font} font
 * @param {boolean=} opt_invalid
 * @private
 */
thin.ui.FontSelect.prototype.addFont_ = function(font, opt_invalid) {
  var item = new thin.ui.FontSelectItem(font, opt_invalid);
  item.setSticky(true);

  this.addItem(item);
};


/** @override */
thin.ui.FontSelect.prototype.enterDocument = function () {
  goog.base(this, 'enterDocument');

  var handler = this.getHandler();

  handler.listen(this.getInput(), goog.ui.Component.EventType.CHANGE,
    function (e) {
      this.registerCustomFont_(this.getValue());
    }, false, this);
};


/**
 * @override
 */
thin.ui.FontSelect.prototype.showMenu_ = function () {
  // Reload fonts before menu shown
  this.reloadFonts();

  goog.base(this, 'showMenu_');
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



/**
 * @param {thin.Font} font 
 * @param {boolean=} opt_invalid 
 * @constructor
 * @extends {thin.ui.ComboBoxItem}
 */
thin.ui.FontSelectItem = function (font, opt_invalid) {
  var renderer = goog.ui.ControlRenderer.getCustomRenderer(
        goog.ui.MenuItemRenderer, thin.ui.getCssName(thin.ui.FontSelectItem.CSS_CLASS));
 
  goog.base(this, font.getFamily(), null, /** @type {goog.ui.MenuItemRenderer} */(renderer));

  /**
   * @type {boolean?}
   * @private
   */
  this.invalid_ = opt_invalid;

  if (this.invalid_) {
    this.addClassName(thin.ui.getCssName(thin.ui.FontSelectItem.CSS_CLASS, 'invalid'));
  }
};
goog.inherits(thin.ui.FontSelectItem, thin.ui.ComboBoxItem);


/**
 * @type {string}
 */
thin.ui.FontSelectItem.CSS_CLASS = thin.ui.getCssName('thin-font-option');


/** @override */
thin.ui.FontSelectItem.prototype.enterDocument = function () {
  goog.base(this, 'enterDocument');

  if (this.invalid_) {
    this.getElement().setAttribute('title', thin.t('warning_unavailable_font_not_installed', { family: this.getContent() }));
  }
};
