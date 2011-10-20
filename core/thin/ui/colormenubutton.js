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

goog.provide('thin.ui.ColorMenuButton');

goog.require('goog.array');
goog.require('goog.ui.ControlRenderer');
goog.require('goog.ui.ColorMenuButton');
goog.require('goog.ui.ColorPalette');
goog.require('goog.ui.PaletteRenderer');
goog.require('thin.ui.StylableControl');
goog.require('thin.ui.MenuButton');
goog.require('thin.ui.MenuButton.ArrowPosition');
goog.require('thin.ui.ColorMenuButtonRenderer');


/**
 * @param {goog.ui.ControlContent} content
 * @param {thin.ui.Icon=} opt_icon
 * @param {thin.ui.Menu=} opt_menu
 * @param {thin.ui.MenuButtonRenderer=} opt_renderer
 * @constructor
 * @extends {thin.ui.MenuButton}
 */
thin.ui.ColorMenuButton = function(content, opt_icon, opt_menu, opt_renderer) {
  var scope = this;
  goog.ui.ColorMenuButton.call(/** @type {goog.ui.ColorMenuButton} */ (scope), content);
  thin.ui.MenuButton.call(this, content, opt_icon, 
      thin.ui.ColorMenuButton.newColorMenu(), /** @type {thin.ui.MenuButtonRenderer} */ (
      opt_renderer || thin.ui.ColorMenuButtonRenderer.getInstance()));
  
  this.setArrowPosition(thin.ui.MenuButton.ArrowPosition.RIGHT);
};
goog.inherits(thin.ui.ColorMenuButton, thin.ui.MenuButton);
goog.mixin(thin.ui.ColorMenuButton.prototype, goog.ui.ColorMenuButton.prototype);


/**
 * @enum {Array.<string>}
 */
thin.ui.ColorMenuButton.PALETTES = {
  BASE: [
    '#000', '#fff', '#1f497d', '#eeece1', '#4f81bd', '#c0504d', '#9bbb59', 
      '#8064a2', '#4bacc6', '#f79646'
  ], 
  BASESCALES: [
    '#7f7f7f', '#f2f2f2', '#c6d9f0', '#ddd9c3', '#dbe5f1', '#f2dcdb', '#ebf1dd', 
      '#e5e0ec', '#dbeef3', '#fdeada', 
    '#595959', '#d8d8d8', '#8db3e2', '#c4bd97', '#b8cce4', '#e5b9b7', '#d7e3bc', 
      '#ccc1d9', '#b7dde8', '#fbd5b5', 
    '#3f3f3f', '#bfbfbf', '#548dd4', '#938953', '#95b3d7', '#d99694', '#c3d69b', 
      '#b2a2c7', '#92cddc', '#fac08f', 
    '#262626', '#a5a5a5', '#17365d', '#494429', '#366092', '#953734', '#76923c', 
      '#5f497a', '#31859b', '#e36c09', 
    '#0c0c0c', '#7f7f7f', '#0f243e', '#1d1b10', '#244061', '#632423', '#4f6128', 
      '#3f3151', '#205867', '#974806'
  ], 
  SOLID: [
    '#c00000', '#ff0000', '#ffc000', '#ffff00', '#92d050', '#00b050', '#00b0f0', 
      '#0070c0', '#002060', '#6d2f9c'
  ]
};


/**
 * @param {boolean=} opt_isAllowNone
 * @return {thin.ui.Menu}
 */
thin.ui.ColorMenuButton.newColorMenu = function(opt_isAllowNone) {
  opt_isAllowNone = opt_isAllowNone || true;

  var menu = new thin.ui.Menu();

  if (opt_isAllowNone) {
    var noneButton;
    (function(){
      var cssClass = thin.ui.getCssName('thin-color-palette-none'); 
      var elements = [goog.dom.createDom('div', thin.ui.getCssName(cssClass, 'icon')), 
                      goog.dom.createDom('span', null, 'なし')];
      var renderer = goog.ui.ControlRenderer.getCustomRenderer(
            goog.ui.ButtonRenderer, cssClass);
      noneButton = new goog.ui.Button(elements, 
                          /** @type {goog.ui.ButtonRenderer} */ (renderer));
      noneButton.setTooltip('none');
      noneButton.setValue('none');
    })();
    menu.addChild(noneButton, true);
  }

  var paletteRenderer = goog.ui.ControlRenderer.getCustomRenderer(
      goog.ui.PaletteRenderer, thin.ui.getCssName('thin-color-palette'));
  
  goog.object.forEach(thin.ui.ColorMenuButton.PALETTES, function(colors) {
    var palette = new goog.ui.ColorPalette(colors, 
                        /** @type {goog.ui.PaletteRenderer} */ (paletteRenderer));
    palette.setSize(10);
    menu.addChild(palette, true);
  });

  return menu;
};