export class Color {
    static rainbow(value, lightness) {
        if (value < 0) {
            value += 1;
        }
        let h = value * 360;
        h = h % 360;
        const Lpercent = lightness * 100;
        return `hsl(${h}, 100%, ${Lpercent}%)`;
    }
}