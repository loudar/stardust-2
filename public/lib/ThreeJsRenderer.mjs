import * as THREE from "three";

export class ThreeJsRenderer {
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
            const borderThickness = 2;
            ctx.fillRect(x + xInsetRounded, realY + yInsetRounded, borderThickness, heightWithoutInset - (yInsetRounded * 2));
            ctx.fillRect(x + xInsetRounded, realY + yInsetRounded, widthWithoutInset - (xInsetRounded * 2), borderThickness);
            ctx.fillRect(x + xInsetRounded, realY + heightWithoutInset - yInsetRounded - borderThickness, widthWithoutInset - (xInsetRounded * 2), borderThickness);
            ctx.fillRect(x + widthWithoutInset - xInsetRounded - borderThickness, realY + yInsetRounded, borderThickness, heightWithoutInset - (yInsetRounded * 2));
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

    static add3DGrid() {
        const gridHelper = new THREE.GridHelper(1000, 100, 0xffffff, 0xffffff);
        window.scene.add(gridHelper);
    }

    static getCirclePositionByTime(time, radius) {
        const x = Math.sin(time) * radius;
        const y = Math.cos(time) * radius;
        return {x, y};
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

    static addParticle(type, x, y, z) {
        window.particles.push({
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

    static renderParticle(ctx, i, data, width, height, center, lightness) {
        window.particles = window.particles ?? [];
        if (window.particles.length < data.length) {
            for (let i = 0; i < data.length; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                this.addParticle("circle", x, y, 0);
            }
        }

        const velocityFactor = 0.3;
        const veloMod = lightness * velocityFactor;
        const particle = window.particles[i];
        particle.pos.x += particle.vel.x * lightness * 2;
        particle.pos.y += particle.vel.y * lightness * 2;
        particle.pos.z = 0;
        particle.vel.x += -veloMod + (Math.random() * veloMod * 2);
        particle.vel.y += -veloMod + (Math.random() * veloMod * 2);
        particle.vel.z = 0;
        particle.size = 10 * lightness;

        if (particle.pos.x < 0) {
            particle.pos.x = width;
        }
        if (particle.pos.x > width) {
            particle.pos.x = 0;
        }
        if (particle.pos.y < 0) {
            particle.pos.y = height;
        }
        if (particle.pos.y > height) {
            particle.pos.y = 0;
        }

        if (particle.type === "circle") {
            ctx.beginPath();
            ctx.arc(particle.pos.x, particle.pos.y, particle.size, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}