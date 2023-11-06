export class Color {
    static rainbow(value, lightness) {
        const h = value * 360;
        const Lpercent = lightness * 100;
        return `hsl(${h}, 100%, ${Lpercent}%)`;
    }
}