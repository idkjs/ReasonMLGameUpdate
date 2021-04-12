'use strict';

var Unit = require("./Unit.bs.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Gamestate = require("./Gamestate.bs.js");

function getClasses(square) {
  return "grid__square" + ((
            square.isSelected ? " grid__square--selected" : ""
          ) + ((
              !square.isSelected && square.isHovered && !square.isTargeted ? " grid__square--hovered" : ""
            ) + ((
                !square.isSelected && square.isTargeted ? " grid__square--targeted" : ""
              ) + (
                square.inMovementRange ? " grid__square--in-movement-range" : ""
              ))));
}

function SquareComponent(Props) {
  var square = Props.square;
  var handleClick = Props.handleClick;
  var gamestate = Props.gamestate;
  var match = React.useReducer((function (state, action) {
          if (typeof action === "number") {
            if (action !== 0) {
              return {
                      isSelected: state.isSelected,
                      isHovered: false,
                      isTargeted: state.isTargeted
                    };
            } else {
              return {
                      isSelected: state.isSelected,
                      isHovered: true,
                      isTargeted: state.isTargeted
                    };
            }
          } else {
            return state;
          }
        }), {
        isSelected: square.isSelected,
        isHovered: false,
        isTargeted: false
      });
  var dispatch = match[1];
  var unit = Gamestate.findUnit(gamestate.units, square.coordinates);
  var unitImage = unit !== undefined && Unit.isAlive(unit) ? "http://127.0.0.1:5500/src/images/" + unit.imagePath : "";
  return React.createElement("svg", {
              className: getClasses(square),
              onClick: (function (_event) {
                  return Curry._1(handleClick, {
                              TAG: /* ClickedSquare */0,
                              _0: square
                            });
                }),
              onMouseLeave: (function (_event) {
                  return Curry._1(dispatch, /* HoverOff */1);
                }),
              onMouseOver: (function (_event) {
                  return Curry._1(handleClick, {
                              TAG: /* HoverSquare */3,
                              _0: square
                            });
                })
            }, React.createElement("image", {
                  alt: "lalala",
                  height: "60",
                  href: "http://127.0.0.1:5500/src/images/terrain/mountain.png",
                  width: "60"
                }), React.createElement("image", {
                  alt: "lalala",
                  height: "60",
                  href: unitImage,
                  width: "60"
                }));
}

var make = SquareComponent;

exports.getClasses = getClasses;
exports.make = make;
/* Unit Not a pure module */
