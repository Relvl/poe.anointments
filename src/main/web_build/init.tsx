import * as ReactDOM from "react-dom";
import {HashRouter} from "react-router-dom";
import * as React from "react";
import Application from "./Application";

// Потому что скрипт Application прогружается раньше страниц из-за импортов.
ReactDOM.render(
    <HashRouter hashType="noslash">
        <Application />
    </HashRouter>,
    document.getElementById("root")
);
