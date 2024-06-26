import {Renderer3D} from "./Renderer3D.mjs";

export class Renderer2D {
    static renderCircle(ctx, i, data, width, height, max, maxSize, lightness, center) {
        const x = Math.sin(i);
        const y = Math.cos(i);
        const indexFactor = i / data.length;
        const wavelength = (1 - indexFactor);
        const minimumDistance = 0.4;
        const distanceByIndex = minimumDistance + ((1 - minimumDistance) * indexFactor);
        const xDistance = (width * 0.5) * (data[i] / max) * distanceByIndex;
        const yDistance = (height * 0.5) * (data[i] / max) * distanceByIndex;
        const inverseExp = 1 - ((1 - lightness) ** 2);
        const size = 15 * inverseExp * Math.max(wavelength, 0.05);
        ctx.beginPath();
        ctx.arc(center.x + (x * xDistance), center.y + (y * yDistance), Math.max(1, size), 0, 2 * Math.PI);
        ctx.fill();
    }

    static renderAverageText(data, ctx) {
        const average = data.reduce((acc, val) => acc + val, 0) / data.length;
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px Arial";
        ctx.fillText(`Average: ${average}`, 10, 50);
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

    static borderThickness = 2;

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
        let modifyWidth = true;
        let modifyHeight = true;
        let realY = this.getGridYPositionByAlignment(gridAlignment, height, y, singleHeight, row, center);
        let xInset, xInsetRounded;
        if (modifyWidth) {
            xInset = baseInset + (widthWithoutInset * (1 - lightness) * 0.5);
            xInsetRounded = Math.round(xInset / insetStep) * insetStep;
        } else {
            xInsetRounded = 0;
        }
        let yInset, yInsetRounded;
        if (modifyHeight) {
            yInset = baseInset + (heightWithoutInset * (1 - lightness) * 0.5);
            yInsetRounded = Math.round(yInset / insetStep) * insetStep;
        } else {
            yInsetRounded = 0;
        }
        if (lightness < 0.65) {
            ctx.fillRect(x + xInsetRounded, realY + yInsetRounded, Renderer2D.borderThickness, heightWithoutInset - (yInsetRounded * 2));
            ctx.fillRect(x + xInsetRounded, realY + yInsetRounded, widthWithoutInset - (xInsetRounded * 2), Renderer2D.borderThickness);
            ctx.fillRect(x + xInsetRounded, realY + heightWithoutInset - yInsetRounded - Renderer2D.borderThickness, widthWithoutInset - (xInsetRounded * 2), Renderer2D.borderThickness);
            ctx.fillRect(x + widthWithoutInset - xInsetRounded - Renderer2D.borderThickness, realY + yInsetRounded, Renderer2D.borderThickness, heightWithoutInset - (yInsetRounded * 2));
        } else {
            ctx.fillRect(x + xInsetRounded, realY + yInsetRounded, widthWithoutInset - (xInsetRounded * 2), heightWithoutInset - (yInsetRounded * 2));
        }
    }

    static renderRectangle(ctx, i, data, width, height, lightness) {
        const x = (width / data.length) * i;
        const singleWidth = width / data.length;
        const singleHeight = height * lightness;
        ctx.fillRect(x, height - singleHeight, singleWidth, singleHeight);
    }

    static renderSpiral(ctx, i, data, width, height, lightness, center) {
        ctx.strokeStyle = ctx.fillStyle;
        const indexFactor = i / data.length;
        const wavelength = (1 - indexFactor);
        const timeFactor = Date.now() / 5000;
        const maxSide = Math.max(width, height);
        const x = center.x + (Math.sin(i + timeFactor) * maxSide * 0.5 * wavelength);
        const y = center.y + (Math.cos(i + timeFactor) * maxSide * 0.5 * wavelength);
        const inverseExp = 1 - ((1 - lightness) ** 2);
        const size = 25 * inverseExp * Math.max(wavelength, 0.05);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }

    static getCirclePositionByTime(time, radius) {
        const x = Math.sin(time) * radius;
        const y = Math.cos(time) * radius;
        return {x, y};
    }

    static renderFlimmerCell(ctx, i, data, width, height, center, lightness, gridAlignment = "bottom") {
        const rows = Math.floor(Math.sqrt(data.length));
        const cols = Math.ceil(data.length / rows);
        const singleHeight = height / rows;
        const singleCellWidth = width / cols;
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = singleCellWidth * col;
        const y = singleHeight * row;
        let realY = this.getGridYPositionByAlignment(gridAlignment, height, y, singleHeight, row, center);
        const value = data[i] / 255;
        const actualHeight = singleHeight * value * 0.1;
        const xInset = (singleCellWidth * (1 - value));
        ctx.fillRect(x + xInset, realY - (value * singleHeight) + actualHeight, singleCellWidth - (2 * xInset), actualHeight);
    }

    static renderParticle(ctx, i, data, width, height, center) {
        window.particles2d = window.particles2d ?? [];
        if (window.particles2d.length < data.length) {
            for (let i = 0; i < data.length; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                Renderer3D.addParticle(window.particles2d, "circle", x, y, 0);
            }
        }

        const value = data[i] / 255;
        const particle = Renderer3D.getParticleStep(window.particles2d[i], value, width, height, center);

        if (particle.type === "circle") {
            ctx.beginPath();
            ctx.arc(particle.pos.x, particle.pos.y, particle.size, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    static renderPeakGrid(ctx, i, data, timeSinceLastPeak, timeTresh, width, height, center, lightness, insetStep, baseInset, gridAlignment = "bottom") {
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
        if (timeSinceLastPeak < timeTresh) {
            ctx.fillRect(x, realY, Renderer2D.borderThickness, heightWithoutInset);
            ctx.fillRect(x, realY, widthWithoutInset, Renderer2D.borderThickness);
            ctx.fillRect(x, realY + heightWithoutInset - Renderer2D.borderThickness, widthWithoutInset, Renderer2D.borderThickness);
            ctx.fillRect(x + widthWithoutInset - Renderer2D.borderThickness, realY, Renderer2D.borderThickness, heightWithoutInset);
        } else {
            ctx.fillRect(x, realY, widthWithoutInset, heightWithoutInset);
        }
    }

    static renderPeakHistory(ctx, data, peakHistory, center, currentAverage) {
        const now = new Date().getTime();
        for (let j = 0; j < peakHistory.length; j++) {
            const timeAgo = (now - peakHistory[j]) * 0.3;
            const radius = timeAgo + (currentAverage / 255) * center.x * .1;
            ctx.beginPath();
            ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
            ctx.lineWidth = 10 - (timeAgo / 100);
            if (j === peakHistory.length - 1) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
        }
    }
}