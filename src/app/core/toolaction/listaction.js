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

goog.provide('thin.core.toolaction.ListAction');

goog.require('thin.core.toolaction.DrawAction');


/**
 * @constructor
 * @extends {thin.core.toolaction.DrawAction}
 */
thin.core.toolaction.ListAction = function() {
  thin.core.toolaction.DrawAction.call(this);
};
goog.inherits(thin.core.toolaction.ListAction, thin.core.toolaction.DrawAction);


/**
 * @param {goog.events.BrowserEvent} e
 * @param {thin.core.Workspace} workspace
 * @protected
 */
thin.core.toolaction.ListAction.prototype.handleActionInternal = function(e, workspace) {

  var helpers = this.layout.getHelpers();
  var listHelper = helpers.getListHelper();
  var outline = helpers.getListOutline();

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
    listHelper.setDrawable(false);
    listHelper.getBlankRangeDrawLayer().setVisibled(true);
  }
};


/** @override */
thin.core.toolaction.ListAction.prototype.handleEndAction = 
    function(e, outline, handler, captureActiveForStart, opt_isCancelDraw) {
  goog.base(this, 'handleEndAction', e, outline, handler, captureActiveForStart, opt_isCancelDraw);

  if (!opt_isCancelDraw) {
    this.layout.getHelpers().getListHelper().setDrawable(false);
  }
};

