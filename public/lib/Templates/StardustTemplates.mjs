import {FJS} from "https://fjs.targoninc.com/f.js";

export class StardustTemplates {
    static frame(visualizerState) {
        const now = new Date();
        return FJS.create("span")
            .text(visualizerState.data.length + " " + now.toISOString())
            .build();
    }
}