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

goog.provide('thin.ui.SplitToggleButton');

goog.require('goog.ui.Component.State');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.ControlRenderer');
goog.require('goog.ui.ButtonRenderer');
goog.require('thin.ui.SplitButton');
goog.require('thin.ui.SplitButtonRenderer');
goog.require('thin.ui.ToggleButton');


/**
 * @param {goog.ui.ControlContent} content
 * @param {thin.ui.Icon=} opt_icon
 * @param {thin.ui.SplitButton.Orientation=} opt_orientation
 * @param {thin.ui.SplitButtonRenderer=} opt_renderer
 * @constructor
 * @extends {thin.ui.SplitButton}
 */
thin.ui.SplitToggleButton = function(content, opt_icon, opt_orientation, opt_renderer) {
  thin.ui.SplitButton.call(this, content, opt_icon, opt_orientation, opt_renderer); 
  
  /** @inheritDoc */
  this.button_ = new thin.ui.ToggleButton(content, opt_icon, 
      /** @type {thin.ui.ButtonRenderer} */ (
        goog.ui.ControlRenderer.getCustomRenderer(
          thin.ui.ButtonRenderer, thin.ui.getCssName(
            thin.ui.SplitButtonRenderer.CSS_CLASS, 'button'))));
  
  this.setSupportedState(goog.ui.Component.State.CHECKED, true);
};
goog.inherits(thin.ui.SplitToggleButton, thin.ui.SplitButton);


/** @inheritDoc */
thin.ui.SplitToggleButton.prototype.enterDocument = function() {
  thin.ui.SplitToggleButton.superClass_.enterDocument.call(this);
  
  var button = this.getButton();
  if (button) {
    this.getHandler().
        listen(button, goog.ui.Component.EventType.ACTION, 
            this.handleToggleAction_, false, this);
  }
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.SplitToggleButton.prototype.handleToggleAction_ = function(e) {
  this.setState(goog.ui.Component.State.CHECKED, e.target.isChecked());
};


/**
 * @param {boolean} check
 */
thin.ui.SplitToggleButton.prototype.setChecked = function(check) {
  thin.ui.SplitToggleButton.superClass_.setChecked.call(this, check);
  this.button_.setChecked(check);
};