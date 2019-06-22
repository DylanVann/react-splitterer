open Webapi.Dom.MouseEvent;
open Webapi.Dom.EventTarget;

type state = {
  dragging: bool,
  initialMousePosition: int,
  initialSize: int,
  size: int,
  documentCursor: option(string),
};

let initialState: state = {
  dragging: false,
  initialMousePosition: 0,
  initialSize: 0,
  size: 100,
  documentCursor: None,
};

type action =
  | MouseDown(int)
  | MouseUp
  | MouseMove(int);

let document = Webapi.Dom.Document.asEventTarget(Webapi.Dom.document);

type callback = int => unit;

let callOnDrag = (onDrag, size) =>
  switch (onDrag) {
  | Some(onDrag) => onDrag(size)
  | None => ()
  };

[@react.component]
[@genType]
let make =
    (
      ~size: option(int)=?,
      ~minSize: option(int)=?,
      ~maxSize: option(int)=?,
      ~children: (ReasonReact.reactElement, ReasonReact.reactElement),
      ~onDragStart: option(callback)=?,
      ~onDrag: option(callback)=?,
      ~onDragEnd: option(callback)=?,
      ~direction="horizontal",
      ~className="splitterer",
      ~classNameDragging="splitterer--dragging",
      ~classNameVertical="splitterer--vertical",
      ~classNameHorizontal="splitterer--horizontal",
    ) => {
  let paneRef: React.Ref.t(Js.Nullable.t(Webapi.Dom.Element.t)) =
    React.useRef(Js.Nullable.null);
  let (state, dispatch) =
    React.useReducer(
      (state, action) =>
        switch (action) {
        | MouseDown(x) => {
            ...state,
            dragging: true,
            initialMousePosition: x,
            initialSize: {
              let optionCurrent =
                Js.Nullable.toOption(React.Ref.current(paneRef));
              switch (optionCurrent) {
              | Some(current) =>
                direction == "horizontal"
                  ? Webapi.Dom.Element.clientWidth(current)
                  : Webapi.Dom.Element.clientHeight(current)
              | None => 0
              };
            },
          }
        | MouseMove(x) => {
            ...state,
            size:
              Utils.clamp(
                minSize,
                maxSize,
                state.initialSize + state.initialMousePosition - x,
              ),
          }
        | MouseUp => {...state, dragging: false}
        },
      initialState,
    );

  React.useEffect4(
    () =>
      if (state.dragging) {
        let onUp = _e => {
          callOnDrag(onDragEnd, state.size);
          dispatch(MouseUp);
        };
        let onMove = (e: Dom.mouseEvent) => {
          callOnDrag(onDrag, state.size);
          Utils.clearSelection();
          let position = direction == "horizontal" ? pageX(e) : pageY(e);
          dispatch(MouseMove(position));
        };
        addMouseMoveEventListener(onMove, document);
        addMouseUpEventListener(onUp, document);
        Some(
          () => {
            removeMouseMoveEventListener(onMove, document);
            removeMouseUpEventListener(onUp, document);
          },
        );
      } else {
        None;
      },
    (state.dragging, state.documentCursor, dispatch, state.size),
  );

  let onMouseDown =
    React.useCallback2(
      e => {
        callOnDrag(onDragStart, state.size);
        Utils.clearSelection();
        let position =
          direction == "horizontal"
            ? ReactEvent.Mouse.pageX(e) : ReactEvent.Mouse.pageY(e);
        dispatch(MouseDown(position));
      },
      (dispatch, state.size),
    );

  let finalSize =
    switch (size) {
    | Some(size) => string_of_int(size) ++ "px"
    | None => string_of_int(state.size) ++ "px"
    };

  let refForJsx = ReactDOMRe.Ref.domRef(paneRef);

  let baseClassName =
    direction == "horizontal"
      ? className ++ " " ++ classNameHorizontal
      : className ++ " " ++ classNameVertical;

  let joinedClassNames =
    state.dragging ? baseClassName ++ " " ++ classNameDragging : baseClassName;

  let sizeStyle =
    if (direction == "horizontal") {
      ReactDOMRe.Style.make(~width=finalSize, ~flex="unset", ());
    } else {
      ReactDOMRe.Style.make(~height=finalSize, ~flex="unset", ());
    };

  <div className=joinedClassNames>
    <div> <div> {fst(children)} </div> </div>
    <div onMouseDown />
    <div ref=refForJsx style=sizeStyle> <div> {snd(children)} </div> </div>
  </div>;
};