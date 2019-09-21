import * as React from "react";
import Database, {BlightMapCraftType, RingCraftType, Towers} from "./database";
import * as _ from "underscore";

type Props = {
    map: BlightMapCraftType;
};
export default class BlightMapCraftingElement extends React.Component<Props> {
    render() {
        return (
            <div className="group-item flex-row-center">
                <div className="icon-holder">
                    <img src={`./img/${Database.Oil[this.props.map.oil].icon}`} alt={this.props.map.oil} />
                </div>

                <div className="grid-col-4">
                    <header>{this.props.map.oil} Oil</header>
                </div>

                <div className="grid-col-6 text-grey-smallest">
                    {_.map(this.props.map.stats, (s, idx) => (
                        <p key={idx}>{s}</p>
                    ))}
                </div>
            </div>
        );
    }
}
