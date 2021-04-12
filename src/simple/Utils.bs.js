'use strict';

var List = require("bs-platform/lib/js/list.js");
var $$Array = require("bs-platform/lib/js/array.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var SquareComponent = require("./SquareComponent.bs.js");

function createSquare(handleClick, gamestate, square) {
  return React.createElement(SquareComponent.make, {
              square: square,
              handleClick: handleClick,
              gamestate: gamestate
            });
}

function range(n) {
  if (n === 0) {
    return /* [] */0;
  } else {
    return {
            hd: n - 1 | 0,
            tl: range(n - 1 | 0)
          };
  }
}

function createList(y, create) {
  return List.map(create, range(y));
}

function updateList(condition, updateItem) {
  return function (param) {
    return List.map((function (item) {
                  if (Curry._1(condition, item)) {
                    return Curry._1(updateItem, item);
                  } else {
                    return item;
                  }
                }), param);
  };
}

function createReasonReactArray(y, create) {
  return $$Array.of_list(List.map(create, range(y)));
}

function createGrid(x, y, create, squares) {
  return createReasonReactArray(x, (function (i) {
                return createReasonReactArray(y, (function (j) {
                              return Curry._1(create, List.find((function (square) {
                                                if (square.x === i) {
                                                  return square.y === j;
                                                } else {
                                                  return false;
                                                }
                                              }), squares));
                            }));
              }));
}

function filledRange(n, create) {
  if (n !== 0) {
    return {
            hd: Curry._1(create, n - 1 | 0),
            tl: filledRange(n - 1 | 0, create)
          };
  } else {
    return /* [] */0;
  }
}

exports.createSquare = createSquare;
exports.range = range;
exports.createList = createList;
exports.updateList = updateList;
exports.createReasonReactArray = createReasonReactArray;
exports.createGrid = createGrid;
exports.filledRange = filledRange;
/* react Not a pure module */
