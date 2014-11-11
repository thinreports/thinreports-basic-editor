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

goog.provide('thin.core.toolaction.ImageAction');

goog.require('goog.Delay');
goog.require('thin.core.toolaction.AbstractAction');
goog.require('thin.core.ImageFile');


/**
 * @constructor
 * @extends {thin.core.toolaction.AbstractAction}
 */
thin.core.toolaction.ImageAction = function() {
  thin.core.toolaction.AbstractAction.call(this);
};
goog.inherits(thin.core.toolaction.ImageAction, thin.core.toolaction.AbstractAction);


/**
 * @param {goog.events.BrowserEvent} e
 * @param {thin.core.Layer} handler
 * @param {goog.graphics.Element} outline
 * @param {boolean} captureActiveForStart
 * @private
 */
thin.core.toolaction.ImageAction.prototype.handleMouseDownAction_ = function(
    e, handler, outline, captureActiveForStart) {

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

  layout.updatePropertiesForEmpty();

  var handleCancelFileToOpen = function() {
    scope.commonEndAction(e, outline, handler, captureActiveForStart, true);
  };

  var handleErrorFileToOpen = function() {
    handleCancelFileToOpen();
    thin.ui.Message.alert(thin.t('error_failed_to_load_image'), 'Error',
      function(e) {
        workspace.focusElement(e);
      });
  };

  thin.core.ImageFile.openDialog({
    success: function(file) {
      scope.commonEndAction(e, outline, handler, captureActiveForStart, false);
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
            handleErrorFileToOpen();
            delay.dispose();
          } else {
            count += 1;
            delay.start();
          }
        }
      }, 10, singleShape);
      delay.start();
    },
    cancel: handleCancelFileToOpen,
    error: handleErrorFileToOpen
  });

  e.preventDefault();
};


/**
 * @param {goog.events.BrowserEvent} e
 * @return {goog.math.Coordinate}
 * @private
 */
thin.core.toolaction.ImageAction.prototype.calculatePosition_ = function(e) {
  var layout = this.layout;
  var bounds = layout.getOffsetTarget().getBoundingClientRect();
  var rate = layout.getPixelScale();

  return new goog.math.Coordinate(
           thin.numberWithPrecision((e.clientX - bounds.left) / rate),
           thin.numberWithPrecision((e.clientY - bounds.top) / rate));
};


/**
 * @param {goog.events.BrowserEvent} e
 * @param {thin.core.Workspace} workspace
 * @protected
 */
thin.core.toolaction.ImageAction.prototype.handleActionInternal = function(e, workspace) {

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
        var captureActiveForStart = listHelper.isActive();
        if (captureActiveForStart) {
          helpers.disableAll();
          listHelper.inactive();
        }
        this.handleMouseDownAction_(e, drawLayer, outline, captureActiveForStart);
      }
    }, false, this);

  if (listHelper.isActive()) {
    var listDrawLayer;
    listHelper.forEachSectionHelper(function(sectionHelper, sectionName) {
      listDrawLayer = sectionHelper.getDrawLayer();
      listDrawLayer.setDisposed(false);
      listDrawLayer.setVisibled(true);
      listDrawLayer.addEventListener(eventType.MOUSEDOWN,
        function(e) {
          if (e.isMouseActionButton()) {
            var layer;
            var element = e.target;
            listHelper.forEachSectionHelper(function(sectionHelper, sectionName) {
              if (sectionHelper.getDrawLayer().getElement() == element) {
                layer = sectionHelper.getDrawLayer();
              }
            });
            this.handleMouseDownAction_(e, layer, outline, true);
          }
        }, false, this);
    }, this);
    listHelper.getBlankRangeDrawLayer().setVisibled(true);
  }
};
