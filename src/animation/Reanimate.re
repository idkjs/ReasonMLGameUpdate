let pxI = i => string_of_int(i) ++ "px";

let pxF = v => pxI(int_of_float(v));

module Key = {
  let counter = ref(0);
  let gen = () => {
    incr(counter);
    string_of_int(counter^);
  };
};

module ImageTransition: {
  /***
   * Render function for a transition between two images.
   * phase is a value between 0.0 (first image) and 1.0 (second image).
   **/
  let render: (~phase: float, int, int) => React.element;
  let displayHeight: int;
} = {
  let numImages = 6;
  let displayHeight = 200;
  let displayHeightString = pxI(displayHeight);
  let sizes = [|
    (500, 350),
    (800, 600),
    (800, 400),
    (700, 500),
    (200, 650),
    (600, 600),
  |];
  let displayWidths =
    Belt.Array.map(sizes, ((w, h)) => w * displayHeight / h);
  let getWidth = i => displayWidths[(i + numImages) mod numImages];

  /***
   * Interpolate width and left for 2 images, phase is between 0.0 and 1.0.
   **/
  let interpolate = (~width1, ~width2, phase) => {
    let width1 = float_of_int(width1);
    let width2 = float_of_int(width2);
    let width = width1 *. (1. -. phase) +. width2 *. phase;
    let left1 = -. (width1 *. phase);
    let left2 = left1 +. width1;
    (pxF(width), pxF(left1), pxF(left2));
  };
  let renderImage = (~left, i) =>
    <img
      className="photo-inner"
      style={ReactDOMRe.Style.make(~height=displayHeightString, ~left, ())}
      src={"./" ++ string_of_int((i + numImages) mod numImages) ++ ".jpg"}
    />;
  let render = (~phase, image1, image2) => {
    let width1 = getWidth(image1);
    let width2 = getWidth(image2);
    let (width, left1, left2) = interpolate(~width1, ~width2, phase);
    <div>
      <div
        className="photo-outer"
        style={ReactDOMRe.Style.make(~height=displayHeightString, ~width, ())}>
        {renderImage(~left=left1, image1)}
        {renderImage(~left=left2, image2)}
      </div>
    </div>;
  };
};

module ImageGalleryAnimation = {
  type action =
    | Click
    | SetCursor(float);
  type state = {
    animation: SpringAnimation.t,
    /* cursor value 3.5 means half way between image 3 and image 4 */
    cursor: float,
    targetImage: int,
  };
  [@react.component]
  let make = (~initialImage=0, ~animateMount=true) => {
    let (state, dispatch) =
      React.useReducer(
        (state, action) =>
          switch (action) {
          | Click =>
            state.animation
            |> SpringAnimation.setFinalValue(float_of_int(state.targetImage));
            {...state, targetImage: state.targetImage + 1};
          | SetCursor(cursor) => {...state, cursor}
          },
        {
          animation: SpringAnimation.create(float_of_int(initialImage)),
          cursor: float_of_int(initialImage),
          targetImage: initialImage,
        },
      );
    React.useEffect1(
      () => {
        // had to disable warning 48 but want to understand how to pass optional args. None of these worked.
        // (~preset: Spring.preset=?, ~speedup: float=?, ~precision: float=?,

        // ~finalValue: float=?, SpringAnimation.t) => unit

        //  state.animation
        //   |> SpringAnimation.setOnChange(~preset=?, ~precision=0.05, ~speedup=?, ~onStop?, ~finalValue?, ~onChange=cursor =>
        //        dispatch(SetCursor(state.cursor))

        //         state.animation

        // ~onStop?,~finalValue?, ~onChange=state.cursor => dispatch(SetCursor(cursor)));
        state.animation
        |> SpringAnimation.setOnChange(~precision=0.05, ~onChange=cursor =>
             dispatch(SetCursor(cursor))
           );
        if (animateMount) {
          dispatch(Click);
        };
        Some(() => SpringAnimation.stop(state.animation));
      },
      [|state|],
    );

    let cursor = state.cursor;
    let image = int_of_float(cursor);
    let phase = cursor -. float_of_int(image);
    <div onClick={_e => dispatch(Click)}>
      {ImageTransition.render(~phase, image, image + 1)}
    </div>;
  };
};

module AnimatedButton = {
  module Text = {
    [@react.component]
    let make = (~text) => {
      <button> {React.string(text)} </button>;
    };
  };
  type size =
    | Small
    | Large;
  let targetHeight = 30.;
  let closeWidth = 50.;
  let smallWidth = 250.;
  let largeWidth = 450.;
  type state = {
    animation: SpringAnimation.t,
    width: int,
    size,
    clickCount: int,
    actionCount: int,
  };
  type action =
    | Click
    | Reset
    | Unclick
    /* Width action triggered during animation.  */
    | Width(int)
    /* Toggle the size between small and large, and animate the width. */
    | ToggleSize
    /* Close the button by animating the width to shrink. */
    | Close;
  [@react.component]
  let make = (~text="Button", ~rAction, ~animateMount=true, ~onClose=?) => {
    let (state, setState) =
      React.useState(() =>
        {
          animation: SpringAnimation.create(smallWidth),
          width: int_of_float(smallWidth),
          size: Small,
          clickCount: 0,
          actionCount: 0,
        }
      );
    let (_, dispatch) =
      React.useReducer(
        (_, action) =>
          switch (action) {
          | Click =>
            setState(_ =>
              {
                ...state,
                clickCount: state.clickCount + 1,
                actionCount: state.actionCount + 1,
              }
            );
            state;
          | Reset =>
            setState(_ =>
              {...state, clickCount: 0, actionCount: state.actionCount + 1}
            );
            state;
          | Unclick =>
            setState(_ =>
              {
                ...state,
                clickCount: state.clickCount - 1,
                actionCount: state.actionCount + 1,
              }
            );
            state;
          | Width(width) =>
            setState(_ => {...state, width});
            state;
          | ToggleSize =>
            setState(_ =>
              {...state, size: state.size === Small ? Large : Small}
            );
            state;
          | Close =>
            state.animation
            |> SpringAnimation.setOnChange(
                 ~finalValue=closeWidth,
                 ~speedup=0.3,
                 ~precision=10.,
                 ~onStop=onClose,
                 ~onChange=w =>
                 setState(_ => {...state, width: int_of_float(w)})
               );
            state;
          },
        state,
      );
    React.useEffect1(
      () => {
        RemoteAction.subscribe(~send=dispatch, rAction) |> ignore;
        if (animateMount) {
          dispatch(ToggleSize);
        };
        Some(() => SpringAnimation.stop(state.animation));
      },
      [|state|],
    );

    let buttonLabel = state =>
      text
      ++ " clicks:"
      ++ string_of_int(state.clickCount)
      ++ " actions:"
      ++ string_of_int(state.actionCount);
    <div
      className="exampleButton large"
      onClick={_e => dispatch(Click)}
      style={ReactDOMRe.Style.make(~width=pxI(state.width), ())}>
      <Text text={buttonLabel(state)} />
    </div>;
  };
};

module AnimateHeight = {
  /* When the closing animation begins */
  type onBeginClosing = Animation.onStop;
  type action =
    | Open(Animation.onStop)
    | BeginClosing(onBeginClosing, Animation.onStop)
    | Close(Animation.onStop)
    | Animate(float, Animation.onStop)
    | Height(float);
  type state = {
    height: float,
    animation: SpringAnimation.t,
  };
  [@react.component]
  let make = (~rAction, ~targetHeight, ~children: React.element) => {
    let (state, setState) =
      React.useState(() =>
        {height: 0., animation: SpringAnimation.create(0.)}
      );

    let animate = (finalValue, onStop) =>
      state.animation
      |> SpringAnimation.setOnChange(
           ~finalValue, ~precision=10., ~onStop, ~onChange=h =>
           setState(_ => {...state, height: h})
         );
    let (_, dispatch) =
      React.useReducer(
        (_, action) =>
          switch (action) {
          | Height(v) =>
            setState(_ => {...state, height: v});
            state;
          | Animate(finalValue, onStop) =>
            animate(finalValue, onStop);
            state;
          | Close(onClose) =>
            animate(0., onClose);
            state;
          | BeginClosing(onBeginClosing, onClose) =>
            switch (onBeginClosing) {
            | None => ()
            | Some(f) => f()
            };
            animate(0., onClose);
            state;
          | Open(onOpen) =>
            animate(targetHeight, onOpen);
            state;
          },
        {
          state;
        },
      );

    React.useEffect1(
      () => {
        RemoteAction.subscribe(~send=dispatch, rAction) |> ignore;

        Some(() => dispatch(Animate(targetHeight, None)));
      },
      [|state|],
    );

    <div
      style={ReactDOMRe.Style.make(
        ~height=pxF(state.height),
        ~overflow="hidden",
        (),
      )}>
      children
    </div>;
  };
};

module ReducerAnimationExample = {
  type action =
    | SetAct(action => unit)
    | AddSelf
    | AddButton(bool)
    | AddButtonFirst(bool)
    | AddImage(bool)
    | DecrementAllButtons
    /* Remove from the list the button uniquely identified by its height RemoteAction */
    | FilterOutItem(RemoteAction.t(AnimateHeight.action))
    | IncrementAllButtons
    | CloseAllButtons
    | RemoveItem
    | ResetAllButtons
    | ReverseItemsAnimation
    | CloseHeight(Animation.onStop) /* Used by ReverseAnim */
    | ReverseWithSideEffects(unit => unit) /* Used by ReverseAnim */
    | OpenHeight(Animation.onStop) /* Used by ReverseAnim */
    | ToggleRandomAnimation;
  type item = {
    element: React.element,
    rActionButton: RemoteAction.t(AnimatedButton.action),
    rActionHeight: RemoteAction.t(AnimateHeight.action),
    /* used while removing items, to find the first item not already closing */
    mutable closing: bool,
  };
  module State: {
    type t = {
      act: action => unit,
      randomAnimation: Animation.t,
      items: list(item),
    };
    let createButton:
      (
        ~removeFromList: RemoteAction.t(AnimateHeight.action) => unit,
        ~animateMount: bool=?,
        int
      ) =>
      item;
    let createImage: (~animateMount: bool=?, int) => item;
    let getElements: t => array(React.element);
    let initial: unit => t;
  } = {
    type t = {
      act: action => unit,
      randomAnimation: Animation.t,
      items: list(item),
    };
    let initial = () => {
      act: _action => (),
      randomAnimation: Animation.create(),
      items: [],
    };
    let getElements = ({items}) =>
      Belt.List.toArray(Belt.List.mapReverse(items, x => x.element));
    let createButton = (~removeFromList, ~animateMount=?, number) => {
      let rActionButton = RemoteAction.create();
      let rActionHeight = RemoteAction.create();
      let key = Key.gen();
      let onClose = () =>
        RemoteAction.send(
          rActionHeight,
          ~action=
            AnimateHeight.Close(Some(() => removeFromList(rActionHeight))),
        );
      let element: React.element =
        <AnimateHeight
          key rAction=rActionHeight targetHeight=AnimatedButton.targetHeight>
          <AnimatedButton
            key
            text={"Button#" ++ string_of_int(number)}
            rAction=rActionButton
            ?animateMount
            onClose
          />
        </AnimateHeight>;
      {element, rActionButton, rActionHeight, closing: false};
    };
    let createImage = (~animateMount=?, number) => {
      let key = Key.gen();
      let rActionButton = RemoteAction.create();
      let imageGalleryAnimation =
        <ImageGalleryAnimation
          key={Key.gen()}
          initialImage=number
          ?animateMount
        />;
      let rActionHeight = RemoteAction.create();
      let element =
        <AnimateHeight
          key
          rAction=rActionHeight
          targetHeight={float_of_int(ImageTransition.displayHeight)}>
          imageGalleryAnimation
        </AnimateHeight>;
      {element, rActionButton, rActionHeight, closing: false};
    };
  };
  //  let (state: Updater.t, dispatch) =
  //   React.useReducer(
  //     (state, action: Operations.action) => Updater.update(state, action),
  //     Updater.initialState,
  //   );

  [@react.component]
  let rec make = (~showAllButtons, ()) => {
    let self = (~key) =>
      React.createElement(make, makeProps(~key, ~showAllButtons, ()));
    let (state: State.t, setState) = React.useState(() => State.initial());

    let runAll = action => {
      //     let perform = (action: Operations.action) => {
      //   Js.log2("perform_action:", action);
      //   dispatch(action);
      // };
      let performSideEffects = () =>
        Belt.List.forEach(state.items, ({rActionButton}) =>
          RemoteAction.send(rActionButton, ~action)
        );
      performSideEffects();
    };
    let (state, dispatch) =
      React.useReducer(
        (_, action) =>
          switch (action) {
          | SetAct(act) => {...state, act}
          // | AddSelf => state
          | AddSelf =>
            // module Self = {
            //   [@react.component]
            //   let make = make(~showAllButtons);
            // };
            let key = Key.gen();
            let rActionButton = RemoteAction.create();
            let rActionHeight = RemoteAction.create();
            let element =
              <AnimateHeight key rAction=rActionHeight targetHeight=500.>
                // <Self key />
                 {self(~key)} </AnimateHeight>;
            let item = {
              element,
              rActionButton,
              rActionHeight,
              closing: false,
            };
            {...state, items: [item, ...state.items]};
          | AddButton(animateMount) =>
            {
              let removeFromList = rActionHeight =>
                state.act(FilterOutItem(rActionHeight));
              setState(_ =>
                {
                  ...state,
                  items: [
                    State.createButton(
                      ~removeFromList,
                      ~animateMount,
                      Belt.List.length(state.items),
                    ),
                    ...state.items,
                  ],
                }
              );
            };
            state;
          | AddButtonFirst(animateMount) =>
            let {act, items} = state;
            let removeFromList = rActionHeight =>
              act(FilterOutItem(rActionHeight));
            {
              ...state,
              items:
                items
                @ [
                  State.createButton(
                    ~removeFromList,
                    ~animateMount,
                    Belt.List.length(items),
                  ),
                ],
            };
          | AddImage(animateMount) => {
              ...state,
              items: [
                State.createImage(
                  ~animateMount,
                  Belt.List.length(state.items),
                ),
                ...state.items,
              ],
            }
          | FilterOutItem(rAction) =>
            let filter = item => item.rActionHeight !== rAction;
            {...state, items: Belt.List.keep(state.items, filter)};
          | DecrementAllButtons =>
            runAll(Unclick);
            state;
          | IncrementAllButtons =>
            runAll(Click);
            state;
          | CloseAllButtons =>
            runAll(Close);
            state;
          | RemoveItem =>
            switch (
              Belt.List.getBy(state.items, item => item.closing === false)
            ) {
            | Some(firstItemNotClosing) =>
              let onBeginClosing =
                Some(() => firstItemNotClosing.closing = true);
              let onClose =
                Some(
                  () =>
                    state.act(
                      FilterOutItem(firstItemNotClosing.rActionHeight),
                    ),
                );
              let _ =
                RemoteAction.send(
                  firstItemNotClosing.rActionHeight,
                  ~action=BeginClosing(onBeginClosing, onClose),
                );
              state;
            | None => state
            }
          | ResetAllButtons =>
            runAll(Reset);
            state;
          | CloseHeight(onStop) =>
            let len = Belt.List.length(state.items);
            let count = ref(len);
            let onClose = () => {
              decr(count);
              if (count^ === 0) {
                switch (onStop) {
                | None => ()
                | Some(f) => f()
                };
              };
            };
            let _ =
              Belt.List.forEach(state.items, item =>
                RemoteAction.send(
                  item.rActionHeight,
                  ~action=Close(Some(onClose)),
                )
              );
            state;
          | OpenHeight(onStop) =>
            let len = Belt.List.length(state.items);
            let count = ref(len);
            let onClose = () => {
              decr(count);
              if (count^ === 0) {
                switch (onStop) {
                | None => ()
                | Some(f) => f()
                };
              };
            };
            let _ =
              Belt.List.forEach(state.items, item =>
                RemoteAction.send(
                  item.rActionHeight,
                  ~action=Open(Some(onClose)),
                )
              );
            state;
          | ReverseWithSideEffects(performSideEffects) =>
            performSideEffects();
            setState(_ => {...state, items: Belt.List.reverse(state.items)});
            state;
          | ReverseItemsAnimation =>
            let onStopClose = () =>
              state.act(
                ReverseWithSideEffects(() => state.act(OpenHeight(None))),
              );
            state.act(CloseHeight(Some(onStopClose)));
            state;
          | ToggleRandomAnimation =>
            let _ =
              Animation.isActive(state.randomAnimation)
                ? Animation.stop(state.randomAnimation)
                : Animation.start(state.randomAnimation);
            state;
          },
        state,
      );
    React.useEffect1(
      () => {
        let callback =
          (.) => {
            let randomAction =
              switch (Random.int(6)) {
              | 0 => AddButton(true)
              | 1 => AddImage(true)
              | 2 => RemoveItem
              | 3 => RemoveItem
              | 4 => DecrementAllButtons
              | 5 => IncrementAllButtons
              | _ => assert(false)
              };
            dispatch(randomAction);
            Animation.Continue;
          };
        dispatch(SetAct(dispatch));
        Animation.setCallback(state.randomAnimation, ~callback);

        Some(() => Animation.stop(state.randomAnimation));
      },
      [|state|],
    );

    let button = (~repeat=1, ~hide=false, txt, action) =>
      hide
        ? React.null
        : <div
            className="exampleButton large"
            style={ReactDOMRe.Style.make(~width="220px", ())}
            onClick={_e =>
              for (_ in 1 to repeat) {
                state.act(action);
              }
            }>
            {React.string(txt)}
          </div>;
    let hide = !showAllButtons;
    <div className="componentBox">
      <div className="componentColumn">
        {React.string("Control:")}
        {button("Add Button", AddButton(true))}
        {button("Add Image", AddImage(true))}
        {button("Add Button On Top", AddButtonFirst(true))}
        {button("Remove Item", RemoveItem)}
        {button(
           ~hide,
           ~repeat=100,
           "Add 100 Buttons On Top",
           AddButtonFirst(false),
         )}
        {button(~hide, ~repeat=100, "Add 100 Images", AddImage(false))}
        {button("Click all the Buttons", IncrementAllButtons)}
        {button(~hide, "Unclick all the Buttons", DecrementAllButtons)}
        {button("Close all the Buttons", CloseAllButtons)}
        {button(
           ~hide,
           ~repeat=10,
           "Click all the Buttons 10 times",
           IncrementAllButtons,
         )}
        {button(~hide, "Reset all the Buttons' states", ResetAllButtons)}
        {button("Reverse Items", ReverseItemsAnimation)}
        {button(
           "Random Animation "
           ++ (Animation.isActive(state.randomAnimation) ? "ON" : "OFF"),
           ToggleRandomAnimation,
         )}
        {button("Add Self", AddSelf)}
      </div>
      <div
        className="componentColumn"
        style={ReactDOMRe.Style.make(~width="500px", ())}>
        <div>
          {React.string(
             "Items:" ++ string_of_int(Belt.List.length(state.items)),
           )}
        </div>
        {React.array(State.getElements(state))}
      </div>
    </div>;
  };
};

module ChatHead = {
  type action =
    | MoveX(float)
    | MoveY(float);
  type state = {
    x: float,
    y: float,
  };
  [@react.component]
  let make = (~rAction, ~headNum, ~imageGallery) => {
    let (state, dispatch) =
      React.useReducer(
        (state, action) =>
          switch (action) {
          | MoveX(x) => {...state, x}
          | MoveY(y) => {...state, y}
          },
        {x: 0., y: 0.},
      );
    React.useEffect0(() => {
      RemoteAction.subscribe(~send=dispatch, rAction) |> ignore;
      None;
    });

    let {x, y} = state;
    let left = pxF(x -. 25.);
    let top = pxF(y -. 25.);
    imageGallery
      ? <div
          className="chat-head-image-gallery"
          style={ReactDOMRe.Style.make(
            ~left,
            ~top,
            ~zIndex=string_of_int(- headNum),
            (),
          )}>
          <ImageGalleryAnimation initialImage=headNum />
        </div>
      : <div
          className={"chat-head chat-head-" ++ string_of_int(headNum mod 6)}
          style={ReactDOMRe.Style.make(
            ~left,
            ~top,
            ~zIndex=string_of_int(- headNum),
            (),
          )}
        />;
  };
};

module ChatHeadsExample = {
  [@bs.val]
  external addEventListener: (string, Js.t({..}) => unit) => unit =
    "window.addEventListener";
  let numHeads = 6;
  type control = {
    rAction: RemoteAction.t(ChatHead.action),
    animX: SpringAnimation.t,
    animY: SpringAnimation.t,
  };
  type state = {
    controls: array(control),
    chatHeads: array(React.element),
  };
  let createControl = () => {
    rAction: RemoteAction.create(),
    animX: SpringAnimation.create(0.),
    animY: SpringAnimation.create(0.),
  };

  [@react.component]
  let make = (~imageGallery) => {
    let controls = Belt.Array.makeBy(numHeads, _ => createControl());
    let chatHeads =
      Belt.Array.makeBy(numHeads, i =>
        <ChatHead
          key={Key.gen()}
          imageGallery
          rAction={controls[i].rAction}
          headNum=i
        />
      );

    let (state, _) = React.useState(() => {controls, chatHeads});
    React.useEffect1(
      () => {
        {
          let setupAnimation = headNum => {
            let setOnChange = (~isX, afterChange) => {
              let control = controls[headNum];
              let animation = isX ? control.animX : control.animY;
              animation
              |> SpringAnimation.setOnChange(
                   ~preset=Spring.gentle,
                   ~speedup=2.,
                   ~onChange=v => {
                     RemoteAction.send(
                       control.rAction,
                       ~action=isX ? MoveX(v) : MoveY(v),
                     );
                     afterChange(v);
                   },
                 );
            };
            let isLastHead = headNum == numHeads - 1;
            let afterChangeX = x =>
              isLastHead
                ? ()
                : controls[headNum + 1].animX
                  |> SpringAnimation.setFinalValue(x);
            let afterChangeY = y =>
              isLastHead
                ? ()
                : controls[headNum + 1].animY
                  |> SpringAnimation.setFinalValue(y);
            setOnChange(~isX=true, afterChangeX);
            setOnChange(~isX=false, afterChangeY);
          };
          Belt.Array.forEachWithIndex(controls, (i, _) => setupAnimation(i));
          let onMove = e => {
            let x = e##pageX;
            let y = e##pageY;
            controls[0].animX |> SpringAnimation.setFinalValue(x);
            controls[0].animY |> SpringAnimation.setFinalValue(y);
          };
          addEventListener("mousemove", onMove);
          addEventListener("touchmove", onMove);
        };
        Some(
          () =>
            Belt.Array.forEach(
              controls,
              ({animX, animY}) => {
                SpringAnimation.stop(animX);
                SpringAnimation.stop(animY);
              },
            ),
        );
      },
      [|state|],
    );

    <div> {React.array(chatHeads)} </div>;
  };
};

module ChatHeadsExampleStarter = {
  type state =
    | StartMessage
    | ChatHeads
    | ImageGalleryHeads;
  // type action =
  //   | StartMessage
  //   | ChatHeads
  //   | ImageGalleryHeads;

  [@react.component]
  let make = () => {
    // let (state, actionIsState) =
    //   React.useReducer(
    //     (_, actionIsState) =>
    //       switch (actionIsState) {
    //       | StartMessage => StartMessage
    //       | ChatHeads => ChatHeads
    //       | ImageGalleryHeads => ImageGalleryHeads
    //       },
    //     StartMessage,
    //   );
    let (state, actionIsState) = React.useState(() => StartMessage);
    switch (state) {
    | StartMessage =>
      <div>
        <div>
          <button onClick={_e => actionIsState(_ => ChatHeads)}>
            {React.string("Start normal chatheads")}
          </button>
        </div>
        <button onClick={_e => actionIsState(_ => ImageGalleryHeads)}>
          {React.string("Start image gallery chatheads")}
        </button>
      </div>
    | ChatHeads => <ChatHeadsExample imageGallery=false />
    | ImageGalleryHeads => <ChatHeadsExample imageGallery=true />
    };
  };
};

module GalleryItem = {
  [@react.component]
  let make = (~title="Untitled", ~description="no description", ~children) => {
    let title = <div className="header"> {React.string(title)} </div>;
    let description =
      <div
        className="headerSubtext"
        dangerouslySetInnerHTML={"__html": description}
      />;
    let leftRight =
      <div className="galleryItemDemo leftRightContainer">
        <div className="right interactionContainer"> children </div>
      </div>;
    <div className="galleryItem"> title description leftRight </div>;
  };
};

module GalleryContainer = {
  let megaHeaderTitle = "Animating With Reason React Reducers";
  let megaHeaderSubtext = {|
    Examples With Animations.
  |};
  let megaHeaderSubtextDetails = {|
    Explore animation with ReasonReact and reducers.

  |};
  [@react.component]
  let make = (~children) => {
    <div
      className="mainGallery"
      style={ReactDOMRe.Style.make(~width="850px", ())}>
      <div key="megaHeader" className="megaHeader">
        {React.string(megaHeaderTitle)}
      </div>
      <div key="degaHeaderSubtext" className="megaHeaderSubtext">
        {React.string(megaHeaderSubtext)}
      </div>
      <div key="headerSubtext" className="megaHeaderSubtextDetails">
        {React.string(megaHeaderSubtextDetails)}
      </div>
      {React.array(Array.map(c => <div key={Key.gen()}> c </div>, children))}
    </div>;
  };
};

module ComponentGallery = {
  [@react.component]
  let make = () => {
    let globalStateExample =
      <GalleryItem title="Global State Example" description={||}>
        <Demo.GlobalStateExample />
      </GalleryItem>;
    let localStateExample =
      <GalleryItem title="Local State Example" description={||}>
        <Demo.LocalStateExample />
      </GalleryItem>;
    let simpleTextInput =
      <GalleryItem
        title="Simple Text Input" description={|Edit the text field|}>
        <Demo.TextInput onChange={text => Js.log2("onChange:", text)} />
      </GalleryItem>;
    let simpleSpring =
      <GalleryItem
        title="Simple Spring" description={|Click on target to toggle|}>
        <Demo.SimpleSpring />
      </GalleryItem>;
    let animatedTextInput =
      <GalleryItem
        title="Animated Text Input"
        description={|Edit text, or click on target to toggle animation|}>
        <Demo.AnimatedTextInput />
      </GalleryItem>;
    let animatedTextInputRemote =
      <GalleryItem
        title="Animated Text Input With Remote Actions"
        description={|Edit text, or click on target to toggle animation|}>
        <Demo.AnimatedTextInputRemote />
      </GalleryItem>;
    let callActionsOnGrandChild =
      <GalleryItem
        title="Call actions on grandchild directly" description={||}>
        <Demo.Parent />
      </GalleryItem>;
    let chatHeads =
      <GalleryItem title="Chat Heads" description={||}>
        <ChatHeadsExampleStarter />
      </GalleryItem>;
    let imageGallery =
      <GalleryItem
        title="Image Gallery"
        description={| Click on the image to transition to the next one. |}>
        <ImageGalleryAnimation />
      </GalleryItem>;
    let reducerAnimation =
      <GalleryItem title="Animation Based On Reducers" description={||}>
        <ReducerAnimationExample showAllButtons=false />
      </GalleryItem>;

    <GalleryContainer>
      [|
        globalStateExample,
        localStateExample,
        simpleTextInput,
        simpleSpring,
        animatedTextInput,
        animatedTextInputRemote,
        callActionsOnGrandChild,
        chatHeads,
        imageGallery,
        reducerAnimation,
      |]
    </GalleryContainer>;
  };
};
