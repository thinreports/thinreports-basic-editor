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

goog.provide('thin.editor.toolaction.ImageAction');

goog.require('goog.Delay');
goog.require('thin.editor.toolaction.AbstractAction');
goog.require('thin.editor.ImageFile');


/**
 * @constructor
 * @extends {thin.editor.toolaction.AbstractAction}
 */
thin.editor.toolaction.ImageAction = function() {
  thin.editor.toolaction.AbstractAction.call(this);
};
goog.inherits(thin.editor.toolaction.ImageAction, thin.editor.toolaction.AbstractAction);


/**
 * @param {goog.events.BrowserEvent} e
 * @param {thin.editor.Layer} handler
 * @param {goog.graphics.Element} outline
 * @param {boolean} captureActivedForStart
 * @private
 */
thin.editor.toolaction.ImageAction.prototype.handleMouseDownAction_ = function(
    e, handler, outline, captureActivedForStart) {
  
  var scope = this;
  var layout = this.layout;
  var workspace = layout.getWorkspace();
  var proppane = thin.ui.getComponent('proppane');
  var guide = layout.getHelpers().getGuideHelper();
  
  outline.setWidth(0);
  outline.setHeight(0);
  this.commonStartAction(e, outline);
  workspace.focusElement(e);

  var pos = this.calculatePosition_(e);
  outline.setLeft(pos.x);
  outline.setTop(pos.y);

  proppane.updateAsync(function() {
    layout.updatePropertiesForEmpty();
  });

  var file = thin.editor.ImageFile.openDialog();
  var isFileExist = !!file;
  var isValid = isFileExist && file.isValid();
  this.commonEndAction(e, outline, handler, captureActivedForStart, !isValid);
  
  if (isValid) {
    var singleShape = layout.getManager().getActiveShapeByIncludeList().getIfSingle();
    singleShape.setFile(file);
    var count = 1;
    var delay = new goog.Delay(function() {
      this.adjustToAllowSize();
      if (!!this.getNaturalWidth() && !!this.getNaturalHeight()) {
        this.updateProperties();
        guide.setEnableAndTargetShape(singleShape);
        delay.dispose();
      } else {
        if (count > 5) {
          workspace.undo();
          scope.commonEndAction(e, outline, handler, captureActivedForStart, true);
          delay.dispose();
          thin.ui.Message.alert('画像ファイルの読み込みに失敗しました。', 'Error', 
              function(e) {
                workspace.focusElement(e);
              });
        } else {
          count += 1;
          delay.start();
        }
      }
    }, 10, singleShape);
    delay.start();
  } else {
    if (isFileExist && !isValid) {
      thin.ui.Message.alert('画像ファイルの読み込みに失敗しました。', 'Error', 
          function(e) {
            workspace.focusElement(e);
          });
      
    }
  }
  e.preventDefault();
};


/**
 * @param {goog.events.BrowserEvent} e
 * @return {goog.math.Coordinate}
 * @private
 */
thin.editor.toolaction.ImageAction.prototype.calculatePosition_ = function(e) {
  var layout = this.layout;
  var bounds = layout.getOffsetTarget().getBoundingClientRect();
  var rate = layout.getPixelScale();

  return new goog.math.Coordinate(
           thin.editor.numberWithPrecision((e.clientX - bounds.left) / rate),
           thin.editor.numberWithPrecision((e.clientY - bounds.top) / rate));
};


/**
 * @param {goog.events.BrowserEvent} e
 * @param {thin.editor.Workspace} workspace
 * @protected
 */
thin.editor.toolaction.ImageAction.prototype.handleActionInternal = function(e, workspace) {

  var helpers = this.layout.getHelpers();
  var outline = helpers.getImageOutline();
  var listHelper = helpers.getListHelper();
  var eventType = goog.events.EventType;

  var drawLayer = helpers.getDrawLayer();
  drawLayer.setDisposed(false);
  drawLayer.setVisibled(true);
  drawLayer.addEventListener(eventType.MOUSEDOWN,
    function(e) {
      if (e.isMouseActionButton()) {
        var captureActivedForStart = listHelper.isActived();
        if (!captureActivedForStart) {
          helpers.disableAll();
          listHelper.inactive();
        }
        this.handleMouseDownAction_(e, drawLayer, outline, captureActivedForStart);
      }
    }, false, this);

  if (!listHelper.isActived()) {
    var listDrawLayer;
    listHelper.forEachColumnBand(function(columnBand, columnName) {
      listDrawLayer = columnBand.getDrawLayer();
      listDrawLayer.setDisposed(false);
      listDrawLayer.setVisibled(true);
      listDrawLayer.addEventListener(eventType.MOUSEDOWN, 
        function(e) {
          if (e.isMouseActionButton()) {
            var layer;
            var element = e.target;
            listHelper.forEachColumnBand(function(columnBand, columnName) {
              if (columnBand.getDrawLayer().getElement() == element) {
                layer = columnBand.getDrawLayer();
              }
            });
            this.handleMouseDownAction_(e, layer, outline, false);
          }
        }, false, this);
    }, this);
    listHelper.getBlankRangeDrawLayer().setVisibled(true);
  }
};