import * as React from "react";
import {OilType} from "./database";

type Props = {
    oil: OilType;
    selected: boolean;
    onChanged: () => void;
};

export default class OilSelectionElement extends React.Component<Props> {
    render() {
        return (
            <div
                className={window.className("group-item flex-row-center", {selected: this.props.selected})}
                onClick={(e: any) => {
                    if (!e.target.href) {
                        this.props.onChanged();
                    }
                }}
            >
                <img src={`./img/${this.props.oil.icon}`} alt={this.props.oil.name} />
                <header>
                    {this.props.oil.name}{" "}
                    <a href={this.props.oil.url} target={"_blank"} className="margin-left-xs">
                        [wiki]
                    </a>
                </header>
                <div className="text-grey-small flex-push-right">Drop level: {this.props.oil.dropLevel}</div>
            </div>
        );
    }
}
