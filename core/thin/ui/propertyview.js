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

goog.provide('thin.ui.PropertyView');

goog.require('goog.style');
goog.require('thin.ui.PropertyPane');
goog.require('thin.ui.View');


/**
 * @param {string} caption
 * @constructor
 * @extends {thin.ui.View}
 */
thin.ui.PropertyView = function(caption) {
  thin.ui.View.call(this, caption);
  
  /**
   * @type {thin.ui.PropertyPane}
   * @private
   */
  this.setControl(new thin.ui.PropertyPane());
  this.setHandleWindowResizeEvent(true);
};
goog.inherits(thin.ui.PropertyView, thin.ui.View);


/**
 * @param {goog.events.Event} e
 * @private
 */
thin.ui.PropertyView.prototype.handleWindowResize_ = function(e) {
  var parentElement = this.getParent().getContentElement();
  var targetElement = this.getControl().getContentElement();
  var isElementHide = !goog.style.isElementShown(targetElement);
  if(isElementHide) {
    goog.style.showElement(targetElement, true);
  }
  var targetOffsetTop = goog.style.getPageOffsetTop(targetElement);
  var parentOffsetTop = goog.style.getPageOffsetTop(parentElement);
  if(isElementHide) {
    goog.style.showElement(targetElement, false);
  }
  goog.style.setHeight(targetElement, 
      goog.style.getSize(parentElement).height - 
          (targetOffsetTop - parentOffsetTop));
};