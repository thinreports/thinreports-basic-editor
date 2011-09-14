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

goog.provide('thin.editor.toolaction.ImageblockAction');

goog.require('thin.editor.toolaction.DrawAction');


/**
 * @constructor
 * @extends {thin.editor.toolaction.DrawAction}
 */
thin.editor.toolaction.ImageblockAction = function() {
  goog.base(this);
};
goog.inherits(thin.editor.toolaction.ImageblockAction, thin.editor.toolaction.DrawAction);


/**
 * @param {goog.events.BrowserEvent} e
 * @param {thin.editor.Workspace} workspace
 * @protected
 */
thin.editor.toolaction.ImageblockAction.prototype.handleActionInternal = function(e, workspace) {

  var helpers = this.layout.getHelpers();
  var listHelper = helpers.getListHelper();
  var outline = helpers.getImageblockOutline();

  var drawLayer = helpers.getDrawLayer();
  this.drawLayerSetup(drawLayer, outline, true);
  drawLayer.setVisibled(true);

  if (!listHelper.isActived()) {
    var listDrawLayer;
    listHelper.forEachColumnBand(function(columnBand, columnName) {
      listDrawLayer = columnBand.getDrawLayer();
      this.drawLayerSetup(listDrawLayer, outline, true);
      listDrawLayer.setVisibled(true);
    }, this);
    listHelper.getBlankRangeDrawLayer().setVisibled(true);
  }
};