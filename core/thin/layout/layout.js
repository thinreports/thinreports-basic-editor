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

goog.provide('thin.layout');

goog.require('goog.array');
goog.require('goog.string');
goog.require('thin.Version');
goog.require('thin.Compatibility');


/**
 * @type {Array.<Array>}
 */
thin.layout.REQUIRED_RULES = [
  ['>=', '0.6.0.pre3'],
  ['<',  thin.getNextMajorVersion()]
];


/**
 * @return {string}
 */
thin.layout.inspectRequiredRules = function() {
  var desc = [];
  goog.array.forEach(thin.layout.REQUIRED_RULES, function(rule) {
    desc[desc.length] = goog.string.buildString(
        ' ', rule[1], ' ', thin.Version.humanizeOperator(rule[0]));
  });
  return desc.join(thin.t('label_condition_and'));
};


/**
 * @param {string} version
 * @return {boolean}
 */
thin.layout.canOpen = function(version) {
  return goog.array.every(thin.layout.REQUIRED_RULES, function(rule) {
    return thin.Compatibility.check(version, rule[0], rule[1]);
  });
};
