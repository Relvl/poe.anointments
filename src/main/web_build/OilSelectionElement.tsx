import * as React from "react";
import {OilType} from "./core/database";

type Props = {
    oil: OilType;
    selected: boolean;
    onChanged: () => void;
};

export default class OilSelectionElement extends React.Component<Props> {
    render() {
        return (
            <div className={window.className("oil-item flex-row-center", {selected: this.props.selected})} onClick={this.props.onChanged}>
                <img src={`./img/${this.props.oil.icon}`} alt={this.props.oil.name} />
                <header>{this.props.oil.name}</header>
                <div className="text-grey-small">Drop level: {this.props.oil.dropLevel}</div>
                <a href={this.props.oil.url} target={"_blank"} className="flex-push-right">
                    [wiki]
                </a>
            </div>
        );
    }
}
