import React from "react";
import { CSSTransition } from "react-transition-group";
import ReactDom from "react-dom";

import "./SideDrawer.css";

const SideDrawer = props => {
  const content = (
    <CSSTransition
      in={props.show}
      timeout={5000}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={props.onClick}>
        {props.children}
      </aside>
    </CSSTransition>
  );

  return ReactDom.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
