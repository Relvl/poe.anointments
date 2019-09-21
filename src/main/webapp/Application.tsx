import * as React from "react";
import Database, {OilNames, Towers} from "./database";
import * as _ from "underscore";
import OilSelectionElement from "./OilSelectionElement";
import PassiveCraftingElement from "./PassiveCraftingElement";
import RingCraftingElement from "./RingCraftingElement";

type State = {
    filter: string;
    uncheckedOils: Partial<{[name in keyof typeof OilNames]: boolean}>;
    oilFilterAnyMode: boolean;
    notablesCollapsed: boolean;
    ringsCollapsed: boolean;
};

export default class Application extends React.Component<{}, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            filter: "",
            uncheckedOils: {},
            oilFilterAnyMode: false,
            notablesCollapsed: false,
            ringsCollapsed: false,
        };
    }

    private renderNatables() {
        return (
            <>
                <header className="flex-row-center col-header">
                    <a
                        href="."
                        onClick={e => {
                            e.preventDefault();
                            this.setState({notablesCollapsed: !this.state.notablesCollapsed});
                        }}
                        className="margin-right-xs"
                        title="Collaps/expang group"
                    >
                        [+]
                    </a>
                    <span title="Can be crafted on amulets and Blight League uniques">Notable passives</span>{" "}
                    <input
                        type="text"
                        name="search"
                        placeholder="Filter passives, rings"
                        value={this.state.filter}
                        onChange={e => this.setState({filter: e.target.value})}
                        className="flex-push-right grid-col-4"
                    />
                </header>
                {this.state.notablesCollapsed ? null : (
                    <div className="passives margin-bottom-m">
                        {_.chain(Database.Passives)
                            .filter(
                                pass =>
                                    (this.state.oilFilterAnyMode
                                        ? _.any(Database.Crafting[pass.id], oilId => !this.state.uncheckedOils[oilId as keyof typeof OilNames])
                                        : _.all(Database.Crafting[pass.id], oilId => !this.state.uncheckedOils[oilId as keyof typeof OilNames])) && // Фильтр пассивок подходит
                                    (!this.state.filter ||
                                        pass.name.contains(this.state.filter.trim(), true) ||
                                        _.any(pass.stats, s => s.contains(this.state.filter.trim(), true)) ||
                                        ("unlinked".startsWith(this.state.filter.toLocaleLowerCase()) && !!pass.solo))
                            )
                            .sortBy(pass => _.reduce(Database.Crafting[pass.id], (memo, oilId) => memo + Database.Oil[oilId].dropLevel, 0))
                            .map((pass, idx: string) => <PassiveCraftingElement passive={pass} key={`passive-c-${idx}`} />)
                            .value()}
                    </div>
                )}
            </>
        );
    }

    private renderRings() {
        return (
            <>
                <header className="flex-row-center column-header">
                    <a
                        href="."
                        onClick={e => {
                            e.preventDefault();
                            this.setState({ringsCollapsed: !this.state.ringsCollapsed});
                        }}
                        className="margin-right-xs"
                        title="Collaps/expang group"
                    >
                        [+]
                    </a>
                    <span title="Can be crafted on any rings">Ring anointments</span>{" "}
                    <input
                        type="text"
                        name="search"
                        placeholder="Filter passives, rings"
                        value={this.state.filter}
                        onChange={e => this.setState({filter: e.target.value})}
                        className="flex-push-right grid-col-4"
                    />
                </header>
                {this.state.ringsCollapsed ? null : (
                    <div className="rings margin-bottom-m">
                        {_.chain(Database.RingCrafting)
                            .filter(
                                r =>
                                    (this.state.oilFilterAnyMode
                                        ? _.any(r.ingredients, oilId => !this.state.uncheckedOils[oilId as keyof typeof OilNames])
                                        : _.all(r.ingredients, oilId => !this.state.uncheckedOils[oilId as keyof typeof OilNames])) && // Фильтр пассивок подходит //
                                    (!this.state.filter ||
                                    r.tower.contains(this.state.filter.trim(), true) || //
                                        _.any(r.stats, s => s.contains(this.state.filter.trim(), true))) //
                            )
                            .sortBy(r => _.indexOf(_.keys(Towers), r.tower))
                            .map((r, idx) => <RingCraftingElement ring={r} key={`ring-${idx}-${r.tower}`} />)
                            .value()}
                    </div>
                )}
            </>
        );
    }

    renderOilSelector() {
        return (
            <>
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
            </>
        );
    }

    render() {
        return (
            <section className="page-wrapper">
                <header>
                    Path of Exile: List of anointments
                    <a href="https://pathofexile.gamepedia.com/List_of_anointments" target={"_blank"} className="flex-push-right margin-right-l">
                        [wiki - List of anointments]
                    </a>
                    <a href="https://pathofexile.gamepedia.com/Oil" target={"_blank"} className="">
                        [wiki - Oil]
                    </a>
                </header>

                <p>
                    * You can type '
                    <span className="underline pointer" onClick={() => this.setState({filter: "unlinked"})}>
                        unlinked
                    </span>
                    ' in filter box to select all new blight unlinked passives.
                </p>
                <p>* Notable passives sorted in total oil 'cost' based by they drop level.</p>

                <div className="flex-row grid-col-12 page-content">
                    <div className="grid-col-8">
                        {this.renderNatables()}
                        {this.renderRings()}
                    </div>

                    <div className="grid-col-4">
                        {this.renderOilSelector()}

                        <div className="margin-top-l">
                            <p>
                                Repository:{" "}
                                <a href="https://github.com/Relvl/poe.anointments" target="_blank">
                                    Relvl/poe.anointments
                                </a>
                            </p>
                            <p>Feel free to send issues and pull requests!</p>
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
