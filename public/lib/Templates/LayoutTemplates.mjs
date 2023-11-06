import { FJS } from 'https://fjs.targoninc.com/f.js';

export class LayoutTemplates {
    static grid(rows, columns, children) {
        return FJS.create("div").classes("grid")
    }
}