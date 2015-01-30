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

goog.provide('thin.core.toolaction.TblockAction');

goog.require('thin.core.toolaction.DrawAction');


/**
 * @constructor
 * @extends {thin.core.toolaction.DrawAction}
 */
thin.core.toolaction.TblockAction = function() {
  thin.core.toolaction.DrawAction.call(this);
};
goog.inherits(thin.core.toolaction.TblockAction, thin.core.toolaction.DrawAction);


/**
 * @param {number} startX
 * @param {number} startY
 * @param {number} clientX
 * @param {number} clientY
 * @return {boolean}
 * @private
 */
thin.core.toolaction.TblockAction.prototype.compareFn_ = function(startX, startY, clientX, clientY) {
  var diff = goog.math.Coordinate.difference(
               new goog.math.Coordinate(startX, startY), 
               new goog.math.Coordinate(clientX, clientY));
  return diff.x == 0;
};


/** @inheritDoc */
thin.core.toolaction.TblockAction.prototype.handleStartAction = function(e, outline) {
  var workspace = this.workspace;
  workspace.setUiStatusForFontSize(18);
  thin.ui.adjustUiStatusToFontSize(workspace);
  thin.core.toolaction.TblockAction.superClass_.handleStartAction.call(this, e, outline);
};


/**
 * @param {goog.events.BrowserEvent} e
 * @param {thin.core.Workspace} workspace
 * @protected
 */
thin.core.toolaction.TblockAction.prototype.handleActionInternal = function(e, workspace) {

  var helpers = this.layout.getHelpers();
  var listHelper = helpers.getListHelper();
  var outline = helpers.getTblockOutline();

  var drawLayer = helpers.getDrawLayer();
  this.drawLayerSetup(drawLayer, outline, false);
  drawLayer.setVisibled(true);

  if (listHelper.isActive()) {
    var listDrawLayer;
    listHelper.forEachSectionHelper(function(sectionHelper, sectionName) {
      listDrawLayer = sectionHelper.getDrawLayer();
      this.drawLayerSetup(listDrawLayer, outline, false);
      listDrawLayer.setVisibled(true);
    }, this);
    listHelper.getBlankRangeDrawLayer().setVisibled(true);
  }
};