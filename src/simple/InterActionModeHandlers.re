let getClickedUnitId = (gameState: Gamestate.gamestate, clickedSquare: Square.square) => Option.map( (unit: Unit.unit) => unit.id, Gamestate.findUnit(gameState.units, clickedSquare.coordinates))

let selectSquare = (clickedSquare: Square.square) => List.map(
        (square: Square.square) => { ...square, isSelected: square.x === clickedSquare.x && square.y === clickedSquare.y })

let findUnit = (id: int) => List.find((unit: Unit.unit) => unit.id == id)

let findUnitInUnitList = (list: list(Unit.unit), id: int) => List.find((unit: Unit.unit) => unit.id == id, list)

let selectIntactionModeInClickedSquare = (gameState: Gamestate.gamestate, unitId: option(int)) : InteractionMode.interactions => {
    switch(unitId) {
        | None => SelectingAction
        | Some(id) => switch(findUnit(id, gameState.units).subtype) {
            | NPC => NpcSelected
            | Hero => HeroSelected
            | Monster => MonsterSelected
        }
    }
}

let selectActionClickedSquareHandler = (gameState: Gamestate.gamestate, clickedSquare: Square.square) => {
    let unitId = getClickedUnitId(gameState, clickedSquare);
    Gamestate.updateGamestate( 
        ~selectedUnitId=getClickedUnitId(gameState, clickedSquare), 
        ~squares=selectSquare(clickedSquare, gameState.grid.squares),
        ~interactionMode=selectIntactionModeInClickedSquare(gameState, unitId),
        gameState)
}

let onlyIfUnitSelected = (fn: (Unit.unit, Gamestate.gamestate, 'a) => Gamestate.gamestate, gameState: Gamestate.gamestate) => {
    switch(gameState.selectedUnitId) {
        | None => _var => gameState
        | Some(id) => fn(findUnit(id, gameState.units), gameState)
    }
}

let attackIfTargetHandler = onlyIfUnitSelected((attackingUnit: Unit.unit, gameState: Gamestate.gamestate, clickedSquare: Square.square) => {
    let targetId = getClickedUnitId(gameState, clickedSquare);
    let units = Option.map(id => List.map((unit: Unit.unit) => unit.id == id 
        ? { ...unit, hp: unit.hp - Unit.getTotalAttack(attackingUnit) } 
        : unit, gameState.units), targetId);
    Gamestate.updateGamestate(~interactionMode=HeroSelected,~units=?units, gameState);
})

let moveIfValidLocationHandler = onlyIfUnitSelected((selectedUnit: Unit.unit, gameState: Gamestate.gamestate, clickedSquare: Square.square) => {
    let resetGrid: Grid.grid =  { squares:  List.map(Square.reset, gameState.grid.squares) };
    Coordinates.distance2(selectedUnit.coordinates, clickedSquare.coordinates) < selectedUnit.movementrange 
        ? {
            ...gameState,
            grid: resetGrid,
            units: List.map( (unit: Unit.unit) => selectedUnit == unit 
                ? {...unit, coordinates: { x: clickedSquare.coordinates.x, y: clickedSquare.coordinates.y } } 
                : unit, gameState.units),
            interactionMode: SelectingAction 
        } 
        : { ...gameState, grid: resetGrid, interactionMode: HeroSelected};
})

let showMovementRange = onlyIfUnitSelected((selectedUnit: Unit.unit, gameState: Gamestate.gamestate, _: int) => 
    {
        ...gameState,
        grid: {squares:  List.map((square: Square.square) => Coordinates.distance2(selectedUnit.coordinates, square.coordinates) < selectedUnit.movementrange ?  {...square, inMovementRange: true} : square, gameState.grid.squares), },
        interactionMode: MovingUnit,
    })
