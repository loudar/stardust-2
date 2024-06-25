import {UiTemplates} from "./Templates/UiTemplates.mjs";
import {computedSignal} from "@targoninc/fjs";

export class StardustUiRenderer {
    constructor(uiNodeId) {
        const uiNode = document.getElementById(uiNodeId);
        if (!uiNode) {
            this.uiNode = null;
        } else {
            this.uiNode = uiNode;
        }
        this.visualizerState = null;
    }

    initialize(visualizerState) {
        this.visualizerState = visualizerState;
        const text = computedSignal(this.visualizerState, (state) => state.renderType + " " + state.frameType);
        this.visualizerState.subscribe(state => {
            if (!state.uiShown) {
                this.uiNode.classList.add("hidden");
            } else {
                this.uiNode.classList.remove("hidden");
            }
        });

        this.uiNode.appendChild(UiTemplates.text(text, { x: 10, y: 10 }));
    }
}