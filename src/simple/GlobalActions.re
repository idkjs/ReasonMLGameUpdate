type action =
    | MoveClicked
    | ClickedSquare(Square.square)
    | AttackClicked
    | ShopClicked
    | Close
    | Equip(Equipment.itemTypes)
    | SelectSkill(Skill.skill)
    | HoverSquare(Square.square)
