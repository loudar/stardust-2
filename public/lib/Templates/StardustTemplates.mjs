import {FJS} from "@targoninc/fjs";
import {Color} from "../Color.mjs";
import * as THREE from "three";
import {TextGeometry} from "three/addons";

export class StardustTemplates {
    /**
     *
     * @param visualizerState {VisualizerState}
     */
    static frame(visualizerState) {
        let frame;
        frame = StardustTemplates.genericFrame(visualizerState.data, visualizerState.debug, visualizerState.renderType, visualizerState.frameType);
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

    static genericFrame(data, debug, renderType = "3D", type = "grid") {
        const max = Math.max(...data, 1);
        const maxForColor = max * 1.2;
        const secondsPerCycle = 5;
        const hueShiftByTime = Math.sin(Date.now() / (1000 * secondsPerCycle));
        switch (renderType) {
        case "3D":
            return StardustTemplates.frame3D(data, debug, "bars", hueShiftByTime, max, maxForColor);
        case "2D":
        default:
            return StardustTemplates.frame2D(data, debug, type, hueShiftByTime, max, maxForColor);
        }
    }

    static frame3D(data, debug, type = "bars", hueShiftByTime = 0, max = 255, maxForColor = 1) {
        this.initialize3dFrame();
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const materials = [];
        for (let i = 0; i < data.length; i++) {
            if (!data[i] || data[i] === 0) {
                continue;
            }

            if (i % 4 !== 0) {
                continue;
            }

            const lightness = data[i] / maxForColor;
            let hueShiftByLoudness = Math.PI * (data[i] / maxForColor) * 0.3;
            if (isNaN(hueShiftByLoudness)) {
                hueShiftByLoudness = 0;
            }
            const hueShiftByIndex = Math.PI * (i / data.length) * 0.1;

            switch (type) {
            case "bars":
                const material = new THREE.MeshBasicMaterial({ color: Color.rainbow(hueShiftByTime + hueShiftByIndex + hueShiftByLoudness, lightness ** 3, true) });
                materials.push(material);
                this.render3DBar(i, data, boxGeometry, material);
                break;
            }
        }

        switch (type) {
        case "bars":
            window.camera.position.z = 400;
            break;
        }

        window.renderer.render(window.scene, window.camera);
        if (debug) {
            StardustTemplates.addDebugText3D(`Elements in scene: ${window.scene.children.length}`);
        }
        materials.forEach(material => material.dispose());
        window.renderer.domElement.id = "frame";
        return window.renderer.domElement;
    }

    static render3DBar(i, data, geometry, material) {
        const cube = new THREE.Mesh(geometry, material);
        const sizeModifier = 100;
        cube.position.x = -i + (data.length / 2);
        cube.scale.y = (data[i] / 100) * sizeModifier;
        window.scene.add(cube);
    }

    static initialize3dFrame() {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        if (!window.threeJsInitialized) {
            window.camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 1000);
            window.renderer = new THREE.WebGLRenderer();
            window.threeJsInitialized = true;
        }
        window.scene = new THREE.Scene();
        window.renderer.clear();
        window.renderer.setSize(width, height);
    }

    static addDebugText3D(text) {
        const textGeometry = new TextGeometry(text, {
            font: window.font,
            size: 20,
            height: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 8,
            bevelOffset: 0,
            bevelSegments: 5
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(textGeometry, textMaterial);
        mesh.position.x = -50;
        mesh.position.y = 50;
        mesh.position.z = 0;
        window.scene.add(mesh);
    }

    static frame2D(data, debug, type = "grid", hueShiftByTime = 0, max = 255, maxForColor = 1) {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        const canvas = StardustTemplates.canvas(width, height);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
        const center = {
            x: width / 2,
            y: height / 2
        };
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

            switch (type) {
            case "grid":
                ctx.fillStyle = Color.rainbow(hueShiftByTime + hueShiftByIndex + hueShiftByLoudness, lightness ** 3);
                this.renderGridCell(ctx, i, data, width, height, center, lightness, 1, 2);
                break;
            case "circle":
                ctx.fillStyle = Color.rainbow(hueShiftByTime + hueShiftByIndex + hueShiftByLoudness, lightness ** 2);
                this.renderCircle(ctx, i, data, width, height, max, 15, lightness, center);
                break;
            case "bars":
                ctx.fillStyle = Color.rainbow(hueShiftByTime + hueShiftByIndex + hueShiftByLoudness, lightness ** 3);
                this.renderRectangle(ctx, i, data, width, height, lightness);
                break;
            case "spiral":
                ctx.fillStyle = Color.rainbow(hueShiftByTime + hueShiftByIndex + hueShiftByLoudness, lightness ** 5);
                this.renderSpiral(ctx, i, data, width, height, lightness, center);
                break;
            }
        }
        if (debug) {
            StardustTemplates.addDebugInfo2D(data, ctx);
        }
        return canvas;
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
        if (lightness < 0.7) {
            const borderThickness = 2;
            ctx.fillRect(x + xInsetRounded, realY + yInsetRounded, borderThickness, heightWithoutInset - (yInsetRounded * 2));
            ctx.fillRect(x + xInsetRounded, realY + yInsetRounded, widthWithoutInset - (xInsetRounded * 2), borderThickness);
            ctx.fillRect(x + xInsetRounded, realY + heightWithoutInset - yInsetRounded - borderThickness, widthWithoutInset - (xInsetRounded * 2), borderThickness);
            ctx.fillRect(x + widthWithoutInset - xInsetRounded - borderThickness, realY + yInsetRounded, borderThickness, heightWithoutInset - (yInsetRounded * 2));
        } else {
            ctx.fillRect(x + xInsetRounded, realY + yInsetRounded, widthWithoutInset - (xInsetRounded * 2), heightWithoutInset - (yInsetRounded * 2));
        }
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

    static addDebugInfo2D(data, ctx) {
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