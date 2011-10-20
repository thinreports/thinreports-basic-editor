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

goog.provide('thin.ui.Checkbox');

goog.require('goog.ui.Checkbox');
goog.require('goog.ui.Checkbox.State');
goog.require('thin.ui.CheckboxRenderer');
goog.require('goog.ui.Control');


/**
 * @param {string} label
 * @param {goog.ui.Checkbox.State=} opt_checked
 * @param {thin.ui.CheckboxRenderer=} opt_renderer
 * @constructor
 * @extends {goog.ui.Checkbox}
 * @see {thin.ui} Map 'goog-checkbox-*' to 'thin-checkbox-*'.
 */
thin.ui.Checkbox = function(label, opt_checked, opt_renderer) {
  goog.ui.Checkbox.call(this, opt_checked);
  this.setRenderer(opt_renderer || thin.ui.CheckboxRenderer.getInstance());
  
  /**
   * @type {string}
   * @private
   */
  this.labelContent_ = label;
};
goog.inherits(thin.ui.Checkbox, goog.ui.Checkbox);


/**
 * @enum {string}
 */
thin.ui.Checkbox.Css = {
  CHECKED: thin.ui.getCssName(thin.ui.CheckboxRenderer.CSS_CLASS, 'checked'), 
  UNCHECKED: thin.ui.getCssName(thin.ui.CheckboxRenderer.CSS_CLASS, 'unchecked'), 
  UNDETERMINED: thin.ui.getCssName(thin.ui.CheckboxRenderer.CSS_CLASS, 'undetermined')
};


/**
 * @type {Object}
 * @private
 */
thin.ui.Checkbox.classByState_ = goog.object.create(
    goog.ui.Checkbox.State.CHECKED, thin.ui.Checkbox.Css.CHECKED,
    goog.ui.Checkbox.State.UNCHECKED, thin.ui.Checkbox.Css.UNCHECKED,
    goog.ui.Checkbox.State.UNDETERMINED, thin.ui.Checkbox.Css.UNDETERMINED);


/** @inheritDoc */
thin.ui.Checkbox.prototype.createDom = function() {
  goog.ui.Control.prototype.createDom.call(this);
  thin.ui.Checkbox.superClass_.setLabel.call(this, this.getElement());
};


/**
 * @param {string} label
 */
thin.ui.Checkbox.prototype.setLabel = function(label) {
  this.getRenderer().setLabel(this.getElement(), label);
  this.labelContent_ = label;
};


/**
 * @return {string}
 */
thin.ui.Checkbox.prototype.getLabel = function() {
  return this.labelContent_;
};


/**
 * @return {boolean}
 */
thin.ui.Checkbox.prototype.canDecorate = function() {
  return false;
};


thin.ui.Checkbox.prototype.updateView = function() {
  var el = this.getElement();
  if (el) {
    var classToAdd = thin.ui.Checkbox.classByState_[this.checked_];
    var elementClassNames = goog.dom.classes.get(el);
    if (goog.array.contains(elementClassNames, classToAdd)) {
      return;
    }
    var classesToAssign = [classToAdd];
    var checkStateClasses = goog.object.getValues(thin.ui.Checkbox.Css);
    goog.array.forEach(elementClassNames, function(name) {
      if (!goog.array.contains(checkStateClasses, name)) {
        classesToAssign.push(name);
      }
    });
    goog.dom.classes.set(el, classesToAssign.join(' '));
  }
};


/** @inheritDoc */
thin.ui.Checkbox.prototype.enterDocument = function() {
  thin.ui.Checkbox.superClass_.enterDocument.call(this);
  
  this.updateView();
};


/** @inheritDoc */
thin.ui.Checkbox.prototype.disposeInternal = function() {
  thin.ui.Checkbox.superClass_.disposeInternal.call(this);
  delete this.labelContent_;
};