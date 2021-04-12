'use strict';

var Page = require("./Page.bs.js");
var React = require("react");
var ReactDOMRe = require("reason-react/src/legacy/ReactDOMRe.bs.js");

ReactDOMRe.renderToElementWithId(React.createElement(Page.make, {
          message: "Hello!"
        }), "index");

/*  Not a pure module */
