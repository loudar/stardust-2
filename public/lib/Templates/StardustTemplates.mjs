import {FJS} from "@targoninc/fjs";
import {Color} from "../Color.mjs";
import * as THREE from "three";
import {TextGeometry} from "three/addons";
import {ThreeJsRenderer} from "../ThreeJsRenderer.mjs";

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

    static genericFrame(data, debug, renderType = "3D", type = "grid") {
        const max = Math.max(...data, 1);
        const maxForColor = max * 1.2;

        const peakRelevantData = data;
        const currentAverage = peakRelevantData.reduce((acc, val) => acc + val, 0) / peakRelevantData.length;
        let previousFrames = window.previousFrames || [];

        if (previousFrames.length === 5) {
            previousFrames.shift();
        }
        previousFrames.push(currentAverage);

        window.previousFrames = previousFrames;

        const previousAverage = previousFrames.reduce((acc, val) => acc + val, 0) / previousFrames.length;

        const isPeak = currentAverage > previousAverage * 1.1;
        window.previousAverage = currentAverage;

        if (!window.peakSwitch) {
            window.peakSwitch = false;
        }
        if (isPeak) {
            window.peakSwitch = !window.peakSwitch;
        }

        const secondsPerCycle = 20;
        let hueShiftByTime = Math.sin(Date.now() / (1000 * secondsPerCycle));
        if (window.peakSwitch) {
            hueShiftByTime += Math.PI;
        }
        switch (renderType) {
        case "3D":
            return StardustTemplates.frame3D(data, debug, type, hueShiftByTime, max, maxForColor);
        case "2D":
        default:
            return StardustTemplates.frame2D(data, debug, type, hueShiftByTime, max, maxForColor);
        }
    }

    static frame3D(data, debug, type = "bars", hueShiftByTime = 0, max = 255, maxForColor = 1) {
        this.initialize3dFrame();
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const materials = [];
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        for (let i = 0; i < data.length; i++) {
            if (!data[i] || data[i] === 0) {
                continue;
            }

            const lightness = data[i] / maxForColor;
            let hueShiftByLoudness = Math.PI * (data[i] / maxForColor) * 0.3;
            if (isNaN(hueShiftByLoudness)) {
                hueShiftByLoudness = 0;
            }
            const hueShiftByIndex = Math.PI * (i / data.length) * 0.1;

            switch (type) {
            case "spiral":
                const materialSpiral = new THREE.MeshBasicMaterial({ color: Color.rainbow(hueShiftByTime + hueShiftByIndex + hueShiftByLoudness, lightness ** 3, true) });
                materials.push(materialSpiral);
                ThreeJsRenderer.render3DSpiral(i, data, lightness, sphereGeometry, materialSpiral);
                break;
            case "bars":
            case "flimmer":
            case "circle":
                const material = new THREE.MeshBasicMaterial({ color: Color.rainbow(hueShiftByTime + hueShiftByIndex + hueShiftByLoudness, lightness ** 3, true) });
                materials.push(material);
                ThreeJsRenderer.render3DBar(i, data, boxGeometry, material);
                break;
            case "grid":
                const material2 = new THREE.MeshBasicMaterial({ color: Color.rainbow(hueShiftByTime + hueShiftByIndex + hueShiftByLoudness, lightness ** 3, true) });
                materials.push(material2);
                ThreeJsRenderer.render3DGridItem(i, data, height, width, boxGeometry, material2);
                break;
            }
        }

        let cameraRadius, positionByTime;
        switch (type) {
        case "spiral":
            cameraRadius = 0; // height * 0.5;
            positionByTime = ThreeJsRenderer.getCirclePositionByTime(Date.now() / 10000, cameraRadius);
            window.camera.position.z = positionByTime.x;
            window.camera.position.x = positionByTime.y;
            window.camera.position.y = 750;
            window.camera.lookAt(new THREE.Vector3(0, -200, 0));
            window.camera.rotation.z = Math.PI * (Date.now() / 20000);
            break;
        case "bars":
        case "flimmer":
        case "circle":
            cameraRadius = 500;
            positionByTime = ThreeJsRenderer.getCirclePositionByTime(Date.now() / 10000, cameraRadius);
            window.camera.position.z = positionByTime.x;
            window.camera.position.y = positionByTime.y;
            window.camera.position.x = 0;
            window.camera.lookAt(new THREE.Vector3(0, 0, 0));
            break;
        case "grid":
            cameraRadius = 0; // height * 0.5;
            positionByTime = ThreeJsRenderer.getCirclePositionByTime(Date.now() / 10000, cameraRadius);
            window.camera.position.z = positionByTime.x;
            window.camera.position.x = positionByTime.y;
            window.camera.position.y = 220;
            window.camera.lookAt(new THREE.Vector3(0, -200, 0));
            window.camera.rotation.z = Math.PI * (Date.now() / 20000);
            break;
        }

        window.renderer.render(window.scene, window.camera);
        if (debug) {
            ThreeJsRenderer.add3DGrid();
        }
        materials.forEach(material => material.dispose());
        window.renderer.domElement.id = "frame";
        return window.renderer.domElement;
    }

    static initialize3dFrame() {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        if (!window.threeJsInitialized) {
            window.camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 10000);
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
            const hueShiftByIndex = Math.PI * (i / data.length) * 0.02;

            switch (type) {
            case "grid":
                ctx.fillStyle = Color.rainbow(hueShiftByTime + hueShiftByIndex + hueShiftByLoudness, lightness ** 3);
                ThreeJsRenderer.renderGridCell(ctx, i, data, width, height, center, lightness, 1, 2);
                break;
            case "flimmer":
                ctx.fillStyle = Color.rainbow(hueShiftByTime + hueShiftByIndex + hueShiftByLoudness, lightness ** 3);
                ThreeJsRenderer.renderFlimmerCell(ctx, i, data, width, height, center, lightness, 1, 2);
                break;
            case "circle":
                ctx.fillStyle = Color.rainbow(hueShiftByTime + hueShiftByIndex + hueShiftByLoudness, lightness ** 2);
                ThreeJsRenderer.renderCircle(ctx, i, data, width, height, max, 15, lightness, center);
                break;
            case "bars":
                ctx.fillStyle = Color.rainbow(hueShiftByTime + hueShiftByIndex + hueShiftByLoudness, lightness ** 3);
                ThreeJsRenderer.renderRectangle(ctx, i, data, width, height, lightness);
                break;
            case "spiral":
                ctx.fillStyle = Color.rainbow(hueShiftByTime + hueShiftByIndex + hueShiftByLoudness, lightness ** 5);
                ThreeJsRenderer.renderSpiral(ctx, i, data, width, height, lightness, center);
                break;
            }
        }
        if (debug) {
            StardustTemplates.addDebugInfo2D(data, ctx);
        }
        return canvas;
    }

    static addDebugInfo2D(data, ctx) {
        ThreeJsRenderer.renderAverageText(data, ctx);
    }
}