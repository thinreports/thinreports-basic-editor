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

goog.provide('thin.layout.document.CSV');

goog.require('goog.array');
goog.require('goog.string.StringBuffer');
goog.require('thin.layout.document.Base');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.layout.document.Base}
 */
thin.layout.document.CSV = function(layout) {
  goog.base(this, layout);

  /**
   * @type {goog.string.StringBuffer}
   * @private
   */
  this.buffer_ = new goog.string.StringBuffer();
};
goog.inherits(thin.layout.document.CSV, thin.layout.document.Base);


/**
 * @type {number}
 * @private
 */
thin.layout.document.CSV.prototype.indention_ = 0;


/** @inheritDoc */
thin.layout.document.CSV.prototype.generate = function() {
  this.appendMetaInfo_();
  this.appendBlankLine_();
  this.appendPaperInfo_();
  this.appendShapes_();

  return this.buffer_.toString();
};


/**
 * @param {string} data
 * @private
 */
thin.layout.document.Base.prototype.append_ = function(data) {
  this.buffer_.append(data + "\n");
};

/**
 * @private
 */
thin.layout.document.Base.prototype.appendBlankLine_ = function() {
  this.append_('');
};


/**
 * @private
 */
thin.layout.document.CSV.prototype.appendMetaInfo_ = function() {
  var meta = this.getMetaInfo_();
  this.appendLine_(meta.title, meta.fileName);
};


/**
 * @private
 */
thin.layout.document.CSV.prototype.appendPaperInfo_ = function() {
  var paper = this.getPaperInfo_();

  this.appendLine_(
    thin.t('field_paper_type'),
    thin.t('field_paper_width'),
    thin.t('field_paper_height'),
    thin.t('field_paper_direction'),
    thin.t('field_margin_top'),
    thin.t('field_margin_bottom'),
    thin.t('field_margin_left'),
    thin.t('field_margin_right')
  );
  this.appendLine_(
    paper.type,
    paper.width,
    paper.height,
    paper.orientation,
    paper.margin.top,
    paper.margin.bottom,
    paper.margin.left,
    paper.margin.right
  );
};


/**
 * @param {Array=} opt_data
 * @private
 */
thin.layout.document.CSV.prototype.appendShapes_ = function(opt_data) {
  goog.array.forEach(opt_data || this.data_, function(data) {
    switch(data.type) {
      case thin.editor.TblockShape.CLASSID:
        this.appendTblockShape_(data);
        break;
      case thin.editor.ImageblockShape.CLASSID:
        this.appendImageblockShape_(data);
        break;
      case thin.editor.PageNumberShape.CLASSID:
        this.appendPagenumberShape_(data);
        break;
      case thin.editor.ListShape.CLASSID:
        this.appendListShape_(data);
        break;
      default:
        this.appendBasicShape_(data);
        break;
    }
  }, this);
};


/**
 * @param {number} indent
 * @private
 */
thin.layout.document.CSV.prototype.setIndent_ = function(indent) {
  this.indention_ = indent;
};


/**
 * @private
 */
thin.layout.document.CSV.prototype.appendBlankLineIfNotIndented_ = function() {
  if (this.indention_ == 0) {
    this.appendBlankLine_();
  }
};


/**
 * @param {...string|Array.<string>} var_args
 * @private
 */
thin.layout.document.CSV.prototype.appendLine_ = function(var_args) {
  var data;
  if (arguments.length == 1 && goog.isArray(var_args)) {
    data = var_args;
  } else {
    data = goog.array.clone(arguments);
  }
  if (this.indention_ > 0) {
    data = goog.array.concat(goog.array.repeat('', this.indention_), data);
  }
  data = goog.array.map(data, function(d) {
    return '"' + d + '"';
  });
  this.append_(data.join(','));
};


/**
 * @param {Object} data
 * @private
 */
thin.layout.document.CSV.prototype.appendBasicShape_ = function(data) {
  this.appendBlankLineIfNotIndented_();

  this.appendLine_(data.name);
  this.appendLine_(
    'ID',
    thin.t('label_shape_type'),
    thin.t('field_display'),
    thin.t('field_description')
  );
  goog.array.forEach(data.shapes, function(shape) {
    this.appendLine_(
      shape.id,
      shape.typeName,
      shape.display,
      shape.desc
    );
  }, this);
};


/**
 * @param {Object} data
 * @private
 */
thin.layout.document.CSV.prototype.appendPagenumberShape_ = function(data) {
  this.appendBlankLineIfNotIndented_();

  this.appendLine_(data.name);
  this.appendLine_(
    thin.t('field_pageno_format'),
    'ID',
    thin.t('field_display'),
    thin.t('field_counted_page_target'),
    thin.t('field_description')
  );

  goog.array.forEach(data.shapes, function(shape) {
    this.appendLine_(
      shape.format,
      shape.id,
      shape.display,
      shape.target,
      shape.desc
    );
  }, this);
};


/**
 * @param {Object} data
 * @private
 */
thin.layout.document.CSV.prototype.appendTblockShape_ = function(data) {
  this.appendBlankLineIfNotIndented_();

  this.appendLine_(data.name);
  this.appendLine_(
    'ID',
    thin.t('field_reference_id'),
    thin.t('field_display'),
    thin.t('field_multiple_line'),
    thin.t('field_default_value'),
    thin.t('field_basic_format'),
    thin.t('field_format_type'),
    thin.t('label_format'),
    thin.t('field_description')
  );

  goog.array.forEach(data.shapes, function(shape) {
    this.appendLine_(
      shape.id,
      shape.refId,
      shape.display,
      shape.multiple,
      shape.value,
      shape.formatBase,
      shape.formatType,
      shape.formatStyle,
      shape.desc
    );
  }, this);
};


/**
 * @param {Object} data
 * @private
 */
thin.layout.document.CSV.prototype.appendImageblockShape_ = function(data) {
  this.appendBlankLineIfNotIndented_();

  this.appendLine_(data.name);
  this.appendLine_(
    'ID',
    thin.t('field_display'),
    thin.t('field_description')
  );

  goog.array.forEach(data.shapes, function(shape) {
    this.appendLine_(
      shape.id,
      shape.display,
      shape.desc
    );
  }, this);
};


/**
 * @param {Object} data
 * @private
 */
thin.layout.document.CSV.prototype.appendListShape_ = function(data) {
  var listName = data.name;

  goog.array.forEach(data.shapes, function(shape) {
    this.appendBlankLine_();

    this.appendLine_(listName);
    this.appendLine_(
      'ID',
      thin.t('field_display'),
      thin.t('field_auto_page_break'),
      thin.t('field_list_header'),
      thin.t('field_list_page_footer'),
      thin.t('field_list_footer'),
      thin.t('field_description')
    );

    this.appendLine_(
      shape.id,
      shape.display,
      shape.pageBreak,
      shape.header,
      shape.pageFooter,
      shape.footer,
      shape.desc
    );

    goog.array.forEach(shape.sections, function(section) {
      this.appendLine_(section.name);
      this.setIndent_(1);
      this.appendShapes_(section.shapes);
      this.setIndent_(0);
    }, this);
  }, this);
};


/** @inheritDoc */
thin.layout.document.CSV.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  delete this.indention_;
  delete this.buffer_;
};
