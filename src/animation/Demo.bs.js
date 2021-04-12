'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Printf = require("bs-platform/lib/js/printf.js");
var $$String = require("bs-platform/lib/js/string.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var RemoteAction = require("./RemoteAction.bs.js");
var SpringAnimation = require("./SpringAnimation.bs.js");

var initial = {
  count1: 0,
  count2: 0,
  toggle: false
};

var GlobalState = {
  initial: initial
};

function Demo$Counter1(Props) {
  var state = Props.state;
  var update = Props.update;
  return React.createElement("div", undefined, React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(update, {
                                  count1: state.count1 + 1 | 0,
                                  count2: state.count2,
                                  toggle: state.toggle
                                });
                    })
                }, "+"), React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(update, {
                                  count1: state.count1 - 1 | 0,
                                  count2: state.count2,
                                  toggle: state.toggle
                                });
                    })
                }, "-"), " counter:" + String(state.count1));
}

var Counter1 = {
  make: Demo$Counter1
};

function Demo$Counter2(Props) {
  var state = Props.state;
  var update = Props.update;
  return React.createElement("div", undefined, React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(update, {
                                  count1: state.count1,
                                  count2: state.count2 + 1 | 0,
                                  toggle: state.toggle
                                });
                    })
                }, "+"), React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(update, {
                                  count1: state.count1,
                                  count2: state.count2 - 1 | 0,
                                  toggle: state.toggle
                                });
                    })
                }, "-"), " counter:" + String(state.count2));
}

var Counter2 = {
  make: Demo$Counter2
};

function Demo$Toggle(Props) {
  var state = Props.state;
  var update = Props.update;
  return React.createElement("div", undefined, React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(update, {
                                  count1: state.count1,
                                  count2: state.count2,
                                  toggle: !state.toggle
                                });
                    })
                }, "Toggle"), "toggle:" + Pervasives.string_of_bool(state.toggle));
}

var Toggle = {
  make: Demo$Toggle
};

function Demo$GlobalStateExample(Props) {
  var match = React.useReducer((function (param, action) {
          return action._0;
        }), initial);
  var dispatch = match[1];
  var state = match[0];
  var update = function (state) {
    return Curry._1(dispatch, /* Update */{
                _0: state
              });
  };
  return React.createElement("div", undefined, React.createElement(Demo$Counter1, {
                  state: state,
                  update: update
                }), React.createElement(Demo$Counter2, {
                  state: state,
                  update: update
                }), React.createElement(Demo$Counter2, {
                  state: state,
                  update: update
                }), React.createElement(Demo$Toggle, {
                  state: state,
                  update: update
                }));
}

var GlobalStateExample = {
  make: Demo$GlobalStateExample
};

function Demo$LocalCounter(Props) {
  var match = React.useReducer((function (state, action) {
          if (action) {
            return state - 1 | 0;
          } else {
            return state + 1 | 0;
          }
        }), 0);
  var dispatch = match[1];
  return React.createElement("div", undefined, React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(dispatch, /* Incr */0);
                    })
                }, "+"), React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(dispatch, /* Decr */1);
                    })
                }, "-"), " counter:" + String(match[0]));
}

var LocalCounter = {
  make: Demo$LocalCounter
};

function Demo$LocalToggle(Props) {
  var match = React.useReducer((function (state, action) {
          return !state;
        }), false);
  var dispatch = match[1];
  return React.createElement("div", undefined, React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(dispatch, /* Toggle */0);
                    })
                }, "Toggle"), " toggle:" + Pervasives.string_of_bool(match[0]));
}

var LocalToggle = {
  make: Demo$LocalToggle
};

function Demo$LocalStateExample(Props) {
  return React.createElement("div", undefined, React.createElement(Demo$LocalCounter, {}), React.createElement(Demo$LocalCounter, {}), React.createElement(Demo$LocalCounter, {}), React.createElement(Demo$LocalToggle, {}));
}

var LocalStateExample = {
  make: Demo$LocalStateExample
};

function textOfEvent(e) {
  return Curry._1(e.target.value, e);
}

function Demo$TextInput(Props) {
  var onChangeOpt = Props.onChange;
  var showTextOpt = Props.showText;
  var initialOpt = Props.initial;
  var onChange = onChangeOpt !== undefined ? onChangeOpt : (function (param) {
        
      });
  var showText = showTextOpt !== undefined ? showTextOpt : (function (x) {
        return x;
      });
  var initial = initialOpt !== undefined ? initialOpt : "";
  var match = React.useReducer((function (param, action) {
          return action._0;
        }), initial);
  var dispatch = match[1];
  return React.createElement("input", {
              value: Curry._1(showText, match[0]),
              onChange: (function ($$event) {
                  var text = Curry._1($$event.target.value, $$event);
                  Curry._1(dispatch, /* Text */{
                        _0: text
                      });
                  return Curry._1(onChange, text);
                })
            });
}

var TextInput = {
  textOfEvent: textOfEvent,
  make: Demo$TextInput
};

function Demo$Spring(Props) {
  var renderValue = Props.renderValue;
  var match = React.useReducer((function (state, action) {
          if (action) {
            return {
                    animation: state.animation,
                    value: action._0,
                    target: state.target
                  };
          }
          var target = state.target === 0.0 ? 1.0 : 0.0;
          SpringAnimation.setFinalValue(target, state.animation);
          return {
                  animation: state.animation,
                  value: state.value,
                  target: target
                };
        }), {
        animation: SpringAnimation.create(0.0),
        value: 0.0,
        target: 1.0
      });
  var dispatch = match[1];
  var state = match[0];
  React.useEffect((function () {
          var __x = state.animation;
          SpringAnimation.setOnChange(undefined, undefined, undefined, undefined, (function (value) {
                  return Curry._1(dispatch, /* Value */{
                              _0: value
                            });
                }), state.target, __x);
          return (function (param) {
                    return SpringAnimation.stop(state.animation);
                  });
        }), []);
  return React.createElement("div", undefined, React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(dispatch, /* Click */0);
                    })
                }, "target: " + state.target.toString()), React.createElement("div", undefined, Curry._1(renderValue, state.value)));
}

var Spring = {
  make: Demo$Spring
};

function renderValue(value) {
  return Curry._1(Printf.sprintf(/* Format */{
                  _0: {
                    TAG: /* String_literal */11,
                    _0: "value: ",
                    _1: {
                      TAG: /* Float */8,
                      _0: /* Float_f */0,
                      _1: /* No_padding */0,
                      _2: /* Lit_precision */{
                        _0: 3
                      },
                      _3: /* End_of_format */0
                    }
                  },
                  _1: "value: %.3f"
                }), value);
}

function Demo$SimpleSpring(Props) {
  return React.createElement(Demo$Spring, {
              renderValue: renderValue
            });
}

var SimpleSpring = {
  renderValue: renderValue,
  make: Demo$SimpleSpring
};

function shrinkText(text, value) {
  if (value >= 1.0) {
    return text;
  }
  var len = Math.round(value * text.length);
  return $$String.sub(text, 0, len | 0);
}

function renderValue$1(value) {
  return React.createElement(Demo$TextInput, {
              showText: (function (text) {
                  return shrinkText(text, value);
                }),
              initial: "edit this or click target"
            });
}

function Demo$AnimatedTextInput(Props) {
  return React.createElement(Demo$Spring, {
              renderValue: renderValue$1
            });
}

var AnimatedTextInput = {
  shrinkText: shrinkText,
  renderValue: renderValue$1,
  make: Demo$AnimatedTextInput
};

function textOfEvent$1(e) {
  return Curry._1(e.target.value, e);
}

function Demo$TextInputRemote(Props) {
  var remoteAction = Props.remoteAction;
  var onChangeOpt = Props.onChange;
  var showTextOpt = Props.showText;
  var initialOpt = Props.initial;
  var onChange = onChangeOpt !== undefined ? onChangeOpt : (function (param) {
        
      });
  var showText = showTextOpt !== undefined ? showTextOpt : (function (x) {
        return x;
      });
  var initial = initialOpt !== undefined ? initialOpt : "";
  var match = React.useReducer((function (param, action) {
          if (action) {
            return action._0;
          } else {
            return "the text has been reset";
          }
        }), initial);
  var dispatch = match[1];
  React.useEffect((function () {
          var token = RemoteAction.subscribe(dispatch, remoteAction);
          return (function (param) {
                    if (token !== undefined) {
                      return RemoteAction.unsubscribe(Caml_option.valFromOption(token));
                    }
                    
                  });
        }), []);
  return React.createElement("input", {
              value: Curry._1(showText, match[0]),
              onChange: (function ($$event) {
                  var text = Curry._1($$event.target.value, $$event);
                  Curry._1(dispatch, /* Text */{
                        _0: text
                      });
                  return Curry._1(onChange, text);
                })
            });
}

var TextInputRemote = {
  textOfEvent: textOfEvent$1,
  make: Demo$TextInputRemote
};

function shrinkText$1(text, value) {
  if (value >= 1.0) {
    return text;
  }
  var len = Math.round(value * text.length);
  return $$String.sub(text, 0, len | 0);
}

var remoteAction = RemoteAction.create(undefined);

function renderValue$2(value) {
  return React.createElement(Demo$TextInputRemote, {
              remoteAction: remoteAction,
              showText: (function (text) {
                  return shrinkText$1(text, value);
                }),
              initial: "edit this or click target"
            });
}

function Demo$AnimatedTextInputRemote(Props) {
  return React.createElement("div", undefined, React.createElement("button", {
                  onClick: (function (param) {
                      return RemoteAction.send(remoteAction, /* Reset */0);
                    })
                }, "reset text"), React.createElement("div", undefined, "-----"), React.createElement(Demo$Spring, {
                  renderValue: renderValue$2
                }));
}

var AnimatedTextInputRemote = {
  shrinkText: shrinkText$1,
  remoteAction: remoteAction,
  renderValue: renderValue$2,
  make: Demo$AnimatedTextInputRemote
};

function Demo$GrandChild(Props) {
  var remoteAction = Props.remoteAction;
  var match = React.useReducer((function (state, action) {
          if (action) {
            return state - 1 | 0;
          } else {
            return state + 1 | 0;
          }
        }), 0);
  var dispatch = match[1];
  React.useEffect((function () {
          var token = RemoteAction.subscribe(dispatch, remoteAction);
          return (function (param) {
                    if (token !== undefined) {
                      return RemoteAction.unsubscribe(Caml_option.valFromOption(token));
                    }
                    
                  });
        }), []);
  return React.createElement("div", undefined, "in grandchild state: " + String(match[0]));
}

var GrandChild = {
  make: Demo$GrandChild
};

function Demo$Child(Props) {
  var remoteAction = Props.remoteAction;
  return React.createElement("div", undefined, "in child", React.createElement(Demo$GrandChild, {
                  remoteAction: remoteAction
                }));
}

var Child = {
  make: Demo$Child
};

function Demo$Parent(Props) {
  var state = RemoteAction.create(undefined);
  return React.createElement("div", undefined, React.createElement("button", {
                  onClick: (function (param) {
                      return RemoteAction.send(state, /* Incr */0);
                    })
                }, "in parent"), React.createElement(Demo$Child, {
                  remoteAction: state
                }));
}

var Parent = {
  make: Demo$Parent
};

exports.GlobalState = GlobalState;
exports.Counter1 = Counter1;
exports.Counter2 = Counter2;
exports.Toggle = Toggle;
exports.GlobalStateExample = GlobalStateExample;
exports.LocalCounter = LocalCounter;
exports.LocalToggle = LocalToggle;
exports.LocalStateExample = LocalStateExample;
exports.TextInput = TextInput;
exports.Spring = Spring;
exports.SimpleSpring = SimpleSpring;
exports.AnimatedTextInput = AnimatedTextInput;
exports.TextInputRemote = TextInputRemote;
exports.AnimatedTextInputRemote = AnimatedTextInputRemote;
exports.GrandChild = GrandChild;
exports.Child = Child;
exports.Parent = Parent;
/* remoteAction Not a pure module */
