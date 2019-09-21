import * as React from "react";
import Database, {PassiveType} from "./database";
import * as _ from "underscore";

type Props = {
    passive: PassiveType;
};
export default class PassiveCraftingElement extends React.Component<Props> {
    render() {
        return (
            <div className={window.className("group-item flex-row-center", {"solo-passive": this.props.passive.solo})}>
                <div className="icon-holder">
                    <div className="pre-img" />
                    <img src={this.props.passive.icon} alt={this.props.passive.name} />
                </div>

                <div className="grid-col-4">
                    <header>
                        {this.props.passive.name}
                        <a href={this.props.passive.url} target="_blank" className="margin-left-xs">
                            [wiki]
                        </a>
                    </header>
                    <div className="flex-row-center">
                        {_.map(Database.Crafting[this.props.passive.id], (oilId, idx) => {
                            let oil = Database.Oil[oilId];
                            return (
                                <div className="text-grey-smallest oil-ingredient" key={`passive-oil-${idx}`}>
                                    <img src={`./img/${oil.icon}`} alt={oilId} />
                                    {oil.name}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid-col-6 text-grey-smallest">
                    {_.map(this.props.passive.stats, (s, idx) => (
                        <p key={idx}>{s}</p>
                    ))}
                </div>
            </div>
        );
    }
}
