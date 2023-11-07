export class Color {
    static rainbow(value, lightness, is3D = false) {
        if (value < 0) {
            value += 1;
        }
        let h = value * 360;
        h = h % 360;
        const Lpercent = lightness * 100;
        if (is3D) {
            const [r, g, b] = Color.rgbFromHsl(h, 100, Lpercent);
            return 0x1000000 + r * 0x10000 + g * 0x100 + b;
        } else {
            return `hsl(${h}, 100%, ${Lpercent}%)`;
        }
    }

    static rgbFromHsl(h, s, l) {
        s /= 100;
        l /= 100;
        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c/2,
            r = 0,
            g = 0,
            b = 0;
        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return [r, g, b];
    }
}