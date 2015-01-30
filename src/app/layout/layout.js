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
goog.provide('thin.layout.CompatibilityState');

goog.require('goog.array');
goog.require('thin.Version');
goog.require('thin.Compatibility');


/**
 * @enum {Array.<Array>}
 */
thin.layout.CompatibilityRule = {
  ALL:      [['>=', '0.6.0.pre3'], ['<',  thin.getNextMajorVersion()]], 
  COMPLETE: [['>=', '0.6.0.pre3'], ['<=', thin.getVersion()]], 
  WARNING:  [['>', thin.getVersion()], ['<', thin.getNextMajorVersion()]]
};


/**
 * @enum {number}
 */
thin.layout.CompatibilityState = {
  COMPLETE: 0x01, 
  WARNING: 0x02, 
  ERROR: 0x03
};


/**
 * @return {string}
 */
thin.layout.inspectCompatibleRule = function() {
  var desc = goog.array.map(thin.layout.CompatibilityRule.ALL, function(rule) {
    return rule.join(' ');
  });
  return desc.join(' ' + thin.t('label_condition_and') + ' ');
};


/**
 * @param {string} version
 * @return {thin.layout.CompatibilityState}
 */
thin.layout.checkCompatibility = function(version) {
  var rule = thin.layout.CompatibilityRule;
  var state = thin.layout.CompatibilityState;

  switch(true) {
    case thin.layout.isIncludeRule_(version, rule.COMPLETE):
      return state.COMPLETE;
      break;
    case thin.layout.isIncludeRule_(version, rule.WARNING):
      return state.WARNING;
      break;
    default:
      return state.ERROR;
      break;
  }
};


/**
 * @param {string} version
 * @param {Array} rules
 * @return {boolean}
 * @private
 */
thin.layout.isIncludeRule_ = function(version, rules) {
  return goog.array.every(rules, function(rule) {
    return thin.Compatibility.check(version, rule[0], rule[1]);
  });
};
