import {FJS} from "https://fjs.targoninc.com/f.js";
import {Color} from "../Color.mjs";

export class StardustTemplates {
    /**
     *
     * @param visualizerState {VisualizerState}
     */
    static frame(visualizerState) {
        switch (visualizerState.frameType) {
        case "bars":
            return StardustTemplates.bars(visualizerState.data);
        case "grid":
            return StardustTemplates.grid(visualizerState.data);
        default:
            return StardustTemplates.bars(visualizerState.data);
        }
    }

    static canvas(width, height) {
        return FJS.create("canvas")
            .styles("width", `${width}px`, "height", `${height}px`)
            .attributes("width", width, "height", height)
            .id("frame")
            .build();
    }

    static bars(data) {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        const canvas = StardustTemplates.canvas(width, height);
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

    static grid(data) {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        const canvas = StardustTemplates.canvas(width, height);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
        const rows = Math.floor(Math.sqrt(data.length));
        const cols = Math.ceil(data.length / rows);
        const singleHeight = height / rows;
        const singleCellWidth = width / cols;
        const max = Math.max(...data);
        const maxForColor = max * 2;
        for (let i = 0; i < data.length; i++) {
            if (data[i] < 100) {
                continue;
            }
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = singleCellWidth * col;
            const y = singleHeight * row;
            ctx.fillStyle = Color.rainbow(i / data.length * 2, data[i] / maxForColor);
            ctx.fillRect(width - x, height - y, singleCellWidth, singleHeight);
        }
        const average = data.reduce((acc, val) => acc + val, 0) / data.length;
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px Arial";
        ctx.fillText(`Average: ${average}`, 10, 50);
        return canvas;
    }
}