//  Copyright (C) 2015 Matsukei Co.,Ltd.
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

goog.provide('thin.platform.Window');

goog.require('thin.platform');


thin.platform.Window.close = function() {
  thin.platform.Window.getCurrent().close();
};

/**
 * @return {Object}
 */
thin.platform.Window.getCurrent = function() {
  return thin.platform.callNativeFunction('chrome.app.window.current');
};
