import * as THREE from "three";
import {TextGeometry} from "three/addons";

export class Renderer3D {
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

    static add3DGrid() {
        const gridHelper = new THREE.GridHelper(1000, 100, 0xffffff, 0xffffff);
        window.scene.add(gridHelper);
    }

    static render3DGridItem(i, data, height, width, geometry, material) {
        if (data[i] < 120) {
            return;
        }
        const cube = new THREE.Mesh(geometry, material);
        const rows = Math.floor(Math.sqrt(data.length));
        const cols = Math.ceil(data.length / rows);
        const singleHeight = height / rows;
        const singleCellWidth = height / cols;
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = singleCellWidth * col;
        const y = singleHeight * row;
        const xStart = -height / 2;
        const yStart = -height / 2;
        const sizeModifier = 50;
        const baseInset = singleHeight * 0.2;
        cube.position.x = xStart + x + baseInset;
        cube.position.z = yStart + y + baseInset;
        cube.position.y = 0;
        cube.scale.y = (data[i] / 100) * sizeModifier;
        cube.scale.z = singleHeight - (baseInset * 2);
        cube.scale.x = singleCellWidth - (baseInset * 2);
        window.scene.add(cube);
    }

    static render3DBar(i, data, geometry, material) {
        const cube = new THREE.Mesh(geometry, material);
        const sizeModifier = 50;
        const positionModifier = 2;
        cube.position.x = (-i + (data.length / 2)) * positionModifier;
        cube.scale.y = (data[i] / 100) * sizeModifier;
        cube.scale.z = (data[i] / 100) * sizeModifier;
        window.scene.add(cube);
    }

    static render3DSpiral(i, data, lightness, geometry, material) {
        const indexFactor = i / data.length;
        const wavelength = (1 - indexFactor);
        const timeFactor = Date.now() / 5000;
        const maxSide = 2000;
        const x = Math.sin(i + timeFactor) * maxSide * 0.5 * wavelength;
        const y = Math.cos(i + timeFactor) * maxSide * 0.5 * wavelength;
        const inverseExp = 1 - ((1 - lightness) ** 2);
        const size = 25 * inverseExp * Math.max(wavelength, 0.05);
        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = x;
        cube.position.z = y;
        cube.position.y = lightness * 200;
        cube.scale.y = size;
        cube.scale.z = size;
        cube.scale.x = size;
        window.scene.add(cube);
    }

    static addParticle(store, type, x, y, z) {
        store.push({
            type,
            pos: {
                x, y, z
            },
            vel: {
                x: 0, y: 0, z: 0
            },
            size: 0
        });
    }

    static render3DParticle(i, data, height, width, geometry, material) {
        window.particles3d = window.particles3d ?? [];
        if (window.particles3d.length < data.length) {
            const zDepth = 400;
            for (let i = 0; i < data.length; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const z = -(zDepth * 0.5) + (Math.random() * zDepth);
                Renderer3D.addParticle(window.particles3d, "circle", x - (width * 0.5), y - (height * 0.5), z);
            }
        }

        const value = data[i] / 255;
        const particle = Renderer3D.getParticleStep(window.particles3d[i], value, width, height, {x: 0, y: 0});

        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = particle.pos.x;
        cube.position.z = particle.pos.y;
        cube.position.y = 0;
        cube.scale.y = particle.size;
        cube.scale.z = particle.size;
        cube.scale.x = particle.size;
        window.scene.add(cube);
    }

    static getParticleStep(particle, value, width, height, center) {
        const velocityFactor = 0.3;
        const veloMod = value * velocityFactor;
        particle.pos.x += particle.vel.x * value * 2;
        particle.pos.y += particle.vel.y * value * 2;
        particle.pos.z = 0;
        particle.vel.x += -veloMod + (Math.random() * veloMod * 2);
        particle.vel.y += -veloMod + (Math.random() * veloMod * 2);
        particle.vel.z = 0;
        particle.size = 8 * (value ** 2);
        const centerForce = 0.00002;
        const screenratio = width / height;
        particle.vel.x += (center.x - particle.pos.x) * centerForce * (1 / screenratio);
        particle.vel.y += (center.y - particle.pos.y) * centerForce * screenratio;
        particle.vel.x = Math.max(Math.min(particle.size, particle.vel.x), -particle.size);
        particle.vel.y = Math.max(Math.min(particle.size, particle.vel.y), -particle.size);

        if (particle.pos.x < center.x - (width * 0.5)) {
            particle.pos.x = center.x + (width * 0.5);
        }
        if (particle.pos.x > center.x + (width * 0.5)) {
            particle.pos.x = center.x - (width * 0.5);
        }
        if (particle.pos.y < center.y - (height * 0.5)) {
            particle.pos.y = center.y + (height * 0.5);
        }
        if (particle.pos.y > center.y + (height * 0.5)) {
            particle.pos.y = center.y - (height * 0.5);
        }
        return particle;
    }
}