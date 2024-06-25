import {ValidVisualizerState} from "./ValidVisualizerState.mjs";

export class KeyboardHandler {
    hotkeys = {
        nextFrameType: ["ArrowRight"],
        previousFrameType: ["ArrowLeft"],
        toggle3D: [" "],
        toggleUi: ["ArrowUp"],
    };

    constructor(visualizerState) {
        this.visualizerState = visualizerState;
    }

    handleKeyDown(event) {
        const key = event.key;
        if (this.hotkeys.nextFrameType.includes(key)) {
            this.visualizerState.value = {
                ...this.visualizerState.value,
                frameType: this.nextFrameType()
            };
        } else if (this.hotkeys.previousFrameType.includes(key)) {
            this.visualizerState.value = {
                ...this.visualizerState.value,
                frameType: this.previousFrameType()
            };
        } else if (this.hotkeys.toggle3D.includes(key)) {
            this.visualizerState.value = {
                ...this.visualizerState.value,
                renderType: this.toggle3D()
            };
        } else if (this.hotkeys.toggleUi.includes(key)) {
            this.visualizerState.value = {
                ...this.visualizerState.value,
                uiShown: !this.visualizerState.value.uiShown
            };
        }
    }

    toggle3D() {
        const renderTypes = ValidVisualizerState.renderTypes;
        const currentRenderType = this.visualizerState.value.renderType;
        const currentIndex = renderTypes.indexOf(currentRenderType);
        let newIndex = currentIndex + 1;
        if (newIndex >= renderTypes.length) {
            newIndex = 0;
        }
        return renderTypes[newIndex];
    }

    nextFrameType() {
        const frameTypes = ValidVisualizerState.frameTypes;
        const currentFrameType = this.visualizerState.value.frameType;
        const currentIndex = frameTypes.indexOf(currentFrameType);
        let newIndex = currentIndex + 1;
        if (newIndex >= frameTypes.length) {
            newIndex = 0;
        }
        return frameTypes[newIndex];
    }

    previousFrameType() {
        const frameTypes = ValidVisualizerState.frameTypes;
        const currentFrameType = this.visualizerState.value.frameType;
        const currentIndex = frameTypes.indexOf(currentFrameType);
        let newIndex = currentIndex - 1;
        if (newIndex < 0) {
            newIndex = frameTypes.length - 1;
        }
        return frameTypes[newIndex];
    }
}