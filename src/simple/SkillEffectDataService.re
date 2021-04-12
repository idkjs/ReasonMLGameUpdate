type skillEffect = (Gamestate.gamestate, Square.square) => Gamestate.gamestate;

let getSquaresInAreaOfEffect = (areaOfEffect: Skill.areaOfEffect) =>
    switch(areaOfEffect){
        | AreaOfEffect(relativeCoordinates) => Square.getSquares(relativeCoordinates)
        | SingleTarget => Square.getSquares([{x: 0, y: 0}]) 
        | NoTarget => (_,_) => []
    }

let getSkillEffect = (skill: Skill.skill): skillEffect => 
    switch(skill.skilltype){
        | Fireball => (gamestate, clickedSquare) => {
            let unitInRange = (unit: Unit.unit) => List.exists((square: Square.square) => Coordinates.equals(square.coordinates, unit.coordinates), getSquaresInAreaOfEffect(skill.targetingReticule, gamestate.grid.squares, clickedSquare.coordinates));
            let fireballEffect = (unit: Unit.unit) => { ...unit, hp: unit.hp - 3 };
            { ...gamestate, units: Utils.updateList(unitInRange, fireballEffect, gamestate.units), grid: {squares: List.map((square: Square.square) => {...square, isTargeted: false}, gamestate.grid.squares ) }};
        }
    };