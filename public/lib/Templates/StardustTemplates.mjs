import {FJS} from "https://fjs.targoninc.com/f.js";
import {Color} from "../Color.mjs";

export class StardustTemplates {
    /**
     *
     * @param visualizerState {VisualizerState}
     */
    static frame(visualizerState) {
        let frame;
        frame = StardustTemplates.frame2D(visualizerState.data, visualizerState.debug, visualizerState.frameType);
        return frame;
    }

    static canvas(width, height) {
        return FJS.create("canvas")
            .styles("width", `${width}px`, "height", `${height}px`)
            .attributes("width", width, "height", height)
            .id("frame")
            .build();
    }

    static renderRectangle(ctx, i, data, width, height, lightness) {
        const x = (width / data.length) * i;
        const singleWidth = width / data.length;
        const singleHeight = height * lightness;
        ctx.fillRect(x, height - singleHeight, singleWidth, singleHeight);
    }

    static frame2D(data, debug, type = "grid") {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        const canvas = StardustTemplates.canvas(width, height);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
        const max = Math.max(...data, 1);
        const maxForColor = max * 1.2;
        const secondsPerCycle = 5;
        const hueShiftByTime = Math.sin(Date.now() / (1000 * secondsPerCycle));
        const center = {
            x: width / 2,
            y: height / 2
        };
        const insetStep = 1;
        for (let i = 0; i < data.length; i++) {
            if (data[i] === 0) {
                continue;
            }

            const lightness = data[i] / maxForColor;
            let hueShiftByLoudness = Math.PI * (data[i] / maxForColor) * 0.3;
            if (isNaN(hueShiftByLoudness)) {
                hueShiftByLoudness = 0;
            }
            const hueShiftByIndex = Math.PI * (i / data.length) * 0.1;
            ctx.fillStyle = Color.rainbow(hueShiftByTime + hueShiftByIndex + hueShiftByLoudness, lightness ** 3);

            switch (type) {
            case "grid":
                this.renderGridCell(ctx, i, data, width, height, center, lightness, insetStep, 2);
                break;
            case "circle":
                this.renderCircle(ctx, i, data, width, height, max, 15, lightness, center);
                break;
            case "bars":
                this.renderRectangle(ctx, i, data, width, height, lightness);
                break;
            }
        }
        if (debug) {
            StardustTemplates.addDebugInfo(data, ctx);
        }
        return canvas;
    }

    static renderGridCell(ctx, i, data, width, height, center, lightness, insetStep, baseInset, gridAlignment = "bottom") {
        const rows = Math.floor(Math.sqrt(data.length));
        const cols = Math.ceil(data.length / rows);
        const singleHeight = height / rows;
        const singleCellWidth = width / cols;
        const widthWithoutInset = singleCellWidth - (baseInset * 2);
        const heightWithoutInset = singleHeight - (baseInset * 2);
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = singleCellWidth * col;
        const y = singleHeight * row;
        let realY = this.getGridYPositionByAlignment(gridAlignment, height, y, singleHeight, row, center);
        const xInset = baseInset + (widthWithoutInset * (1 - lightness) * 0.5);
        const xInsetRounded = Math.round(xInset / insetStep) * insetStep;
        const yInset = baseInset + (heightWithoutInset * (1 - lightness) * 0.5);
        const yInsetRounded = Math.round(yInset / insetStep) * insetStep;
        ctx.fillRect(x + xInsetRounded, realY + yInsetRounded, widthWithoutInset - (xInsetRounded * 2), heightWithoutInset - (yInsetRounded * 2));
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

    static addDebugInfo(data, ctx) {
        StardustTemplates.addAverageText(data, ctx);
    }

    static addAverageText(data, ctx) {
        const average = data.reduce((acc, val) => acc + val, 0) / data.length;
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px Arial";
        ctx.fillText(`Average: ${average}`, 10, 50);
    }

    static renderCircle(ctx, i, data, width, height, max, maxSize, lightness, center) {
        const x = Math.sin(i);
        const y = Math.cos(i);
        const xDistance = (width * 0.4) * (data[i] / max);
        const yDistance = (height * 0.4) * (data[i] / max);
        const size = (i / data.length) * maxSize * lightness;
        ctx.beginPath();
        ctx.arc(center.x + (x * xDistance), center.y + (y * yDistance), Math.max(1, size), 0, 2 * Math.PI);
        ctx.fill();
    }
}