import {ValidVisualizerState} from "./ValidVisualizerState.mjs";

export class KeyboardHandler {
    hotkeys = {
        nextFrameType: ["ArrowRight"],
        previousFrameType: ["ArrowLeft"],
    };

    constructor(visualizerState) {
        this.visualizerState = visualizerState;
    }

    handleKeyDown(event) {
        const key = event.key;
        let newFrameType;
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
        }
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