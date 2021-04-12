'use strict';

var Unit = require("./Unit.bs.js");
var Utils = require("./Utils.bs.js");
var React = require("react");
var Player = require("./Player.bs.js");
var Square = require("./Square.bs.js");
var Gamestate = require("./Gamestate.bs.js");
var ReactDOMRe = require("reason-react/src/legacy/ReactDOMRe.bs.js");
var GridComponent = require("./GridComponent.bs.js");

var grid = {
  squares: Utils.createList(100, (function (e) {
          return Square.createSquare(e % 10, e < 10 ? 0 : (e - e % 10 | 0) / 10 | 0, "");
        }))
};

var hero = Unit.createUnit(0, 0, "units/bluearcherdown.png", 0, /* Hero */1);

var monster = Unit.createUnit(0, 1, "units/redarcherdown.png", 1, /* Monster */2);

var units_1 = {
  hd: monster,
  tl: /* [] */0
};

var units = {
  hd: hero,
  tl: units_1
};

var player = Player.createPlayer("Wesley", /* Red */0);

var gamestate = Gamestate.createGamestate(grid, units, player);

ReactDOMRe.renderToElementWithId(React.createElement(GridComponent.make, {
          gamestate: gamestate
        }), "grid");

exports.grid = grid;
exports.hero = hero;
exports.monster = monster;
exports.units = units;
exports.player = player;
exports.gamestate = gamestate;
/* grid Not a pure module */
