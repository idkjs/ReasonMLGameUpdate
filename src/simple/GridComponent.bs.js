'use strict';

var List = require("bs-platform/lib/js/list.js");
var Unit = require("./Unit.bs.js");
var $$Array = require("bs-platform/lib/js/array.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Utils = require("./Utils.bs.js");
var React = require("react");
var $$Option = require("./Option.bs.js");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Equipment = require("./Equipment.bs.js");
var SkillEffectDataService = require("./SkillEffectDataService.bs.js");
var InterActionModeHandlers = require("./InterActionModeHandlers.bs.js");

function moveClicked(gamestate) {
  return {
          gameState: Curry._1(InterActionModeHandlers.showMovementRange(gamestate), 1)
        };
}

function attackClicked(gamestate) {
  return {
          gameState: {
            grid: gamestate.grid,
            units: gamestate.units,
            selectedUnitId: gamestate.selectedUnitId,
            interactionMode: /* AttackingUnit */5,
            player: gamestate.player
          }
        };
}

function shopClicked(gamestate) {
  return {
          gameState: {
            grid: gamestate.grid,
            units: gamestate.units,
            selectedUnitId: gamestate.selectedUnitId,
            interactionMode: /* OpenShop */6,
            player: gamestate.player
          }
        };
}

function closeShop(gamestate) {
  return {
          gameState: {
            grid: gamestate.grid,
            units: gamestate.units,
            selectedUnitId: gamestate.selectedUnitId,
            interactionMode: /* HeroSelected */2,
            player: gamestate.player
          }
        };
}

function equip(gameState, itemTypes) {
  return {
          gameState: {
            grid: gameState.grid,
            units: List.map((function (unit) {
                    if ($$Option.contains(gameState.selectedUnitId, unit.id)) {
                      return {
                              x: unit.x,
                              y: unit.y,
                              imagePath: unit.imagePath,
                              id: unit.id,
                              subtype: unit.subtype,
                              coordinates: unit.coordinates,
                              equipment: Equipment.equip(unit.equipment, Equipment.createItem(itemTypes)),
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
          }
        };
}

function GridComponent(Props) {
  var gamestate = Props.gamestate;
  var match = React.useReducer((function (state, action) {
          if (typeof action === "number") {
            switch (action) {
              case /* MoveClicked */0 :
                  return {
                          gameState: Curry._1(InterActionModeHandlers.showMovementRange(state.gameState), 1)
                        };
              case /* AttackClicked */1 :
                  return attackClicked(state.gameState);
              case /* ShopClicked */2 :
                  return shopClicked(state.gameState);
              case /* Close */3 :
                  var match = state.gameState.interactionMode;
                  if (typeof match === "number" && match >= 6) {
                    return closeShop(state.gameState);
                  } else {
                    return state;
                  }
              
            }
          } else {
            switch (action.TAG | 0) {
              case /* ClickedSquare */0 :
                  var clickedSquare = action._0;
                  var skill = state.gameState.interactionMode;
                  if (typeof skill === "number") {
                    switch (skill) {
                      case /* SelectingAction */0 :
                      case /* NpcSelected */1 :
                      case /* HeroSelected */2 :
                      case /* MonsterSelected */3 :
                          break;
                      case /* MovingUnit */4 :
                          return {
                                  gameState: Curry._1(InterActionModeHandlers.moveIfValidLocationHandler(state.gameState), clickedSquare)
                                };
                      case /* AttackingUnit */5 :
                          return {
                                  gameState: Curry._1(InterActionModeHandlers.attackIfTargetHandler(state.gameState), clickedSquare)
                                };
                      case /* OpenShop */6 :
                          return state;
                      
                    }
                    return {
                            gameState: InterActionModeHandlers.selectActionClickedSquareHandler(state.gameState, clickedSquare)
                          };
                  }
                  var init = SkillEffectDataService.getSkillEffect(skill._0)(state.gameState, clickedSquare);
                  return {
                          gameState: {
                            grid: init.grid,
                            units: init.units,
                            selectedUnitId: init.selectedUnitId,
                            interactionMode: /* SelectingAction */0,
                            player: init.player
                          }
                        };
                  break;
              case /* Equip */1 :
                  return equip(state.gameState, action._0);
              case /* SelectSkill */2 :
                  var skill$1 = action._0;
                  var match$1 = skill$1.targetingReticule;
                  if (typeof match$1 === "number" && match$1 !== 0) {
                    var init$1 = SkillEffectDataService.getSkillEffect(skill$1)(state.gameState, List.hd(state.gameState.grid.squares));
                    return {
                            gameState: {
                              grid: init$1.grid,
                              units: init$1.units,
                              selectedUnitId: init$1.selectedUnitId,
                              interactionMode: /* SelectingAction */0,
                              player: init$1.player
                            }
                          };
                  }
                  var init$2 = state.gameState;
                  return {
                          gameState: {
                            grid: init$2.grid,
                            units: init$2.units,
                            selectedUnitId: init$2.selectedUnitId,
                            interactionMode: /* Targeting */{
                              _0: skill$1
                            },
                            player: init$2.player
                          }
                        };
              case /* HoverSquare */3 :
                  var hoveredSquare = action._0;
                  var skill$2 = state.gameState.interactionMode;
                  if (typeof skill$2 === "number") {
                    var init$3 = state.gameState;
                    return {
                            gameState: {
                              grid: {
                                squares: List.map((function (square) {
                                        if (Caml_obj.caml_equal(square, hoveredSquare)) {
                                          return {
                                                  x: square.x,
                                                  y: square.y,
                                                  imagePath: square.imagePath,
                                                  isSelected: square.isSelected,
                                                  isTargeted: square.isTargeted,
                                                  isHovered: true,
                                                  inMovementRange: square.inMovementRange,
                                                  coordinates: square.coordinates
                                                };
                                        } else {
                                          return {
                                                  x: square.x,
                                                  y: square.y,
                                                  imagePath: square.imagePath,
                                                  isSelected: square.isSelected,
                                                  isTargeted: square.isTargeted,
                                                  isHovered: false,
                                                  inMovementRange: square.inMovementRange,
                                                  coordinates: square.coordinates
                                                };
                                        }
                                      }), state.gameState.grid.squares)
                              },
                              units: init$3.units,
                              selectedUnitId: init$3.selectedUnitId,
                              interactionMode: init$3.interactionMode,
                              player: init$3.player
                            }
                          };
                  }
                  var skill$3 = skill$2._0;
                  var init$4 = state.gameState;
                  return {
                          gameState: {
                            grid: {
                              squares: List.map((function (square) {
                                      if (List.exists((function (areaSquare) {
                                                return Caml_obj.caml_equal(areaSquare, square);
                                              }), SkillEffectDataService.getSquaresInAreaOfEffect(skill$3.targetingReticule)(state.gameState.grid.squares, hoveredSquare.coordinates))) {
                                        return {
                                                x: square.x,
                                                y: square.y,
                                                imagePath: square.imagePath,
                                                isSelected: square.isSelected,
                                                isTargeted: true,
                                                isHovered: square.isHovered,
                                                inMovementRange: square.inMovementRange,
                                                coordinates: square.coordinates
                                              };
                                      } else {
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
                                      }
                                    }), state.gameState.grid.squares)
                            },
                            units: init$4.units,
                            selectedUnitId: init$4.selectedUnitId,
                            interactionMode: init$4.interactionMode,
                            player: init$4.player
                          }
                        };
              
            }
          }
        }), {
        gameState: gamestate
      });
  var dispatch = match[1];
  var state = match[0];
  var partial_arg = state.gameState;
  var partial_arg$1 = state.gameState.units;
  return React.createElement("div", {
              className: "grid"
            }, Utils.createGrid(10, 10, (function (param) {
                    return Utils.createSquare(dispatch, partial_arg, param);
                  }), state.gameState.grid.squares), React.createElement("div", undefined, $$Option.optionIntToString(state.gameState.selectedUnitId)), React.createElement("div", undefined, "Turnorder?"), React.createElement("div", undefined, $$Array.of_list(List.map((function (unit) {
                            return String(unit.id);
                          }), Unit.determineTurnOrder(state.gameState.units)))), React.createElement("div", undefined, $$Option.optionIntToString($$Option.map((function (unit) {
                            return unit.hp;
                          }), $$Option.map((function (param) {
                                return InterActionModeHandlers.findUnitInUnitList(partial_arg$1, param);
                              }), state.gameState.selectedUnitId)))), state.gameState.interactionMode === /* HeroSelected */2 && $$Option.contains(state.gameState.selectedUnitId, List.hd(Unit.determineTurnOrder(state.gameState.units)).id) ? React.createElement("div", undefined, React.createElement("button", {
                        onClick: (function (_event) {
                            return Curry._1(dispatch, /* MoveClicked */0);
                          })
                      }, "Move"), React.createElement("button", {
                        onClick: (function (_event) {
                            return Curry._1(dispatch, /* AttackClicked */1);
                          })
                      }, "Attack"), React.createElement("button", {
                        onClick: (function (_event) {
                            return Curry._1(dispatch, /* ShopClicked */2);
                          })
                      }, "Open shop"), $$Array.of_list(List.map((function (skill) {
                              return React.createElement("button", {
                                          onClick: (function (_event) {
                                              return Curry._1(dispatch, {
                                                          TAG: /* SelectSkill */2,
                                                          _0: skill
                                                        });
                                            })
                                        }, skill.name);
                            }), List.hd(Unit.determineTurnOrder(state.gameState.units)).skills))) : React.createElement("span", undefined), state.gameState.interactionMode === /* OpenShop */6 && $$Option.contains(state.gameState.selectedUnitId, List.hd(Unit.determineTurnOrder(state.gameState.units)).id) ? React.createElement("div", undefined, React.createElement("button", {
                        onClick: (function (_event) {
                            return Curry._1(dispatch, {
                                        TAG: /* Equip */1,
                                        _0: /* Sword */0
                                      });
                          })
                      }, "Sword"), React.createElement("button", {
                        onClick: (function (_event) {
                            return Curry._1(dispatch, {
                                        TAG: /* Equip */1,
                                        _0: /* TwoHanded */2
                                      });
                          })
                      }, "Two-Handed Sword"), React.createElement("button", {
                        onClick: (function (_event) {
                            return Curry._1(dispatch, /* Close */3);
                          })
                      }, "Close")) : React.createElement("span", undefined));
}

var make = GridComponent;

exports.moveClicked = moveClicked;
exports.attackClicked = attackClicked;
exports.shopClicked = shopClicked;
exports.closeShop = closeShop;
exports.equip = equip;
exports.make = make;
/* Unit Not a pure module */
