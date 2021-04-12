type equipmentType =
  | LeftArm
  | RightArm
  | TwoHanded
  | Any;

type equipable = {
  attackModifier: int,
  hpModifier: int,
  equipmentType,
};

let createEquipable = (attackModifier, hpModifier, equipmentType) => {
  equipmentType,
  attackModifier,
  hpModifier,
};
let getAttackModifier = (equipable: equipable) => equipable.attackModifier;
let getHpModifier = (equipable: equipable) => equipable.hpModifier;

type equipment = {
  leftArm: equipable,
  rightArm: equipable,
};

let creatEquipment = (leftArm, rightArm) => {leftArm, rightArm};

type itemTypes =
  | Sword
  | Shield
  | TwoHanded
  | EmptyLeftArm
  | EmptyRightArm;

let createItem = itemTypes => {
  switch (itemTypes) {
  | Sword => createEquipable(1, 0, LeftArm)
  | Shield => createEquipable(0, 1, RightArm)
  | EmptyLeftArm => createEquipable(0, 0, LeftArm)
  | TwoHanded => createEquipable(3, 0, TwoHanded)
  | EmptyRightArm => createEquipable(0, 0, RightArm)
  };
};

let equip = (equipment: equipment, equipable: equipable) =>
  switch (equipable.equipmentType) {
  | LeftArm => {...equipment, leftArm: equipable}
  | RightArm => {
      leftArm:
        equipment.leftArm.equipmentType == TwoHanded
          ? createItem(EmptyLeftArm) : equipment.leftArm,
      rightArm: equipable,
    }
  | TwoHanded => {leftArm: equipable, rightArm: createItem(EmptyRightArm)}
  | Any => equipment
  };

let getStatTotal = (statGetter: equipable => int, equipment: equipment) =>
  statGetter(equipment.leftArm) + statGetter(equipment.rightArm);

let getAttackModifierTotal = getStatTotal(getAttackModifier);
let getHpModifierTotal = getStatTotal(getHpModifier);
