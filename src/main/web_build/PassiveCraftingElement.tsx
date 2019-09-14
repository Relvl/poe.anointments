import * as React from "react";
import Database, {PassiveType} from "./core/database";
import * as _ from "underscore";

type Props = {
    passive: PassiveType;
    id: keyof typeof Database.Passives;
};
export default class PassiveCraftingElement extends React.Component<Props> {
    render() {
        return (
            <div className="passive-item flex-row-center">
                <div className="pre-img" />
                <img src={this.props.passive.icon} alt={this.props.passive.name} />
                <div className="grid-col-5">
                    <header>{this.props.passive.name}</header>
                    <div className="flex-row-center">
                        {_.map(Database.Crafting[this.props.id], oilId => {
                            if (!oilId) return <div className="oil-ingredient" />;
                            let oil = Database.Oil[oilId];
                            return (
                                <div className="text-grey-smallest oil-ingredient">
                                    <img src={`./img/${oil.icon}`} alt={oilId} />
                                    {oil.name}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid-col-5 flex-push-right text-grey-smallest">
                    {_.map(this.props.passive.stats, (s, idx) => (
                        <p key={idx}>{s}</p>
                    ))}
                </div>
            </div>
        );
    }
}
