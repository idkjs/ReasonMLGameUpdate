'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");

function map(fn, option) {
  if (option !== undefined) {
    return Caml_option.some(Curry._1(fn, Caml_option.valFromOption(option)));
  }
  
}

function optionStringtoString(option) {
  if (option !== undefined) {
    return option;
  } else {
    return "leeg";
  }
}

function optionIntToString(option) {
  var option$1 = map((function (prim) {
          return String(prim);
        }), option);
  if (option$1 !== undefined) {
    return option$1;
  } else {
    return "leeg";
  }
}

function contains(option, value) {
  if (option !== undefined) {
    return Caml_obj.caml_equal(Caml_option.valFromOption(option), value);
  } else {
    return false;
  }
}

exports.map = map;
exports.optionStringtoString = optionStringtoString;
exports.optionIntToString = optionIntToString;
exports.contains = contains;
/* No side effect */
