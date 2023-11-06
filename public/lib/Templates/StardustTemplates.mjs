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
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        const canvas = FJS.create("canvas")
            .styles("width", `${width}px`, "height", `${height}px`)
            .attributes("width", width, "height", height)
            .id("frame")
            .build();
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
        const singleWidth = width / data.length;
        ctx.fillStyle = "#ffffff";
        for (let i = 0; i < data.length; i++) {
            const x = (width / data.length) * i;
            ctx.fillRect(x, height - data[i], singleWidth, data[i]);
        }
        const average = data.reduce((acc, val) => acc + val, 0) / data.length;
        ctx.font = "12px Arial";
        ctx.fillText(`Average: ${average}`, 10, 50);
        return canvas;
    }
}