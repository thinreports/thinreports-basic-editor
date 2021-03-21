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

goog.provide('thin.core.toolaction.TextAction');

goog.require('thin.core.toolaction.DrawAction');


/**
 * @constructor
 * @extends {thin.core.toolaction.DrawAction}
 */
thin.core.toolaction.TextAction = function() {
  thin.core.toolaction.DrawAction.call(this);
};
goog.inherits(thin.core.toolaction.TextAction, thin.core.toolaction.DrawAction);


/**
 * @param {goog.events.BrowserEvent} e
 * @param {thin.core.Workspace} workspace
 * @protected
 */
thin.core.toolaction.TextAction.prototype.handleActionInternal = function(e, workspace) {

  var helpers = this.layout.getHelpers();
  var listHelper = helpers.getListHelper();
  var outline = helpers.getTextOutline();

  var drawLayer = helpers.getDrawLayer();
  this.drawLayerSetup(drawLayer, outline, true);
  drawLayer.setVisibled(true);

  if (listHelper.isActive()) {
    var listDrawLayer;
    listHelper.forEachSectionHelper(function(sectionHelper, sectionName) {
      listDrawLayer = sectionHelper.getDrawLayer();
      this.drawLayerSetup(listDrawLayer, outline, true);
      listDrawLayer.setVisibled(true);
    }, this);
    listHelper.getBlankRangeDrawLayer().setVisibled(true);
  }
};


/**
 * @param {goog.events.BrowserEvent} e
 * @param {goog.graphics.Element} outline
 * @param {thin.core.Layer} handler
 * @param {boolean} captureActiveForStart
 * @param {boolean=} opt_isCancelDraw
 * @protected
 */
thin.core.toolaction.TextAction.prototype.handleEndAction = function(
    e, outline, handler, captureActiveForStart, opt_isCancelDraw) {

  var layout = this.layout;
  var helpers = layout.getHelpers();
  var listHelper = helpers.getListHelper();
  var guide = helpers.getGuideHelper();

  if (opt_isCancelDraw) {
    var width = 200;
    var height = 100;
    if (!listHelper.isActive()) {
      var boxSize = layout.getBounds().toBox();
    } else {
      var boxSize = listHelper.getTarget().getSectionShape(/** @type {string} */ (
                        listHelper.getSectionNameByDrawLayer(handler))).getBounds().toBox();
    }
    
    var allowWidth = thin.numberWithPrecision(boxSize.right - outline.getLeft());
    var allowHeight = thin.numberWithPrecision(boxSize.bottom - outline.getTop());
    outline.setWidth(width > allowWidth ? allowWidth : width);
    outline.setHeight(height > allowHeight ? allowHeight : height);
    guide.adjustToTargetShapeBounds();
  }

  thin.core.toolaction.TextAction.superClass_.handleEndAction.call(this, 
      e, outline, handler, captureActiveForStart);
  
  layout.getWorkspace().getAction().actionTextEdit(true);
};