'use strict';

var List = require("bs-platform/lib/js/list.js");
var Unit = require("./Unit.bs.js");
var Curry = require("bs-platform/lib/js/curry.js");
var $$Option = require("./Option.bs.js");
var Square = require("./Square.bs.js");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Gamestate = require("./Gamestate.bs.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var Coordinates = require("./Coordinates.bs.js");

function getClickedUnitId(gameState, clickedSquare) {
  return $$Option.map((function (unit) {
                return unit.id;
              }), Gamestate.findUnit(gameState.units, clickedSquare.coordinates));
}

function selectSquare(clickedSquare) {
  return function (param) {
    return List.map((function (square) {
                  return {
                          x: square.x,
                          y: square.y,
                          imagePath: square.imagePath,
                          isSelected: square.x === clickedSquare.x && square.y === clickedSquare.y,
                          isTargeted: square.isTargeted,
                          isHovered: square.isHovered,
                          inMovementRange: square.inMovementRange,
                          coordinates: square.coordinates
                        };
                }), param);
  };
}

function findUnit(id) {
  return function (param) {
    return List.find((function (unit) {
                  return unit.id === id;
                }), param);
  };
}

function findUnitInUnitList(list, id) {
  return List.find((function (unit) {
                return unit.id === id;
              }), list);
}

function selectIntactionModeInClickedSquare(gameState, unitId) {
  if (unitId === undefined) {
    return /* SelectingAction */0;
  }
  var match = findUnit(unitId)(gameState.units).subtype;
  return match + 1 | 0;
}

function selectActionClickedSquareHandler(gameState, clickedSquare) {
  var unitId = getClickedUnitId(gameState, clickedSquare);
  return Gamestate.updateGamestate(selectSquare(clickedSquare)(gameState.grid.squares), selectIntactionModeInClickedSquare(gameState, unitId), Caml_option.some(getClickedUnitId(gameState, clickedSquare)), undefined, gameState);
}

function onlyIfUnitSelected(fn, gameState) {
  var id = gameState.selectedUnitId;
  if (id !== undefined) {
    return Curry._2(fn, findUnit(id)(gameState.units), gameState);
  } else {
    return function (_var) {
      return gameState;
    };
  }
}

function attackIfTargetHandler(param) {
  return onlyIfUnitSelected((function (attackingUnit, gameState, clickedSquare) {
                var targetId = getClickedUnitId(gameState, clickedSquare);
                var units = $$Option.map((function (id) {
                        return List.map((function (unit) {
                                      if (unit.id === id) {
                                        return {
                                                x: unit.x,
                                                y: unit.y,
                                                imagePath: unit.imagePath,
                                                id: unit.id,
                                                subtype: unit.subtype,
                                                coordinates: unit.coordinates,
                                                equipment: unit.equipment,
                                                hp: unit.hp - Unit.getTotalAttack(attackingUnit) | 0,
                                                baseAttack: unit.baseAttack,
                                                baseSpeed: unit.baseSpeed,
                                                skills: unit.skills,
                                                movementrange: unit.movementrange
                                              };
                                      } else {
                                        return unit;
                                      }
                                    }), gameState.units);
                      }), targetId);
                return Gamestate.updateGamestate(undefined, /* HeroSelected */2, undefined, units, gameState);
              }), param);
}

function moveIfValidLocationHandler(param) {
  return onlyIfUnitSelected((function (selectedUnit, gameState, clickedSquare) {
                var resetGrid = {
                  squares: List.map(Square.reset, gameState.grid.squares)
                };
                if (Coordinates.distance2(selectedUnit.coordinates, clickedSquare.coordinates) < selectedUnit.movementrange) {
                  return {
                          grid: resetGrid,
                          units: List.map((function (unit) {
                                  if (Caml_obj.caml_equal(selectedUnit, unit)) {
                                    return {
                                            x: unit.x,
                                            y: unit.y,
                                            imagePath: unit.imagePath,
                                            id: unit.id,
                                            subtype: unit.subtype,
                                            coordinates: {
                                              x: clickedSquare.coordinates.x,
                                              y: clickedSquare.coordinates.y
                                            },
                                            equipment: unit.equipment,
                                            hp: unit.hp,
                                            baseAttack: unit.baseAttack,
                                            baseSpeed: unit.baseSpeed,
                                            skills: unit.skills,
                                            movementrange: unit.movementrange
                                          };
                                  } else {
                                    return unit;
                                  }
                                }), gameState.units),
                          selectedUnitId: gameState.selectedUnitId,
                          interactionMode: /* SelectingAction */0,
                          player: gameState.player
                        };
                } else {
                  return {
                          grid: resetGrid,
                          units: gameState.units,
                          selectedUnitId: gameState.selectedUnitId,
                          interactionMode: /* HeroSelected */2,
                          player: gameState.player
                        };
                }
              }), param);
}

function showMovementRange(param) {
  return onlyIfUnitSelected((function (selectedUnit, gameState, param) {
                return {
                        grid: {
                          squares: List.map((function (square) {
                                  if (Coordinates.distance2(selectedUnit.coordinates, square.coordinates) < selectedUnit.movementrange) {
                                    return {
                                            x: square.x,
                                            y: square.y,
                                            imagePath: square.imagePath,
                                            isSelected: square.isSelected,
                                            isTargeted: square.isTargeted,
                                            isHovered: square.isHovered,
                                            inMovementRange: true,
                                            coordinates: square.coordinates
                                          };
                                  } else {
                                    return square;
                                  }
                                }), gameState.grid.squares)
                        },
                        units: gameState.units,
                        selectedUnitId: gameState.selectedUnitId,
                        interactionMode: /* MovingUnit */4,
                        player: gameState.player
                      };
              }), param);
}

exports.getClickedUnitId = getClickedUnitId;
exports.selectSquare = selectSquare;
exports.findUnit = findUnit;
exports.findUnitInUnitList = findUnitInUnitList;
exports.selectIntactionModeInClickedSquare = selectIntactionModeInClickedSquare;
exports.selectActionClickedSquareHandler = selectActionClickedSquareHandler;
exports.onlyIfUnitSelected = onlyIfUnitSelected;
exports.attackIfTargetHandler = attackIfTargetHandler;
exports.moveIfValidLocationHandler = moveIfValidLocationHandler;
exports.showMovementRange = showMovementRange;
/* Unit Not a pure module */
