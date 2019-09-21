import * as React from "react";
import Database, {RingCraftType, Towers} from "./database";
import * as _ from "underscore";

type Props = {
    ring: RingCraftType;
};
export default class RingCraftingElement extends React.Component<Props> {
    render() {
        return (
            <div className="group-item flex-row-center">
                <img src={Towers[this.props.ring.tower].icon} alt={this.props.ring.tower} />

                <div className="grid-col-4">
                    <header>{Towers[this.props.ring.tower].name}</header>
                    <div className="flex-row-center">
                        {_.map(this.props.ring.ingredients, (oilId, idx) => {
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
                    {_.map(this.props.ring.stats, (s, idx) => (
                        <p key={idx}>{s}</p>
                    ))}
                </div>
            </div>
        );
    }
}
