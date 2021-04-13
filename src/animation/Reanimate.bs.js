'use strict';

var Demo = require("./Demo.bs.js");
var $$Array = require("bs-platform/lib/js/array.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Random = require("bs-platform/lib/js/random.js");
var Spring = require("./Spring.bs.js");
var Animation = require("./Animation.bs.js");
var Belt_List = require("bs-platform/lib/js/belt_List.js");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Caml_int32 = require("bs-platform/lib/js/caml_int32.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var RemoteAction = require("./RemoteAction.bs.js");
var SpringAnimation = require("./SpringAnimation.bs.js");

function pxI(i) {
  return String(i) + "px";
}

function pxF(v) {
  return String(v | 0) + "px";
}

var counter = {
  contents: 0
};

function gen(param) {
  counter.contents = counter.contents + 1 | 0;
  return String(counter.contents);
}

var Key = {
  counter: counter,
  gen: gen
};

var displayHeightString = String(200) + "px";

var sizes = [
  [
    500,
    350
  ],
  [
    800,
    600
  ],
  [
    800,
    400
  ],
  [
    700,
    500
  ],
  [
    200,
    650
  ],
  [
    600,
    600
  ]
];

var displayWidths = Belt_Array.map(sizes, (function (param) {
        return Caml_int32.div(Math.imul(param[0], 200), param[1]);
      }));

function getWidth(i) {
  return Caml_array.get(displayWidths, (i + 6 | 0) % 6);
}

function interpolate(width1, width2, phase) {
  var width1$1 = width1;
  var width2$1 = width2;
  var width = width1$1 * (1 - phase) + width2$1 * phase;
  var left1 = -(width1$1 * phase);
  var left2 = left1 + width1$1;
  return [
          String(width | 0) + "px",
          String(left1 | 0) + "px",
          String(left2 | 0) + "px"
        ];
}

function renderImage(left, i) {
  return React.createElement("img", {
              className: "photo-inner",
              style: {
                height: displayHeightString,
                left: left
              },
              src: "./" + (String((i + 6 | 0) % 6) + ".jpg")
            });
}

function render(phase, image1, image2) {
  var width1 = getWidth(image1);
  var width2 = getWidth(image2);
  var match = interpolate(width1, width2, phase);
  return React.createElement("div", undefined, React.createElement("div", {
                  className: "photo-outer",
                  style: {
                    height: displayHeightString,
                    width: match[0]
                  }
                }, renderImage(match[1], image1), renderImage(match[2], image2)));
}

var ImageTransition = {
  render: render,
  displayHeight: 200
};

function Reanimate$ImageGalleryAnimation(Props) {
  var initialImageOpt = Props.initialImage;
  var animateMountOpt = Props.animateMount;
  var initialImage = initialImageOpt !== undefined ? initialImageOpt : 0;
  var animateMount = animateMountOpt !== undefined ? animateMountOpt : true;
  var match = React.useReducer((function (state, action) {
          if (action) {
            return {
                    animation: state.animation,
                    cursor: action._0,
                    targetImage: state.targetImage
                  };
          } else {
            SpringAnimation.setFinalValue(state.targetImage, state.animation);
            return {
                    animation: state.animation,
                    cursor: state.cursor,
                    targetImage: state.targetImage + 1 | 0
                  };
          }
        }), {
        animation: SpringAnimation.create(initialImage),
        cursor: initialImage,
        targetImage: initialImage
      });
  var dispatch = match[1];
  var state = match[0];
  React.useEffect((function () {
          var arg = function (cursor) {
            return Curry._1(dispatch, /* SetCursor */{
                        _0: cursor
                      });
          };
          var arg$1 = function (param, param$1, param$2) {
            return Curry._5(SpringAnimation.setOnChange, param, param$1, 0.05, param$2, arg);
          };
          Curry._2(arg$1(undefined, undefined, undefined), undefined, state.animation);
          if (animateMount) {
            Curry._1(dispatch, /* Click */0);
          }
          return (function (param) {
                    return SpringAnimation.stop(state.animation);
                  });
        }), [state]);
  var cursor = state.cursor;
  var image = cursor | 0;
  var phase = cursor - image;
  return React.createElement("div", {
              onClick: (function (_e) {
                  return Curry._1(dispatch, /* Click */0);
                })
            }, render(phase, image, image + 1 | 0));
}

var ImageGalleryAnimation = {
  make: Reanimate$ImageGalleryAnimation
};

function Reanimate$AnimatedButton$Text(Props) {
  var text = Props.text;
  return React.createElement("button", undefined, text);
}

var $$Text = {
  make: Reanimate$AnimatedButton$Text
};

function Reanimate$AnimatedButton(Props) {
  var textOpt = Props.text;
  var rAction = Props.rAction;
  var animateMountOpt = Props.animateMount;
  var onClose = Props.onClose;
  var text = textOpt !== undefined ? textOpt : "Button";
  var animateMount = animateMountOpt !== undefined ? animateMountOpt : true;
  var match = React.useState(function () {
        return {
                animation: SpringAnimation.create(250),
                width: 250,
                size: /* Small */0,
                clickCount: 0,
                actionCount: 0
              };
      });
  var setState = match[1];
  var state = match[0];
  var match$1 = React.useReducer((function (param, action) {
          if (typeof action === "number") {
            switch (action) {
              case /* Click */0 :
                  Curry._1(setState, (function (param) {
                          return {
                                  animation: state.animation,
                                  width: state.width,
                                  size: state.size,
                                  clickCount: state.clickCount + 1 | 0,
                                  actionCount: state.actionCount + 1 | 0
                                };
                        }));
                  return state;
              case /* Reset */1 :
                  Curry._1(setState, (function (param) {
                          return {
                                  animation: state.animation,
                                  width: state.width,
                                  size: state.size,
                                  clickCount: 0,
                                  actionCount: state.actionCount + 1 | 0
                                };
                        }));
                  return state;
              case /* Unclick */2 :
                  Curry._1(setState, (function (param) {
                          return {
                                  animation: state.animation,
                                  width: state.width,
                                  size: state.size,
                                  clickCount: state.clickCount - 1 | 0,
                                  actionCount: state.actionCount + 1 | 0
                                };
                        }));
                  return state;
              case /* ToggleSize */3 :
                  Curry._1(setState, (function (param) {
                          return {
                                  animation: state.animation,
                                  width: state.width,
                                  size: state.size === /* Small */0 ? /* Large */1 : /* Small */0,
                                  clickCount: state.clickCount,
                                  actionCount: state.actionCount
                                };
                        }));
                  return state;
              case /* Close */4 :
                  var arg = Caml_option.some(onClose);
                  var arg$1 = function (w) {
                    return Curry._1(setState, (function (param) {
                                  return {
                                          animation: state.animation,
                                          width: w | 0,
                                          size: state.size,
                                          clickCount: state.clickCount,
                                          actionCount: state.actionCount
                                        };
                                }));
                  };
                  var arg$2 = 50;
                  var arg$3 = function (param) {
                    return Curry._6(SpringAnimation.setOnChange, param, 0.3, 10, arg, arg$1, arg$2);
                  };
                  Curry._1(arg$3(undefined), state.animation);
                  return state;
              
            }
          } else {
            var width = action._0;
            Curry._1(setState, (function (param) {
                    return {
                            animation: state.animation,
                            width: width,
                            size: state.size,
                            clickCount: state.clickCount,
                            actionCount: state.actionCount
                          };
                  }));
            return state;
          }
        }), state);
  var dispatch = match$1[1];
  React.useEffect((function () {
          RemoteAction.subscribe(dispatch, rAction);
          if (animateMount) {
            Curry._1(dispatch, /* ToggleSize */3);
          }
          return (function (param) {
                    return SpringAnimation.stop(state.animation);
                  });
        }), [state]);
  var buttonLabel = function (state) {
    return text + (" clicks:" + (String(state.clickCount) + (" actions:" + String(state.actionCount))));
  };
  return React.createElement("div", {
              className: "exampleButton large",
              style: {
                width: String(state.width) + "px"
              },
              onClick: (function (_e) {
                  return Curry._1(dispatch, /* Click */0);
                })
            }, React.createElement(Reanimate$AnimatedButton$Text, {
                  text: buttonLabel(state)
                }));
}

var AnimatedButton = {
  $$Text: $$Text,
  targetHeight: 30,
  closeWidth: 50,
  smallWidth: 250,
  largeWidth: 450,
  make: Reanimate$AnimatedButton
};

function Reanimate$AnimateHeight(Props) {
  var rAction = Props.rAction;
  var targetHeight = Props.targetHeight;
  var children = Props.children;
  var match = React.useState(function () {
        return {
                height: 0,
                animation: SpringAnimation.create(0)
              };
      });
  var setState = match[1];
  var state = match[0];
  var animate = function (finalValue, onStop) {
    var arg = Caml_option.some(onStop);
    var arg$1 = function (h) {
      return Curry._1(setState, (function (param) {
                    return {
                            height: h,
                            animation: state.animation
                          };
                  }));
    };
    var arg$2 = finalValue;
    var arg$3 = function (param, param$1) {
      return Curry._6(SpringAnimation.setOnChange, param, param$1, 10, arg, arg$1, arg$2);
    };
    return Curry._1(arg$3(undefined, undefined), state.animation);
  };
  var match$1 = React.useReducer((function (param, action) {
          switch (action.TAG | 0) {
            case /* Open */0 :
                animate(targetHeight, action._0);
                return state;
            case /* BeginClosing */1 :
                var onBeginClosing = action._0;
                if (onBeginClosing !== undefined) {
                  Curry._1(onBeginClosing, undefined);
                }
                animate(0, action._1);
                return state;
            case /* Close */2 :
                animate(0, action._0);
                return state;
            case /* Animate */3 :
                animate(action._0, action._1);
                return state;
            case /* Height */4 :
                var v = action._0;
                Curry._1(setState, (function (param) {
                        return {
                                height: v,
                                animation: state.animation
                              };
                      }));
                return state;
            
          }
        }), state);
  var dispatch = match$1[1];
  React.useEffect((function () {
          RemoteAction.subscribe(dispatch, rAction);
          return (function (param) {
                    return Curry._1(dispatch, {
                                TAG: /* Animate */3,
                                _0: targetHeight,
                                _1: undefined
                              });
                  });
        }), [state]);
  return React.createElement("div", {
              style: {
                height: String(state.height | 0) + "px",
                overflow: "hidden"
              }
            }, children);
}

var AnimateHeight = {
  make: Reanimate$AnimateHeight
};

function initial(param) {
  return {
          act: (function (_action) {
              
            }),
          randomAnimation: Animation.create(undefined),
          items: /* [] */0
        };
}

function getElements(param) {
  return Belt_List.toArray(Belt_List.mapReverse(param.items, (function (x) {
                    return x.element;
                  })));
}

function createButton(removeFromList, animateMount, number) {
  var rActionButton = RemoteAction.create(undefined);
  var rActionHeight = RemoteAction.create(undefined);
  var key = gen(undefined);
  var onClose = function (param) {
    return RemoteAction.send(rActionHeight, {
                TAG: /* Close */2,
                _0: (function (param) {
                    return Curry._1(removeFromList, rActionHeight);
                  })
              });
  };
  var tmp = {
    text: "Button#" + String(number),
    rAction: rActionButton,
    onClose: onClose,
    key: key
  };
  if (animateMount !== undefined) {
    tmp.animateMount = Caml_option.valFromOption(animateMount);
  }
  var element = React.createElement(Reanimate$AnimateHeight, {
        rAction: rActionHeight,
        targetHeight: 30,
        children: React.createElement(Reanimate$AnimatedButton, tmp),
        key: key
      });
  return {
          element: element,
          rActionButton: rActionButton,
          rActionHeight: rActionHeight,
          closing: false
        };
}

function createImage(animateMount, number) {
  var key = gen(undefined);
  var rActionButton = RemoteAction.create(undefined);
  var tmp = {
    initialImage: number,
    key: gen(undefined)
  };
  if (animateMount !== undefined) {
    tmp.animateMount = Caml_option.valFromOption(animateMount);
  }
  var imageGalleryAnimation = React.createElement(Reanimate$ImageGalleryAnimation, tmp);
  var rActionHeight = RemoteAction.create(undefined);
  var element = React.createElement(Reanimate$AnimateHeight, {
        rAction: rActionHeight,
        targetHeight: 200,
        children: imageGalleryAnimation,
        key: key
      });
  return {
          element: element,
          rActionButton: rActionButton,
          rActionHeight: rActionHeight,
          closing: false
        };
}

var State = {
  createButton: createButton,
  createImage: createImage,
  getElements: getElements,
  initial: initial
};

function make(Props) {
  var showAllButtons = Props.showAllButtons;
  var self = function (key) {
    return React.createElement(make, {
                showAllButtons: showAllButtons,
                key: key
              });
  };
  var match = React.useState(function () {
        return initial(undefined);
      });
  var setState = match[1];
  var state = match[0];
  var runAll = function (action) {
    return Belt_List.forEach(state.items, (function (param) {
                  return RemoteAction.send(param.rActionButton, action);
                }));
  };
  var match$1 = React.useReducer((function (param, action) {
          if (typeof action === "number") {
            switch (action) {
              case /* AddSelf */0 :
                  var key = gen(undefined);
                  var rActionButton = RemoteAction.create(undefined);
                  var rActionHeight = RemoteAction.create(undefined);
                  var element = React.createElement(Reanimate$AnimateHeight, {
                        rAction: rActionHeight,
                        targetHeight: 500,
                        children: self(key),
                        key: key
                      });
                  var item = {
                    element: element,
                    rActionButton: rActionButton,
                    rActionHeight: rActionHeight,
                    closing: false
                  };
                  return {
                          act: state.act,
                          randomAnimation: state.randomAnimation,
                          items: {
                            hd: item,
                            tl: state.items
                          }
                        };
              case /* DecrementAllButtons */1 :
                  runAll(/* Unclick */2);
                  return state;
              case /* IncrementAllButtons */2 :
                  runAll(/* Click */0);
                  return state;
              case /* CloseAllButtons */3 :
                  runAll(/* Close */4);
                  return state;
              case /* RemoveItem */4 :
                  var firstItemNotClosing = Belt_List.getBy(state.items, (function (item) {
                          return item.closing === false;
                        }));
                  if (firstItemNotClosing === undefined) {
                    return state;
                  }
                  var onBeginClosing = (function (param) {
                      firstItemNotClosing.closing = true;
                      
                    });
                  var onClose = (function (param) {
                      return Curry._1(state.act, {
                                  TAG: /* FilterOutItem */4,
                                  _0: firstItemNotClosing.rActionHeight
                                });
                    });
                  RemoteAction.send(firstItemNotClosing.rActionHeight, {
                        TAG: /* BeginClosing */1,
                        _0: onBeginClosing,
                        _1: onClose
                      });
                  return state;
              case /* ResetAllButtons */5 :
                  runAll(/* Reset */1);
                  return state;
              case /* ReverseItemsAnimation */6 :
                  var onStopClose = function (param) {
                    return Curry._1(state.act, {
                                TAG: /* ReverseWithSideEffects */6,
                                _0: (function (param) {
                                    return Curry._1(state.act, {
                                                TAG: /* OpenHeight */7,
                                                _0: undefined
                                              });
                                  })
                              });
                  };
                  Curry._1(state.act, {
                        TAG: /* CloseHeight */5,
                        _0: onStopClose
                      });
                  return state;
              case /* ToggleRandomAnimation */7 :
                  if (Animation.isActive(state.randomAnimation)) {
                    Animation.stop(state.randomAnimation);
                  } else {
                    Animation.start(state.randomAnimation);
                  }
                  return state;
              
            }
          } else {
            switch (action.TAG | 0) {
              case /* SetAct */0 :
                  return {
                          act: action._0,
                          randomAnimation: state.randomAnimation,
                          items: state.items
                        };
              case /* AddButton */1 :
                  var animateMount = action._0;
                  var removeFromList = function (rActionHeight) {
                    return Curry._1(state.act, {
                                TAG: /* FilterOutItem */4,
                                _0: rActionHeight
                              });
                  };
                  Curry._1(setState, (function (param) {
                          return {
                                  act: state.act,
                                  randomAnimation: state.randomAnimation,
                                  items: {
                                    hd: createButton(removeFromList, animateMount, Belt_List.length(state.items)),
                                    tl: state.items
                                  }
                                };
                        }));
                  return state;
              case /* AddButtonFirst */2 :
                  var items = state.items;
                  var act = state.act;
                  var removeFromList$1 = function (rActionHeight) {
                    return Curry._1(act, {
                                TAG: /* FilterOutItem */4,
                                _0: rActionHeight
                              });
                  };
                  return {
                          act: state.act,
                          randomAnimation: state.randomAnimation,
                          items: Pervasives.$at(items, {
                                hd: createButton(removeFromList$1, action._0, Belt_List.length(items)),
                                tl: /* [] */0
                              })
                        };
              case /* AddImage */3 :
                  return {
                          act: state.act,
                          randomAnimation: state.randomAnimation,
                          items: {
                            hd: createImage(action._0, Belt_List.length(state.items)),
                            tl: state.items
                          }
                        };
              case /* FilterOutItem */4 :
                  var rAction = action._0;
                  var filter = function (item) {
                    return item.rActionHeight !== rAction;
                  };
                  return {
                          act: state.act,
                          randomAnimation: state.randomAnimation,
                          items: Belt_List.keep(state.items, filter)
                        };
              case /* CloseHeight */5 :
                  var onStop = action._0;
                  var len = Belt_List.length(state.items);
                  var count = {
                    contents: len
                  };
                  var onClose$1 = function (param) {
                    count.contents = count.contents - 1 | 0;
                    if (count.contents === 0 && onStop !== undefined) {
                      return Curry._1(onStop, undefined);
                    }
                    
                  };
                  Belt_List.forEach(state.items, (function (item) {
                          return RemoteAction.send(item.rActionHeight, {
                                      TAG: /* Close */2,
                                      _0: onClose$1
                                    });
                        }));
                  return state;
              case /* ReverseWithSideEffects */6 :
                  Curry._1(action._0, undefined);
                  Curry._1(setState, (function (param) {
                          return {
                                  act: state.act,
                                  randomAnimation: state.randomAnimation,
                                  items: Belt_List.reverse(state.items)
                                };
                        }));
                  return state;
              case /* OpenHeight */7 :
                  var onStop$1 = action._0;
                  var len$1 = Belt_List.length(state.items);
                  var count$1 = {
                    contents: len$1
                  };
                  var onClose$2 = function (param) {
                    count$1.contents = count$1.contents - 1 | 0;
                    if (count$1.contents === 0 && onStop$1 !== undefined) {
                      return Curry._1(onStop$1, undefined);
                    }
                    
                  };
                  Belt_List.forEach(state.items, (function (item) {
                          return RemoteAction.send(item.rActionHeight, {
                                      TAG: /* Open */0,
                                      _0: onClose$2
                                    });
                        }));
                  return state;
              
            }
          }
        }), state);
  var dispatch = match$1[1];
  var state$1 = match$1[0];
  React.useEffect((function () {
          var callback = function () {
            var match = Random.$$int(6);
            var randomAction;
            switch (match) {
              case 0 :
                  randomAction = {
                    TAG: /* AddButton */1,
                    _0: true
                  };
                  break;
              case 1 :
                  randomAction = {
                    TAG: /* AddImage */3,
                    _0: true
                  };
                  break;
              case 2 :
              case 3 :
                  randomAction = /* RemoveItem */4;
                  break;
              case 4 :
                  randomAction = /* DecrementAllButtons */1;
                  break;
              case 5 :
                  randomAction = /* IncrementAllButtons */2;
                  break;
              default:
                throw {
                      RE_EXN_ID: "Assert_failure",
                      _1: [
                        "Reanimate.re",
                        624,
                        21
                      ],
                      Error: new Error()
                    };
            }
            Curry._1(dispatch, randomAction);
            return /* Continue */0;
          };
          Curry._1(dispatch, {
                TAG: /* SetAct */0,
                _0: dispatch
              });
          Animation.setCallback(state$1.randomAnimation, callback);
          return (function (param) {
                    return Animation.stop(state$1.randomAnimation);
                  });
        }), [state$1]);
  var button = function (repeatOpt, hideOpt, txt, action) {
    var repeat = repeatOpt !== undefined ? repeatOpt : 1;
    var hide = hideOpt !== undefined ? hideOpt : false;
    if (hide) {
      return null;
    } else {
      return React.createElement("div", {
                  className: "exampleButton large",
                  style: {
                    width: "220px"
                  },
                  onClick: (function (_e) {
                      for(var _for = 1; _for <= repeat; ++_for){
                        Curry._1(state$1.act, action);
                      }
                      
                    })
                }, txt);
    }
  };
  var hide = !showAllButtons;
  return React.createElement("div", {
              className: "componentBox"
            }, React.createElement("div", {
                  className: "componentColumn"
                }, "Control:", button(undefined, undefined, "Add Button", {
                      TAG: /* AddButton */1,
                      _0: true
                    }), button(undefined, undefined, "Add Image", {
                      TAG: /* AddImage */3,
                      _0: true
                    }), button(undefined, undefined, "Add Button On Top", {
                      TAG: /* AddButtonFirst */2,
                      _0: true
                    }), button(undefined, undefined, "Remove Item", /* RemoveItem */4), button(100, hide, "Add 100 Buttons On Top", {
                      TAG: /* AddButtonFirst */2,
                      _0: false
                    }), button(100, hide, "Add 100 Images", {
                      TAG: /* AddImage */3,
                      _0: false
                    }), button(undefined, undefined, "Click all the Buttons", /* IncrementAllButtons */2), button(undefined, hide, "Unclick all the Buttons", /* DecrementAllButtons */1), button(undefined, undefined, "Close all the Buttons", /* CloseAllButtons */3), button(10, hide, "Click all the Buttons 10 times", /* IncrementAllButtons */2), button(undefined, hide, "Reset all the Buttons' states", /* ResetAllButtons */5), button(undefined, undefined, "Reverse Items", /* ReverseItemsAnimation */6), button(undefined, undefined, "Random Animation " + (
                      Animation.isActive(state$1.randomAnimation) ? "ON" : "OFF"
                    ), /* ToggleRandomAnimation */7), button(undefined, undefined, "Add Self", /* AddSelf */0)), React.createElement("div", {
                  className: "componentColumn",
                  style: {
                    width: "500px"
                  }
                }, React.createElement("div", undefined, "Items:" + String(Belt_List.length(state$1.items))), getElements(state$1)));
}

var ReducerAnimationExample = {
  State: State,
  make: make
};

function Reanimate$ChatHead(Props) {
  var rAction = Props.rAction;
  var headNum = Props.headNum;
  var imageGallery = Props.imageGallery;
  var match = React.useReducer((function (state, action) {
          if (action.TAG === /* MoveX */0) {
            return {
                    x: action._0,
                    y: state.y
                  };
          } else {
            return {
                    x: state.x,
                    y: action._0
                  };
          }
        }), {
        x: 0,
        y: 0
      });
  var dispatch = match[1];
  var state = match[0];
  React.useEffect((function () {
          RemoteAction.subscribe(dispatch, rAction);
          
        }), []);
  var left = String(state.x - 25 | 0) + "px";
  var top = String(state.y - 25 | 0) + "px";
  if (imageGallery) {
    return React.createElement("div", {
                className: "chat-head-image-gallery",
                style: {
                  left: left,
                  top: top,
                  zIndex: String(-headNum | 0)
                }
              }, React.createElement(Reanimate$ImageGalleryAnimation, {
                    initialImage: headNum
                  }));
  } else {
    return React.createElement("div", {
                className: "chat-head chat-head-" + String(headNum % 6),
                style: {
                  left: left,
                  top: top,
                  zIndex: String(-headNum | 0)
                }
              });
  }
}

var ChatHead = {
  make: Reanimate$ChatHead
};

function createControl(param) {
  return {
          rAction: RemoteAction.create(undefined),
          animX: SpringAnimation.create(0),
          animY: SpringAnimation.create(0)
        };
}

function Reanimate$ChatHeadsExample(Props) {
  var imageGallery = Props.imageGallery;
  var controls = Belt_Array.makeBy(6, (function (param) {
          return createControl(undefined);
        }));
  var chatHeads = Belt_Array.makeBy(6, (function (i) {
          return React.createElement(Reanimate$ChatHead, {
                      rAction: Caml_array.get(controls, i).rAction,
                      headNum: i,
                      imageGallery: imageGallery,
                      key: gen(undefined)
                    });
        }));
  var match = React.useState(function () {
        return {
                controls: controls,
                chatHeads: chatHeads
              };
      });
  React.useEffect((function () {
          Belt_Array.forEachWithIndex(controls, (function (i, param) {
                  var setOnChange = function (isX, afterChange) {
                    var control = Caml_array.get(controls, i);
                    var animation = isX ? control.animX : control.animY;
                    var arg = function (v) {
                      RemoteAction.send(control.rAction, isX ? ({
                                TAG: /* MoveX */0,
                                _0: v
                              }) : ({
                                TAG: /* MoveY */1,
                                _0: v
                              }));
                      return Curry._1(afterChange, v);
                    };
                    var arg$1 = function (param, param$1) {
                      return Curry._5(SpringAnimation.setOnChange, Spring.gentle, 2, param, param$1, arg);
                    };
                    return Curry._2(arg$1(undefined, undefined), undefined, animation);
                  };
                  var isLastHead = i === 5;
                  var afterChangeX = function (x) {
                    if (isLastHead) {
                      return ;
                    } else {
                      return SpringAnimation.setFinalValue(x, Caml_array.get(controls, i + 1 | 0).animX);
                    }
                  };
                  var afterChangeY = function (y) {
                    if (isLastHead) {
                      return ;
                    } else {
                      return SpringAnimation.setFinalValue(y, Caml_array.get(controls, i + 1 | 0).animY);
                    }
                  };
                  setOnChange(true, afterChangeX);
                  return setOnChange(false, afterChangeY);
                }));
          var onMove = function (e) {
            var x = e.pageX;
            var y = e.pageY;
            SpringAnimation.setFinalValue(x, Caml_array.get(controls, 0).animX);
            return SpringAnimation.setFinalValue(y, Caml_array.get(controls, 0).animY);
          };
          window.addEventListener("mousemove", onMove);
          window.addEventListener("touchmove", onMove);
          return (function (param) {
                    return Belt_Array.forEach(controls, (function (param) {
                                  SpringAnimation.stop(param.animX);
                                  return SpringAnimation.stop(param.animY);
                                }));
                  });
        }), [match[0]]);
  return React.createElement("div", undefined, chatHeads);
}

var ChatHeadsExample = {
  numHeads: 6,
  createControl: createControl,
  make: Reanimate$ChatHeadsExample
};

function Reanimate$ChatHeadsExampleStarter(Props) {
  var match = React.useState(function () {
        return /* StartMessage */0;
      });
  var actionIsState = match[1];
  switch (match[0]) {
    case /* StartMessage */0 :
        return React.createElement("div", undefined, React.createElement("div", undefined, React.createElement("button", {
                            onClick: (function (_e) {
                                return Curry._1(actionIsState, (function (param) {
                                              return /* ChatHeads */1;
                                            }));
                              })
                          }, "Start normal chatheads")), React.createElement("button", {
                        onClick: (function (_e) {
                            return Curry._1(actionIsState, (function (param) {
                                          return /* ImageGalleryHeads */2;
                                        }));
                          })
                      }, "Start image gallery chatheads"));
    case /* ChatHeads */1 :
        return React.createElement(Reanimate$ChatHeadsExample, {
                    imageGallery: false
                  });
    case /* ImageGalleryHeads */2 :
        return React.createElement(Reanimate$ChatHeadsExample, {
                    imageGallery: true
                  });
    
  }
}

var ChatHeadsExampleStarter = {
  make: Reanimate$ChatHeadsExampleStarter
};

function Reanimate$GalleryItem(Props) {
  var titleOpt = Props.title;
  var descriptionOpt = Props.description;
  var children = Props.children;
  var title = titleOpt !== undefined ? titleOpt : "Untitled";
  var description = descriptionOpt !== undefined ? descriptionOpt : "no description";
  var title$1 = React.createElement("div", {
        className: "header"
      }, title);
  var description$1 = React.createElement("div", {
        className: "headerSubtext",
        dangerouslySetInnerHTML: {
          __html: description
        }
      });
  var leftRight = React.createElement("div", {
        className: "galleryItemDemo leftRightContainer"
      }, React.createElement("div", {
            className: "right interactionContainer"
          }, children));
  return React.createElement("div", {
              className: "galleryItem"
            }, title$1, description$1, leftRight);
}

var GalleryItem = {
  make: Reanimate$GalleryItem
};

var megaHeaderTitle = "Animating With Reason React Reducers";

var megaHeaderSubtext = "\n    Examples With Animations.\n  ";

var megaHeaderSubtextDetails = "\n    Explore animation with ReasonReact and reducers.\n\n  ";

function Reanimate$GalleryContainer(Props) {
  var children = Props.children;
  return React.createElement("div", {
              className: "mainGallery",
              style: {
                width: "850px"
              }
            }, React.createElement("div", {
                  key: "megaHeader",
                  className: "megaHeader"
                }, megaHeaderTitle), React.createElement("div", {
                  key: "degaHeaderSubtext",
                  className: "megaHeaderSubtext"
                }, megaHeaderSubtext), React.createElement("div", {
                  key: "headerSubtext",
                  className: "megaHeaderSubtextDetails"
                }, megaHeaderSubtextDetails), $$Array.map((function (c) {
                    return React.createElement("div", {
                                key: gen(undefined)
                              }, c);
                  }), children));
}

var GalleryContainer = {
  megaHeaderTitle: megaHeaderTitle,
  megaHeaderSubtext: megaHeaderSubtext,
  megaHeaderSubtextDetails: megaHeaderSubtextDetails,
  make: Reanimate$GalleryContainer
};

function Reanimate$ComponentGallery(Props) {
  var globalStateExample = React.createElement(Reanimate$GalleryItem, {
        title: "Global State Example",
        description: "",
        children: React.createElement(Demo.GlobalStateExample.make, {})
      });
  var localStateExample = React.createElement(Reanimate$GalleryItem, {
        title: "Local State Example",
        description: "",
        children: React.createElement(Demo.LocalStateExample.make, {})
      });
  var simpleTextInput = React.createElement(Reanimate$GalleryItem, {
        title: "Simple Text Input",
        description: "Edit the text field",
        children: React.createElement(Demo.TextInput.make, {
              onChange: (function (text) {
                  console.log("onChange:", text);
                  
                })
            })
      });
  var simpleSpring = React.createElement(Reanimate$GalleryItem, {
        title: "Simple Spring",
        description: "Click on target to toggle",
        children: React.createElement(Demo.SimpleSpring.make, {})
      });
  var animatedTextInput = React.createElement(Reanimate$GalleryItem, {
        title: "Animated Text Input",
        description: "Edit text, or click on target to toggle animation",
        children: React.createElement(Demo.AnimatedTextInput.make, {})
      });
  var animatedTextInputRemote = React.createElement(Reanimate$GalleryItem, {
        title: "Animated Text Input With Remote Actions",
        description: "Edit text, or click on target to toggle animation",
        children: React.createElement(Demo.AnimatedTextInputRemote.make, {})
      });
  var callActionsOnGrandChild = React.createElement(Reanimate$GalleryItem, {
        title: "Call actions on grandchild directly",
        description: "",
        children: React.createElement(Demo.Parent.make, {})
      });
  var chatHeads = React.createElement(Reanimate$GalleryItem, {
        title: "Chat Heads",
        description: "",
        children: React.createElement(Reanimate$ChatHeadsExampleStarter, {})
      });
  var imageGallery = React.createElement(Reanimate$GalleryItem, {
        title: "Image Gallery",
        description: " Click on the image to transition to the next one. ",
        children: React.createElement(Reanimate$ImageGalleryAnimation, {})
      });
  var reducerAnimation = React.createElement(Reanimate$GalleryItem, {
        title: "Animation Based On Reducers",
        description: "",
        children: React.createElement(make, {
              showAllButtons: false
            })
      });
  return React.createElement(Reanimate$GalleryContainer, {
              children: [
                globalStateExample,
                localStateExample,
                simpleTextInput,
                simpleSpring,
                animatedTextInput,
                animatedTextInputRemote,
                callActionsOnGrandChild,
                chatHeads,
                imageGallery,
                reducerAnimation
              ]
            });
}

var ComponentGallery = {
  make: Reanimate$ComponentGallery
};

exports.pxI = pxI;
exports.pxF = pxF;
exports.Key = Key;
exports.ImageTransition = ImageTransition;
exports.ImageGalleryAnimation = ImageGalleryAnimation;
exports.AnimatedButton = AnimatedButton;
exports.AnimateHeight = AnimateHeight;
exports.ReducerAnimationExample = ReducerAnimationExample;
exports.ChatHead = ChatHead;
exports.ChatHeadsExample = ChatHeadsExample;
exports.ChatHeadsExampleStarter = ChatHeadsExampleStarter;
exports.GalleryItem = GalleryItem;
exports.GalleryContainer = GalleryContainer;
exports.ComponentGallery = ComponentGallery;
/* displayHeightString Not a pure module */
