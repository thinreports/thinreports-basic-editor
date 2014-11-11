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

goog.provide('thin.editor.TextHelper');

goog.require('thin.editor.TextLineShape');
goog.require('thin.editor.AbstractTextGroup');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.AbstractTextGroup}
 */
thin.editor.TextHelper = function(layout) {
  goog.base(this, this.createElement_(layout), layout);
};
goog.inherits(thin.editor.TextHelper, thin.editor.AbstractTextGroup);


/**
 * @type {thin.editor.TextLineShape}
 * @private
 */
thin.editor.TextHelper.prototype.firstLine_ = null;

/**
 * @param {thin.editor.Layout} layout
 * @private
 */
thin.editor.TextHelper.prototype.createElement_ = function(layout) {
  return layout.createSvgElement('g', {
    'stroke-width': 0
  });
};


/**
 * @param {string} content
 */
thin.editor.TextHelper.prototype.setFirstLine = function(content) {
  goog.array.forEachRight(this.getElement().childNodes, function(element) {
    if (element.tagName == 'text') {
      goog.dom.removeNode(element);
    }
  });

  var layout = this.getLayout();
  var firstLine = new thin.editor.TextLineShape(
    layout.createSvgElement('text'), layout, 0);
  firstLine.setText(content);
  layout.appendChild(firstLine, this);

  if (this.firstLine_) {
    this.firstLine_.dispose();
    delete this.firstLine_;
  }

  this.firstLine_ = firstLine;
};


/**
 * @return {thin.editor.TextLineShape}
 */
thin.editor.TextHelper.prototype.getFirstLine = function() {
  return this.firstLine_;
};


/** @inheritDoc */
thin.editor.TextHelper.prototype.disposeInternal = function() {
  this.firstLine_.dispose();
  delete this.firstLine_;

  goog.base(this, 'disposeInternal');
};
