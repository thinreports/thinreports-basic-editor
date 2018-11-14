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

goog.provide('thin.ui.toolbar.ComboBox');

goog.require('thin.core');
goog.require('thin.ui.ComboBox');
goog.require('thin.ui.Input.EventType');

/**
 * @param {thin.ui.OptionMenu=} opt_menu
 * @constructor
 * @extends {thin.ui.ComboBox}
 */
thin.ui.toolbar.ComboBox = function (opt_menu) {
  goog.base(this, opt_menu);
};
goog.inherits(thin.ui.toolbar.ComboBox, thin.ui.ComboBox);


/** @override */
thin.ui.toolbar.ComboBox.prototype.enterDocument = function () {
  goog.base(this, 'enterDocument');

  var handler = this.getHandler();

  handler.listen(this.getInput(),
    [thin.ui.Input.EventType.END_EDITING, thin.ui.Input.EventType.CANCEL_EDITING],
    function (e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.focus();
      }
    }, false, this);
};
