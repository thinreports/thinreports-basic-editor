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

goog.provide('thin.layout.document.HTML');

goog.require('thin.layout.document.HTMLRenderer');
goog.require('thin.layout.document.Base');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.layout.document.Base}
 */
thin.layout.document.HTML = function(layout) {
  goog.base(this, layout);
};
goog.inherits(thin.layout.document.HTML, thin.layout.document.Base);


/** @inheritDoc */
thin.layout.document.HTML.prototype.generate = function() {
  return thin.layout.document.HTMLRenderer.render({
    meta: this.getMetaInfo_(),
    paper: this.getPaperInfo_(),
    shapeGroups: this.data_
  });
};
