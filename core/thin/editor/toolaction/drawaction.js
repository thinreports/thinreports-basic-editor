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

goog.provide('thin.editor.toolaction.DrawAction');

goog.require('goog.events');
goog.require('goog.math.Rect');
goog.require('goog.math.Size');
goog.require('goog.math.Coordinate');
goog.require('goog.ui.Dialog');
goog.require('goog.ui.Dialog.EventType');
goog.require('thin.editor.ListHelper');
goog.require('thin.editor.ListHelper.SectionName');
goog.require('thin.editor.AbstractDragger');
goog.require('thin.editor.AbstractDragger.EventType');
goog.require('thin.editor.HistoryManager');
goog.require('thin.editor.HistoryManager.Mode');
goog.require('thin.editor.toolaction.AbstractAction');


/**
 * @constructor
 * @extends {thin.editor.toolaction.AbstractAction}
 */
thin.editor.toolaction.DrawAction = function() {
  thin.editor.toolaction.AbstractAction.call(this);
};
goog.inherits(thin.editor.toolaction.DrawAction, thin.editor.toolaction.AbstractAction);


/**
 * @param {number} startX
 * @param {number} startY
 * @param {number} clientX
 * @param {number} clientY
 * @return {boolean}
 * @private
 */
thin.editor.toolaction.DrawAction.prototype.compareFn_ = function(startX, startY, clientX, clientY) {
  var diff = goog.math.Coordinate.difference(
               new goog.math.Coordinate(startX, startY),
               new goog.math.Coordinate(clientX, clientY));
  
  return diff.x == 0 || diff.y == 0;
};


/**
 * @param {goog.events.BrowserEvent} e
 * @param {goog.graphics.Element} outline
 * @protected
 */
thin.editor.toolaction.DrawAction.prototype.handleStartAction = function(e, outline) {
  this.commonStartAction(e, outline);
};


/**
 * @param {goog.events.BrowserEvent} e
 * @param {goog.graphics.Element} outline
 * @param {thin.editor.Layer} handler
 * @param {boolean} captureActiveForStart
 * @param {boolean=} opt_isCancelDraw
 * @protected
 */
thin.editor.toolaction.DrawAction.prototype.handleEndAction = function(
    e, outline, handler, captureActiveForStart, opt_isCancelDraw) {

  this.commonEndAction(e, outline, handler, captureActiveForStart, opt_isCancelDraw);
};


/**
 * @param {thin.editor.Layer} handler
 * @param {goog.graphics.Element} outline
 * @param {boolean} isAspect
 * @param {Function=} opt_shiftFn
 * @protected
 */
thin.editor.toolaction.DrawAction.prototype.drawLayerSetup = function(
      handler, outline, isAspect, opt_shiftFn) {
  
  var layout = this.layout;
  var helpers = layout.getHelpers();
  var listHelper = helpers.getListHelper();
  var eventType = goog.fx.Dragger.EventType;
  
  var drawer = new thin.editor.SvgDrawer(outline, handler);
  drawer.setAspectObserve(isAspect);

  handler.setDrawer(drawer);
  handler.setDisposed(false);
  
  var isGlobalDrawLayer = handler == helpers.getDrawLayer();
  var captureActiveForStart = true;
  
  if (goog.isFunction(opt_shiftFn)) {
    drawer.addEventListener(thin.editor.AbstractDragger.EventType.SHIFTKEYPRESS, opt_shiftFn, false, drawer);
  }
  
  drawer.addEventListener(thin.editor.AbstractDragger.EventType.BEFORESTART, function(e) {
    this.setAdsorptionX(helpers.getAdsorptionX());
    this.setAdsorptionY(helpers.getAdsorptionY());
    
    if (!isGlobalDrawLayer && 'list' == layout.getWorkspace().getUiStatusForAction()) {
      return false;
    }
    
    captureActiveForStart = listHelper.isActive();
    if (isGlobalDrawLayer && captureActiveForStart) {
      helpers.disableAll();
      listHelper.inactive();
    }
    return true;
  }, false, drawer);
  
  drawer.addEventListener(eventType.START, function(e) {
    this.handleStartAction(e, outline);
  }, false, this);
  drawer.addEventListener(eventType.END, function(e) {
    var isCancelDraw = this.compareFn_(e.startX, e.startY, e.endX, e.endY);
    this.handleEndAction(e, outline, handler, captureActiveForStart, isCancelDraw);
  }, false, this);
};