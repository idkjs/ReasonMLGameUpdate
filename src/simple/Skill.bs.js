'use strict';

var Coordinates = require("./Coordinates.bs.js");

function createSkill(name, skilltype, cooldown, targetingReticule) {
  return {
          name: name,
          skilltype: skilltype,
          cooldown: cooldown,
          targetingReticule: targetingReticule
        };
}

var areaPlus = /* AreaOfEffect */{
  _0: {
    hd: Coordinates.createCoordinates(0, 0),
    tl: {
      hd: Coordinates.createCoordinates(1, 0),
      tl: {
        hd: Coordinates.createCoordinates(0, 1),
        tl: {
          hd: Coordinates.createCoordinates(-1, 0),
          tl: {
            hd: Coordinates.createCoordinates(0, -1),
            tl: /* [] */0
          }
        }
      }
    }
  }
};

function createFireball(param) {
  return createSkill("Fireball", /* Fireball */0, 0, areaPlus);
}

exports.createSkill = createSkill;
exports.areaPlus = areaPlus;
exports.createFireball = createFireball;
/* areaPlus Not a pure module */
