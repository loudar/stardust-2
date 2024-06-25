import {FJS} from "@targoninc/fjs";

export class UiTemplates {
    static text(text, coordinates = { x: 0, y: 0 }) {
        return FJS.create("span")
            .classes("stardust-ui-text")
            .styles("top", `${coordinates.y}px`, "left", `${coordinates.x}px`)
            .text(text)
            .build();
    }
}