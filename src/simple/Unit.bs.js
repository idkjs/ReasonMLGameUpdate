'use strict';

var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Skill = require("./Skill.bs.js");
var Equipment = require("./Equipment.bs.js");
var Coordinates = require("./Coordinates.bs.js");
var Caml_primitive = require("bs-platform/lib/js/caml_primitive.js");

function createEquipment(param) {
  return Equipment.creatEquipment(Equipment.createItem(/* EmptyLeftArm */3), Equipment.createItem(/* EmptyRightArm */4));
}

function compareUnitSpeed(unit1, unit2) {
  var speedComparison = Caml_primitive.caml_int_compare(unit1.baseSpeed, unit2.baseSpeed);
  if (speedComparison === 0) {
    return Caml_primitive.caml_int_compare(unit1.id, unit2.id);
  } else {
    return speedComparison;
  }
}

function determineTurnOrder(units) {
  return List.sort(compareUnitSpeed, units);
}

function createUnit(x, y, imagePath, id, subtype) {
  return {
          x: x,
          y: y,
          imagePath: imagePath,
          id: id,
          subtype: subtype,
          coordinates: Coordinates.createCoordinates(x, y),
          equipment: createEquipment(undefined),
          hp: 10,
          baseAttack: 1,
          baseSpeed: 5,
          skills: {
            hd: Skill.createFireball(undefined),
            tl: /* [] */0
          },
          movementrange: 2
        };
}

function getTotalAttack(unit) {
  return unit.baseAttack + Equipment.getAttackModifierTotal(unit.equipment) | 0;
}

function isAlive(unit) {
  return unit.hp > 0;
}

function Make(LocatableType) {
  var compare = function (locatable1, locatable2) {
    if (Curry._1(LocatableType.getXCoordinate, locatable1) === Curry._1(LocatableType.getXCoordinate, locatable2)) {
      return Curry._1(LocatableType.getYCoordinate, locatable1) === Curry._1(LocatableType.getYCoordinate, locatable2);
    } else {
      return false;
    }
  };
  return {
          compare: compare
        };
}

function MakeGeneric(LocatableType, LocatableType2) {
  var compare = function (locatable1, locatable2) {
    if (Curry._1(LocatableType.getXCoordinate, locatable1) === Curry._1(LocatableType2.getXCoordinate, locatable2)) {
      return Curry._1(LocatableType.getYCoordinate, locatable1) === Curry._1(LocatableType2.getYCoordinate, locatable2);
    } else {
      return false;
    }
  };
  return {
          compare: compare
        };
}

function getXCoordinate(unit) {
  return unit.x;
}

function getYCoordinate(unit) {
  return unit.y;
}

var Unit = {
  getXCoordinate: getXCoordinate,
  getYCoordinate: getYCoordinate
};

function compare(locatable1, locatable2) {
  if (locatable1.x === locatable2.x) {
    return locatable1.y === locatable2.y;
  } else {
    return false;
  }
}

var LocatableUnit = {
  compare: compare
};

exports.createEquipment = createEquipment;
exports.compareUnitSpeed = compareUnitSpeed;
exports.determineTurnOrder = determineTurnOrder;
exports.createUnit = createUnit;
exports.getTotalAttack = getTotalAttack;
exports.isAlive = isAlive;
exports.Make = Make;
exports.MakeGeneric = MakeGeneric;
exports.Unit = Unit;
exports.LocatableUnit = LocatableUnit;
/* Skill Not a pure module */
