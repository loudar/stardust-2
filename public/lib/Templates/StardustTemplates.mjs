import {FJS} from "https://fjs.targoninc.com/f.js";

export class StardustTemplates {
    /**
     *
     * @param visualizerState {VisualizerState}
     */
    static frame(visualizerState) {
        switch (visualizerState.frameType) {
        case "bars":
            return StardustTemplates.bars(visualizerState.data);
        default:
            return StardustTemplates.bars(visualizerState.data);
        }
    }

    static bars(data) {
        const children = [];
        for (let value of data) {
            children.push(StardustTemplates.item(value));
        }
        return FJS.create("div")
            .classes("frame", "flex")
            .children(
                ...children
            ).build();
    }

    static item(value) {
        return FJS.create("div")
            .classes("bar")
            .styles("height", `${value}px`, "width", "1px")
            .build();
    }
}