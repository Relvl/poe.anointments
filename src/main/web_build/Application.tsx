import * as React from "react";
import Database from "./core/database";
import * as _ from "underscore";
import OilSelectionElement from "./OilSelectionElement";
import PassiveCraftingElement from "./PassiveCraftingElement";

export default class Application extends React.Component {
    private static pageRoutings: {[hash: string]: {pageHash: string; pageClass: typeof React.Component}} = {};

    static registerPage(pageHash: string, pageClass: typeof React.Component) {
        Application.pageRoutings[pageHash] = {pageHash, pageClass};
    }

    render() {
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
                <div className="flex-row grid-col-12">
                    <div className="grid-col-8">
                        <header>Notable passives</header>
                        <div className="passives">
                            {_.chain(Database.Passives)
                                .map((pass, idx: string) => <PassiveCraftingElement passive={pass} id={idx as keyof typeof Database.Passives} key={`passive-c-${idx}`} />)
                                .value()}
                        </div>
                    </div>

                    <div className="grid-col-4">
                        <header>Oil selector</header>
                        <div className="oil-selector">
                            {_.map(Database.Oil, (oil, idx) => (
                                <OilSelectionElement oil={oil} selected={false} onChanged={() => {}} key={`oil-${oil.name}`} />
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
}

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
