'use strict';

var List = require("bs-platform/lib/js/list.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var Coordinates = require("./Coordinates.bs.js");

function createGamestate(grid, units, player) {
  return {
          grid: grid,
          units: units,
          selectedUnitId: undefined,
          interactionMode: /* SelectingAction */0,
          player: player
        };
}

function findUnit(units, coordinates) {
  if (List.exists((function (unit) {
            return Coordinates.equals(unit.coordinates, coordinates);
          }), units)) {
    return List.find((function (unit) {
                  return Coordinates.equals(unit.coordinates, coordinates);
                }), units);
  }
  
}

function valueOrDefault(option, $$default) {
  if (option !== undefined) {
    return Caml_option.valFromOption(option);
  } else {
    return $$default;
  }
}

function updateGamestate(squares, interactionMode, selectedUnitId, units, gamestate) {
  return {
          grid: {
            squares: valueOrDefault(squares, gamestate.grid.squares)
          },
          units: valueOrDefault(units, gamestate.units),
          selectedUnitId: valueOrDefault(selectedUnitId, gamestate.selectedUnitId),
          interactionMode: valueOrDefault(interactionMode, gamestate.interactionMode),
          player: gamestate.player
        };
}

exports.createGamestate = createGamestate;
exports.findUnit = findUnit;
exports.valueOrDefault = valueOrDefault;
exports.updateGamestate = updateGamestate;
/* No side effect */
