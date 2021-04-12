'use strict';


function createCoordinates(x, y) {
  return {
          x: x,
          y: y
        };
}

function equals(coordinates1, coordinates2) {
  if (coordinates1.x === coordinates2.x) {
    return coordinates1.y === coordinates2.y;
  } else {
    return false;
  }
}

function sum(coordinates1, coordinates2) {
  return {
          x: coordinates1.x + coordinates2.x | 0,
          y: coordinates1.y + coordinates2.y | 0
        };
}

function distance(coordinates1, coordinates2) {
  return Math.abs(coordinates1.x - coordinates2.x | 0) + Math.abs(coordinates1.y - coordinates2.y | 0) | 0;
}

function distance2(param, param$1) {
  return Math.abs(param.x - param$1.x | 0) + Math.abs(param.y - param$1.y | 0) | 0;
}

exports.createCoordinates = createCoordinates;
exports.equals = equals;
exports.sum = sum;
exports.distance = distance;
exports.distance2 = distance2;
/* No side effect */
