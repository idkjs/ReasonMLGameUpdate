'use strict';

var List = require("bs-platform/lib/js/list.js");
var Utils = require("./Utils.bs.js");
var Square = require("./Square.bs.js");
var Coordinates = require("./Coordinates.bs.js");

function getSquaresInAreaOfEffect(areaOfEffect) {
  if (typeof areaOfEffect === "number") {
    if (areaOfEffect !== 0) {
      return function (param, param$1) {
        return /* [] */0;
      };
    }
    var partial_arg = {
      hd: {
        x: 0,
        y: 0
      },
      tl: /* [] */0
    };
    return function (param, param$1) {
      return Square.getSquares(partial_arg, param, param$1);
    };
  }
  var partial_arg$1 = areaOfEffect._0;
  return function (param, param$1) {
    return Square.getSquares(partial_arg$1, param, param$1);
  };
}

function getSkillEffect(skill) {
  return function (gamestate, clickedSquare) {
    var unitInRange = function (unit) {
      return List.exists((function (square) {
                    return Coordinates.equals(square.coordinates, unit.coordinates);
                  }), getSquaresInAreaOfEffect(skill.targetingReticule)(gamestate.grid.squares, clickedSquare.coordinates));
    };
    var fireballEffect = function (unit) {
      return {
              x: unit.x,
              y: unit.y,
              imagePath: unit.imagePath,
              id: unit.id,
              subtype: unit.subtype,
              coordinates: unit.coordinates,
              equipment: unit.equipment,
              hp: unit.hp - 3 | 0,
              baseAttack: unit.baseAttack,
              baseSpeed: unit.baseSpeed,
              skills: unit.skills,
              movementrange: unit.movementrange
            };
    };
    return {
            grid: {
              squares: List.map((function (square) {
                      return {
                              x: square.x,
                              y: square.y,
                              imagePath: square.imagePath,
                              isSelected: square.isSelected,
                              isTargeted: false,
                              isHovered: square.isHovered,
                              inMovementRange: square.inMovementRange,
                              coordinates: square.coordinates
                            };
                    }), gamestate.grid.squares)
            },
            units: Utils.updateList(unitInRange, fireballEffect)(gamestate.units),
            selectedUnitId: gamestate.selectedUnitId,
            interactionMode: gamestate.interactionMode,
            player: gamestate.player
          };
  };
}

exports.getSquaresInAreaOfEffect = getSquaresInAreaOfEffect;
exports.getSkillEffect = getSkillEffect;
/* Utils Not a pure module */
