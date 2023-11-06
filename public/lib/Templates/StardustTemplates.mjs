import {FJS} from "https://fjs.targoninc.com/f.js";
import {Color} from "../Color.mjs";

export class StardustTemplates {
    /**
     *
     * @param visualizerState {VisualizerState}
     */
    static frame(visualizerState) {
        let frame;
        switch (visualizerState.frameType) {
        case "bars":
            frame = StardustTemplates.bars(visualizerState.data);
            break;
        case "grid":
            frame = StardustTemplates.grid(visualizerState.data);
            break;
        case "circle":
            frame = StardustTemplates.circle(visualizerState.data);
            break;
        default:
            frame = StardustTemplates.bars(visualizerState.data);
            break;
        }
        return frame;
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
        StardustTemplates.addAverageText(data, ctx);
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
        const maxForColor = max * 1.2;
        const hueFactor = data.length * 6;
        const hueShift = Math.sin(Date.now() / 1000) * 0.1;
        const baseInset = 2;
        const widthWithoutInset = singleCellWidth - (baseInset * 2);
        const heightWithoutInset = singleHeight - (baseInset * 2);
        const gridAlignment = "bottom";
        const center = {
            x: width / 2,
            y: height / 2
        };
        const insetStep = 1;
        for (let i = 0; i < data.length; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = singleCellWidth * col;
            const y = singleHeight * row;
            let realY = this.getGridYPositionByAlignment(gridAlignment, height, y, singleHeight, row, center);
            const lightness = data[i] / maxForColor;
            const xInset = baseInset + (widthWithoutInset * (1 - lightness) * 0.5);
            const xInsetRounded = Math.round(xInset / insetStep) * insetStep;
            const yInset = baseInset + (heightWithoutInset * (1 - lightness) * 0.5);
            const yInsetRounded = Math.round(yInset / insetStep) * insetStep;
            const hueShiftByLoudness = lightness * 0.5;
            ctx.fillStyle = Color.rainbow((i / hueFactor) + hueShift + hueShiftByLoudness, lightness ** 3);
            ctx.fillRect(x + xInsetRounded, realY + yInsetRounded, widthWithoutInset - (xInsetRounded * 2), heightWithoutInset - (yInsetRounded * 2));
        }
        StardustTemplates.addAverageText(data, ctx);
        return canvas;
    }

    static getGridYPositionByAlignment(gridAlignment, height, y, singleHeight, row, center) {
        let realY;
        switch (gridAlignment) {
        case "bottom":
            realY = height - y - singleHeight;
            break;
        case "top":
            realY = y;
            break;
        case "center":
        default:
            if (row % 2 === 0) {
                realY = center.y - (singleHeight * 0.125) - y;
            } else {
                realY = center.y + (singleHeight * 0.125) + y;
            }
            break;
        }
        return realY;
    }

    static addAverageText(data, ctx) {
        const average = data.reduce((acc, val) => acc + val, 0) / data.length;
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px Arial";
        ctx.fillText(`Average: ${average}`, 10, 50);
    }

    static circle(data) {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        const canvas = StardustTemplates.canvas(width, height);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
        const max = Math.max(...data);
        const maxForColor = max * 1.5;
        const hueFactor = data.length * 6;
        const hueShift = Math.sin(Date.now() / 1000) * 0.1;
        const center = {
            x: width / 2,
            y: height / 2
        };
        const maxSize = 15;
        for (let i = 0; i < data.length; i++) {
            if (data[i] === 0) {
                continue;
            }
            const x = Math.sin(i);
            const y = Math.cos(i);
            const xDistance = (width * 0.4) * (data[i] / max);
            const yDistance = (height * 0.4) * (data[i] / max);
            const lightness = data[i] / maxForColor;
            const size = (i / data.length) * maxSize * lightness;
            ctx.fillStyle = Color.rainbow((i / hueFactor) + hueShift, lightness ** 2);
            ctx.beginPath();
            ctx.arc(center.x + (x * xDistance), center.y + (y * yDistance), Math.max(1, size), 0, 2 * Math.PI);
            ctx.fill();
        }
        StardustTemplates.addAverageText(data, ctx);
        return canvas;
    }
}