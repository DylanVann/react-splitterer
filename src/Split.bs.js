// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Block from "bs-platform/lib/es6/block.js";
import * as Curry from "bs-platform/lib/es6/curry.js";
import * as React from "react";
import * as Utils$ReactHooksTemplate from "./Utils.bs.js";

var initialState = /* record */[
  /* dragging */false,
  /* initialMousePosition */0,
  /* initialSize */0,
  /* size */0,
  /* measured */false
];

var $$document = document;

function callOnDrag(onDrag, size) {
  if (onDrag !== undefined) {
    return Curry._1(onDrag, size);
  } else {
    return /* () */0;
  }
}

function Split(Props) {
  var size = Props.size;
  var minSize = Props.minSize;
  var maxSize = Props.maxSize;
  var children = Props.children;
  var onDragStart = Props.onDragStart;
  var onDrag = Props.onDrag;
  var onDragEnd = Props.onDragEnd;
  var match = Props.direction;
  var direction = match !== undefined ? match : "horizontal";
  var match$1 = Props.className;
  var className = match$1 !== undefined ? match$1 : "splt";
  var match$2 = Props.classNameDragging;
  var classNameDragging = match$2 !== undefined ? match$2 : "splt--d";
  var match$3 = Props.classNameVertical;
  var classNameVertical = match$3 !== undefined ? match$3 : "splt--v";
  var match$4 = Props.classNameHorizontal;
  var classNameHorizontal = match$4 !== undefined ? match$4 : "splt--h";
  var paneRef = React.useRef(null);
  var match$5 = React.useReducer((function (state, action) {
          if (typeof action === "number") {
            return /* record */[
                    /* dragging */false,
                    /* initialMousePosition */state[/* initialMousePosition */1],
                    /* initialSize */state[/* initialSize */2],
                    /* size */state[/* size */3],
                    /* measured */state[/* measured */4]
                  ];
          } else if (action.tag) {
            return /* record */[
                    /* dragging */state[/* dragging */0],
                    /* initialMousePosition */state[/* initialMousePosition */1],
                    /* initialSize */state[/* initialSize */2],
                    /* size */Utils$ReactHooksTemplate.clamp(minSize, maxSize, (state[/* initialSize */2] + state[/* initialMousePosition */1] | 0) - action[0] | 0),
                    /* measured */state[/* measured */4]
                  ];
          } else {
            var optionCurrent = paneRef.current;
            var initialSize;
            if (optionCurrent == null) {
              initialSize = 0;
            } else {
              var match = direction === "horizontal";
              initialSize = match ? optionCurrent.clientWidth : optionCurrent.clientHeight;
            }
            return /* record */[
                    /* dragging */true,
                    /* initialMousePosition */action[0],
                    /* initialSize */initialSize,
                    /* size */initialSize,
                    /* measured */true
                  ];
          }
        }), initialState);
  var dispatch = match$5[1];
  var state = match$5[0];
  React.useEffect((function (param) {
          if (state[/* dragging */0]) {
            var onUp = function (_e) {
              callOnDrag(onDragEnd, state[/* size */3]);
              return Curry._1(dispatch, /* MouseUp */0);
            };
            var onMove = function (e) {
              callOnDrag(onDrag, state[/* size */3]);
              Utils$ReactHooksTemplate.clearSelection(/* () */0);
              var match = direction === "horizontal";
              var position = match ? e.pageX : e.pageY;
              return Curry._1(dispatch, /* MouseMove */Block.__(1, [position]));
            };
            $$document.addEventListener("mousemove", onMove);
            $$document.addEventListener("mouseup", onUp);
            var onTouchMove = (e => onMove(e.touches[0]) );
            var onTouchEnd = (e => onUp(e.touches[0]) );
            $$document.addEventListener("touchmove", onTouchMove);
            $$document.addEventListener("touchend", onTouchEnd);
            return (function (param) {
                      $$document.removeEventListener("mousemove", onMove);
                      $$document.removeEventListener("mouseup", onUp);
                      $$document.removeEventListener("touchmove", onTouchMove);
                      $$document.removeEventListener("touchend", onTouchEnd);
                      return /* () */0;
                    });
          }
          
        }), /* tuple */[
        state[/* dragging */0],
        dispatch,
        state[/* size */3]
      ]);
  var onMouseDown = React.useCallback((function (e) {
          callOnDrag(onDragStart, state[/* size */3]);
          Utils$ReactHooksTemplate.clearSelection(/* () */0);
          var match = direction === "horizontal";
          var position = match ? e.pageX : e.pageY;
          return Curry._1(dispatch, /* MouseDown */Block.__(0, [position]));
        }), /* tuple */[
        dispatch,
        state[/* size */3]
      ]);
  var onTouchStart = (e => onMouseDown(e.touches[0]) );
  var finalSize = size !== undefined ? String(size) + "px" : String(state[/* size */3]) + "px";
  var match$6 = direction === "horizontal";
  var baseClassName = match$6 ? className + (" " + classNameHorizontal) : className + (" " + classNameVertical);
  var match$7 = state[/* dragging */0];
  var joinedClassNames = match$7 ? baseClassName + (" " + classNameDragging) : baseClassName;
  var sizeStyle = state[/* measured */4] ? (
      direction === "horizontal" ? ({
            width: finalSize,
            flex: "unset"
          }) : ({
            height: finalSize,
            flex: "unset"
          })
    ) : ({
        flex: "1"
      });
  return React.createElement("div", {
              className: joinedClassNames
            }, React.createElement("div", undefined, React.createElement("div", undefined, children[0])), React.createElement("div", {
                  onMouseDown: onMouseDown,
                  onTouchStart: onTouchStart
                }), React.createElement("div", {
                  ref: paneRef,
                  style: sizeStyle
                }, React.createElement("div", undefined, children[1])));
}

var make = Split;

export {
  initialState ,
  $$document ,
  callOnDrag ,
  make ,
  
}
/* document Not a pure module */
