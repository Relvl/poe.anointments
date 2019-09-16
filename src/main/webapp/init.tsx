import * as ReactDOM from "react-dom";
import * as React from "react";
import Application from "./Application";

// Потому что скрипт Application прогружается раньше страниц из-за импортов.
ReactDOM.render(<Application />, document.getElementById("root"));
