 type state = { gameState: Gamestate.gamestate};

/* let moveClicked = (gamestate: Gamestate.gamestate) => {gameState: {...gamestate, interactionMode: MovingUnit}}; */
let moveClicked = (gamestate: Gamestate.gamestate) => {gameState: InterActionModeHandlers.showMovementRange(gamestate, 1)};
let attackClicked = (gamestate: Gamestate.gamestate) => {gameState: {...gamestate, interactionMode: AttackingUnit}};
let shopClicked = (gamestate: Gamestate.gamestate) => {gameState: {...gamestate, interactionMode: OpenShop}};
let closeShop = (gamestate: Gamestate.gamestate) => {gameState: {...gamestate, interactionMode: HeroSelected}};
let equip = (gameState: Gamestate.gamestate, itemTypes: Equipment.itemTypes) =>  {gameState: {...gameState, units: List.map( (unit: Unit.unit) => Option.contains(gameState.selectedUnitId, unit.id) ? {...unit, equipment: Equipment.equip(unit.equipment, Equipment.createItem(itemTypes)) } : unit, gameState.units), interactionMode: SelectingAction }};

[@react.component]
let make = (~gamestate: Gamestate.gamestate) => {

  let (state,dispatch) =React.useReducer((state,action: GlobalActions.action) =>
    switch (action) {
    | ClickedSquare(clickedSquare) => {
      switch (state.gameState.interactionMode) {
        | SelectingAction => {gameState: InterActionModeHandlers.selectActionClickedSquareHandler(state.gameState, clickedSquare) }
        | NpcSelected=> {gameState: InterActionModeHandlers.selectActionClickedSquareHandler(state.gameState, clickedSquare) }
        | HeroSelected => {gameState: InterActionModeHandlers.selectActionClickedSquareHandler(state.gameState, clickedSquare) }
        | MonsterSelected => {gameState: InterActionModeHandlers.selectActionClickedSquareHandler(state.gameState, clickedSquare) }

        /* | MovingUnit =>  {gameState: {...state.gameState, units: List.map( (unit: Unit.unit) => Option.contains(state.gameState.selectedUnitId, unit.id) ? {...unit, coordinates: { x: clickedSquare.coordinates.x, y: clickedSquare.coordinates.y } } : unit, state.gameState.units), interactionMode: SelectingAction }} */
        | MovingUnit =>  {gameState: InterActionModeHandlers.moveIfValidLocationHandler(state.gameState, clickedSquare) }
        | AttackingUnit => {gameState: InterActionModeHandlers.attackIfTargetHandler(state.gameState, clickedSquare) }
        | Targeting(skill) => { gameState: { ...SkillEffectDataService.getSkillEffect(skill)(state.gameState, clickedSquare), interactionMode: SelectingAction }}
        | OpenShop => state
      }
    }
    | HoverSquare(hoveredSquare) => {
      switch(state.gameState.interactionMode) {
        | Targeting(skill) => {gameState: { ...state.gameState, grid: {
          squares: List.map(square => SkillEffectDataService.getSquaresInAreaOfEffect(skill.targetingReticule, state.gameState.grid.squares, hoveredSquare.coordinates) |> List.exists(areaSquare => areaSquare == square) ? { ...square, isTargeted: true } : { ...square, isTargeted: false }, state.gameState.grid.squares) }}}
        | _ => {gameState: { ...state.gameState, grid: { squares: List.map(square => square == hoveredSquare ? { ...square, isHovered: true } : { ...square, isHovered: false }, state.gameState.grid.squares) }}}
      }
    }
    | MoveClicked => moveClicked(state.gameState)
    | AttackClicked => attackClicked(state.gameState)
    | ShopClicked => shopClicked(state.gameState)
    | SelectSkill(skill) =>
        switch(skill.targetingReticule) {
        | NoTarget => { gameState: { ...SkillEffectDataService.getSkillEffect(skill)(state.gameState, List.hd(state.gameState.grid.squares)), interactionMode: SelectingAction }}
        | _ => { gameState: { ...state.gameState, interactionMode: Targeting(skill) }}
        }
    | Close => {
      switch(state.gameState.interactionMode) {
        | OpenShop => closeShop(state.gameState)
        | _ => state
      }
    }
    | Equip(itemTypes) => equip(state.gameState, itemTypes)
    },{gameState: gamestate});
    <div className="grid">
      (Utils.createGrid(10, 10, Utils.createSquare(dispatch, state.gameState), state.gameState.grid.squares))
      <div>(React.string(Option.optionIntToString(state.gameState.selectedUnitId)))</div>
      <div>{React.string("Turnorder?")}</div>
      <div>(List.map((unit: Unit.unit) => React.string(string_of_int(unit.id)), Unit.determineTurnOrder(state.gameState.units)) |> Array.of_list |> React.array)</div>
      <div>(Option.map(InterActionModeHandlers.findUnitInUnitList(state.gameState.units), state.gameState.selectedUnitId)
      |> Option.map((unit: Unit.unit) => unit.hp) |> Option.optionIntToString |> React.string)</div>
      (state.gameState.interactionMode == HeroSelected && Option.contains(state.gameState.selectedUnitId, List.hd(Unit.determineTurnOrder(state.gameState.units)).id)
      ? <div>
        <button onClick=(_event => dispatch(MoveClicked)) >{React.string("Move")}</button>
        <button onClick=(_event => dispatch(AttackClicked)) >{React.string("Attack")}</button>
        <button onClick=(_event => dispatch(ShopClicked)) >{React.string("Open shop")}</button>
        (List.hd(Unit.determineTurnOrder(state.gameState.units)).skills |> List.map(skill =>
        <button onClick=(_event => dispatch(SelectSkill(skill)))>(React.string(skill.name))</button>) |> Array.of_list |> React.array
        )
      </div>
      : <span/>
      )
      (state.gameState.interactionMode == OpenShop  && Option.contains(state.gameState.selectedUnitId, List.hd(Unit.determineTurnOrder(state.gameState.units)).id)
      ? <div>
        <button onClick=(_event => dispatch(Equip(Sword))) >{React.string("Sword")}</button>
        <button onClick=(_event => dispatch(Equip(TwoHanded))) >{React.string("Two-Handed Sword")}</button>
        <button onClick=(_event => dispatch(Close)) >{React.string("Close")}</button>
      </div>
      :<span/>
      )
    </div>
};
