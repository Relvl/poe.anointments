import * as React from "react";
import Database, {OilNames} from "./database";
import * as _ from "underscore";
import OilSelectionElement from "./OilSelectionElement";
import PassiveCraftingElement from "./PassiveCraftingElement";

type State = {
    filter: string;
    uncheckedOils: Partial<{[name in keyof typeof OilNames]: boolean}>;
    oilFilterAnyMode: boolean;
};

export default class Application extends React.Component<{}, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            filter: "",
            uncheckedOils: {},
            oilFilterAnyMode: false,
        };
    }

    render() {
        const passivesToRender = _.chain(Database.Passives)
            .filter(
                pass =>
                    (this.state.oilFilterAnyMode
                        ? _.any(Database.Crafting[pass.id], oilId => !!oilId && this.state.uncheckedOils[oilId as keyof typeof OilNames] != true)
                        : _.all(Database.Crafting[pass.id], oilId => this.state.uncheckedOils[oilId as keyof typeof OilNames] != true)) &&
                    // Фильтр пассивок подходит
                    (!this.state.filter || pass.name.contains(this.state.filter, true) || _.any(pass.stats, s => s.contains(this.state.filter, true)))
            )
            .map((pass, idx: string) => <PassiveCraftingElement passive={pass} key={`passive-c-${idx}`} />)
            .value();
        return (
            <section className="page-wrapper">
                <header>
                    List of anointments
                    <a href="https://pathofexile.gamepedia.com/List_of_anointments" target={"_blank"} className="flex-push-right margin-right-l">
                        [wiki - List of anointments]
                    </a>
                    <a href="https://pathofexile.gamepedia.com/Oil" target={"_blank"} className="">
                        [wiki - Oil]
                    </a>
                </header>
                <div className="flex-row grid-col-12 page-content">
                    <div className="grid-col-8">
                        <header className="flex-row-center col-header">
                            Notable passives <span className="text-grey-small margin-left-xs">({passivesToRender.length})</span>
                            <input
                                type="text"
                                name="search"
                                placeholder="Filter passives"
                                value={this.state.filter}
                                onChange={e => this.setState({filter: e.target.value.trim()})}
                                className="flex-push-right grid-col-4"
                            />
                        </header>
                        <div className="passives">{passivesToRender}</div>
                    </div>

                    <div className="grid-col-4">
                        <header className="col-header">
                            Oil selector
                            <span className="text-grey-small margin-left-xs">Select available oils</span>
                            <a
                                href="."
                                className="flex-push-right"
                                onClick={e => {
                                    e.preventDefault();
                                    this.setState({oilFilterAnyMode: !this.state.oilFilterAnyMode});
                                }}
                            >
                                {this.state.oilFilterAnyMode ? (
                                    <span title="Filter passives that requires any of selected oils">[Any]</span>
                                ) : (
                                    <span title="Filter passives where all requirements are selected">[All]</span>
                                )}
                            </a>
                        </header>
                        <div className="oil-selector">
                            {_.map(Database.Oil, oil => (
                                <OilSelectionElement
                                    oil={oil}
                                    selected={!this.state.uncheckedOils[oil.id]!}
                                    onChanged={() => {
                                        // @ts-ignore
                                        this.state.uncheckedOils[oil.id] = !this.state.uncheckedOils[oil.id];
                                        this.setState({uncheckedOils: this.state.uncheckedOils});
                                    }}
                                    key={`oil-${oil.name}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

declare global {
    interface Window {
        className(...classes: Array<string | object | undefined | null>): string;
    }

    interface String {
        contains(sub: string, ignoreCase?: boolean): boolean;
    }
}

String.prototype.contains = function(sub: string, ignoreCase?: boolean) {
    return ignoreCase ? this.toLocaleLowerCase().indexOf(sub.toLocaleLowerCase()) != -1 : this.indexOf(sub) != -1;
};

/** Создание строки классов CSS из объекта, форматируя в чистый вид.
 * @public
 * @return {String} */
window.className = (...classes) =>
    _.chain(classes)
        .flatten()
        .compact()
        .map(cls => (typeof cls !== "object" ? cls : _.map(cls, (e, key) => (e ? key : null))))
        .flatten()
        .compact()
        .value()
        .join(" ");
