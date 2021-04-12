'use strict';

var Curry = require("bs-platform/lib/js/curry.js");

function createEquipable(attackModifier, hpModifier, equipmentType) {
  return {
          attackModifier: attackModifier,
          hpModifier: hpModifier,
          equipmentType: equipmentType
        };
}

function getAttackModifier(equipable) {
  return equipable.attackModifier;
}

function getHpModifier(equipable) {
  return equipable.hpModifier;
}

function creatEquipment(leftArm, rightArm) {
  return {
          leftArm: leftArm,
          rightArm: rightArm
        };
}

function createItem(itemTypes) {
  switch (itemTypes) {
    case /* Sword */0 :
        return {
                attackModifier: 1,
                hpModifier: 0,
                equipmentType: /* LeftArm */0
              };
    case /* Shield */1 :
        return {
                attackModifier: 0,
                hpModifier: 1,
                equipmentType: /* RightArm */1
              };
    case /* TwoHanded */2 :
        return {
                attackModifier: 3,
                hpModifier: 0,
                equipmentType: /* TwoHanded */2
              };
    case /* EmptyLeftArm */3 :
        return {
                attackModifier: 0,
                hpModifier: 0,
                equipmentType: /* LeftArm */0
              };
    case /* EmptyRightArm */4 :
        return {
                attackModifier: 0,
                hpModifier: 0,
                equipmentType: /* RightArm */1
              };
    
  }
}

function equip(equipment, equipable) {
  var match = equipable.equipmentType;
  switch (match) {
    case /* LeftArm */0 :
        return {
                leftArm: equipable,
                rightArm: equipment.rightArm
              };
    case /* RightArm */1 :
        return {
                leftArm: equipment.leftArm.equipmentType === /* TwoHanded */2 ? ({
                      attackModifier: 0,
                      hpModifier: 0,
                      equipmentType: /* LeftArm */0
                    }) : equipment.leftArm,
                rightArm: equipable
              };
    case /* TwoHanded */2 :
        return {
                leftArm: equipable,
                rightArm: {
                  attackModifier: 0,
                  hpModifier: 0,
                  equipmentType: /* RightArm */1
                }
              };
    case /* Any */3 :
        return equipment;
    
  }
}

function getStatTotal(statGetter, equipment) {
  return Curry._1(statGetter, equipment.leftArm) + Curry._1(statGetter, equipment.rightArm) | 0;
}

function getAttackModifierTotal(param) {
  return getStatTotal(getAttackModifier, param);
}

function getHpModifierTotal(param) {
  return getStatTotal(getHpModifier, param);
}

exports.createEquipable = createEquipable;
exports.getAttackModifier = getAttackModifier;
exports.getHpModifier = getHpModifier;
exports.creatEquipment = creatEquipment;
exports.createItem = createItem;
exports.equip = equip;
exports.getStatTotal = getStatTotal;
exports.getAttackModifierTotal = getAttackModifierTotal;
exports.getHpModifierTotal = getHpModifierTotal;
/* No side effect */
