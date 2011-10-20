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

goog.provide('thin.ui');

goog.require('goog.object');
goog.require('goog.ui.Dialog');
goog.require('goog.ui.Dialog.EventType');

goog.require('thin.editor.TextStyle');
goog.require('thin.editor.TextStyle.HorizonAlignType');
goog.require('thin.editor.TextStyle.VerticalAlignType');


/**
 * @type {Object.<goog.ui.Component>}
 */
thin.ui.components = {};


/**
 * @param {string} compId
 * @param {goog.ui.Component} comp
 */
thin.ui.registerComponent = function(compId, comp) {
  thin.ui.components[compId] = comp;
};


/**
 * @param {string} compId
 * @return {goog.ui.Component}
 */
thin.ui.getComponent = function(compId) {
  return thin.ui.components[compId];
};


/**
 * @param {number} zoomRate
 */
thin.ui.setInputValueForZoomRate = function(zoomRate) {
  var toolZoomRate = thin.ui.getComponent('toolbar').getChild('zoom-rate');
  toolZoomRate.setInternalValue(zoomRate);
};


/**
 * @param {boolean} status
 */
thin.ui.adjustUiStatusToRedo = function(status) {
  thin.ui.getComponent('toolbar').getChild('redo').setEnabled(!status);
};


/**
 * @param {thin.editor.Workspace} workspace
 * @param {goog.ui.Component=} opt_toolBar
 */
thin.ui.adjustUiStatusToBold = function(workspace, opt_toolBar) {
  var toolbar = opt_toolBar || thin.ui.getComponent('toolbar');
  toolbar.getChild('font-bold').setChecked(workspace.getUiStatusForBold());
};


/**
 * @param {thin.editor.Workspace} workspace
 * @param {goog.ui.Component=} opt_toolBar
 */
thin.ui.adjustUiStatusToItalic = function(workspace, opt_toolBar) {
  var toolbar = opt_toolBar || thin.ui.getComponent('toolbar');
  toolbar.getChild('font-italic').setChecked(workspace.getUiStatusForItalic());
};


/**
 * @param {thin.editor.Workspace} workspace
 * @param {goog.ui.Component=} opt_toolBar
 */
thin.ui.adjustUiStatusToUnderline = function(workspace, opt_toolBar) {
  var toolbar = opt_toolBar || thin.ui.getComponent('toolbar');
  toolbar.getChild('font-underline').setChecked(workspace.getUiStatusForUnderlIne());
};


/**
 * @param {thin.editor.Workspace} workspace
 * @param {goog.ui.Component=} opt_toolBar
 */
thin.ui.adjustUiStatusToLineThrough = function(workspace, opt_toolBar) {
  var toolbar = opt_toolBar || thin.ui.getComponent('toolbar');
  toolbar.getChild('font-strike').setChecked(workspace.getUiStatusForLineThrough()); 
};


/**
 * @param {thin.editor.Workspace} workspace
 * @param {goog.ui.Component=} opt_toolBar
 */
thin.ui.adjustUiStatusToFontSize = function(workspace, opt_toolBar) {
  var toolbar = opt_toolBar || thin.ui.getComponent('toolbar');
  var toolFontSize = toolbar.getChild('font-size');
  toolFontSize.setInternalValue(workspace.getUiStatusForFontSize());
};


/**
 * @param {thin.editor.Workspace} workspace
 * @param {goog.ui.Component=} opt_toolBar
 */
thin.ui.adjustUiStatusToFontFamily = function(workspace, opt_toolBar) {
  var toolbar = opt_toolBar || thin.ui.getComponent('toolbar');
  var toolFontFamily = toolbar.getChild('font-family');
  toolFontFamily.setValue(workspace.getUiStatusForFontFamily());
};


/**
 * @param {thin.editor.Workspace} workspace
 * @param {goog.ui.Component=} opt_toolBar
 */
thin.ui.adjustUiStatusToTextAnchor = function(workspace, opt_toolBar) {
  var toolbar = opt_toolBar || thin.ui.getComponent('toolbar');
  
  var anchorType = thin.editor.TextStyle.HorizonAlignType;
  var isLeft = false;
  var isCenter = false;
  var isRight = false;
  
  switch (workspace.getUiStatusForHorizonAlignType()) {
    case anchorType.START:
      isLeft = true;
      break;
    case anchorType.MIDDLE:
      isCenter = true;
      break;
    case anchorType.END:
      isRight = true;
      break;
  }
  toolbar.getChild('text-align-left').setChecked(isLeft);
  toolbar.getChild('text-align-center').setChecked(isCenter);
  toolbar.getChild('text-align-right').setChecked(isRight);
};


/**
 * @param {thin.editor.Workspace} workspace
 * @param {goog.ui.Component=} opt_toolBar
 */
thin.ui.adjustUiStatusToVerticalAlign = function(workspace, opt_toolBar) {
  var toolbar = opt_toolBar || thin.ui.getComponent('toolbar');
  
  var verticalType = thin.editor.TextStyle.VerticalAlignType;
  var isTop = false;
  var isCenter = false;
  var isBottom = false;
  
  switch (workspace.getUiStatusForVerticalAlignType()) {
    case verticalType.TOP:
      isTop = true;
      break;
    case verticalType.CENTER:
      isCenter = true;
      break;
    case verticalType.BOTTOM:
      isBottom = true;
      break;
  }

  toolbar.getChild('text-valign-top').setChecked(isTop);
  toolbar.getChild('text-valign-center').setChecked(isCenter);
  toolbar.getChild('text-valign-bottom').setChecked(isBottom);
};


thin.ui.adjustToUiStatusForWorkspace = function() {
  var workspace = thin.editor.getActiveWorkspace();
  var toolbar = thin.ui.getComponent('toolbar');
  thin.ui.adjustUiStatusToBold(workspace, toolbar);
  thin.ui.adjustUiStatusToItalic(workspace, toolbar);
  thin.ui.adjustUiStatusToUnderline(workspace, toolbar);
  thin.ui.adjustUiStatusToLineThrough(workspace, toolbar);
  thin.ui.adjustUiStatusToFontSize(workspace, toolbar);
  thin.ui.adjustUiStatusToFontFamily(workspace, toolbar);
  thin.ui.adjustUiStatusToTextAnchor(workspace, toolbar);
  thin.ui.adjustUiStatusToVerticalAlign(workspace, toolbar);
};


/**
 * @param {boolean} enabled
 */
thin.ui.setEnabledForFontUi = function(enabled) {
  thin.ui.setEnabledForFontBaseUi(enabled);
  thin.ui.setEnabledForTextStyleUi(enabled);
  thin.ui.setEnabledForHorizontalAlignTypeUi(enabled);
  thin.ui.setEnabledForVerticalAlignTypeUi(enabled);
  thin.ui.setEnabledForTextEdit(enabled);
};


/**
 * @param {boolean} enabled
 */
thin.ui.setEnabledForFontBaseUi = function(enabled) {
  var toolbar = thin.ui.getComponent('toolbar');
  
  toolbar.getChild('font-size').setEnabled(enabled);
  toolbar.getChild('font-family').setEnabled(enabled);
  
  thin.editor.getActiveWorkspace().setUiStatusForFontBaseUi(enabled);
};


/**
 * @param {boolean} enabled
 */
thin.ui.setEnabledForTextStyleUi = function(enabled) {
  var toolbar = thin.ui.getComponent('toolbar');
  
  toolbar.getChild('font-bold').setEnabled(enabled);
  toolbar.getChild('font-italic').setEnabled(enabled);
  toolbar.getChild('font-underline').setEnabled(enabled);
  toolbar.getChild('font-strike').setEnabled(enabled);
  
  thin.editor.getActiveWorkspace().setUiStatusForTextStyleUi(enabled);
};


/**
 * @param {boolean} enabled
 */
thin.ui.setEnabledForHorizontalAlignTypeUi = function(enabled) {
  var toolbar = thin.ui.getComponent('toolbar');
  
  toolbar.getChild('text-align-left').setEnabled(enabled);
  toolbar.getChild('text-align-center').setEnabled(enabled);
  toolbar.getChild('text-align-right').setEnabled(enabled);
  
  thin.editor.getActiveWorkspace().setUiStatusForHorizontalAlignTypeUi(enabled);
};


/**
 * @param {boolean} enabled
 */
thin.ui.setEnabledForVerticalAlignTypeUi = function(enabled) {
  var toolbar = thin.ui.getComponent('toolbar');

  toolbar.getChild('text-valign-top').setEnabled(enabled);
  toolbar.getChild('text-valign-center').setEnabled(enabled);
  toolbar.getChild('text-valign-bottom').setEnabled(enabled);

  thin.editor.getActiveWorkspace().setUiStatusForVerticalAlignTypeUi(enabled);
};


/**
 * @param {boolean} enabled
 */
thin.ui.setEnabledForTextEdit = function(enabled) {
  thin.ui.getComponent('toolbar').getChild('text-edit').setEnabled(enabled);
  
  thin.editor.getActiveWorkspace().setUiStatusForTextEditUi(enabled);
};


/**
 * @param {string} className
 * @param {string=} opt_modifier
 * @return {string}
 */
thin.ui.getCssName = function(className, opt_modifier) {
  return className + (opt_modifier ? '-' + opt_modifier : '');
};