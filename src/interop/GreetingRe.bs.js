'use strict';

var React = require("react");
var MyBannerRe = require("./MyBannerRe.bs.js");

function GreetingRe(Props) {
  var message = Props.message;
  var extraGreeting = Props.extraGreeting;
  var greeting = extraGreeting !== undefined ? extraGreeting : "How are you?";
  return React.createElement("div", undefined, React.createElement(MyBannerRe.make, {
                  show: true,
                  message: message + (" " + greeting)
                }));
}

var make = GreetingRe;

exports.make = make;
/* react Not a pure module */
