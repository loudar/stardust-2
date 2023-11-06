import {StardustRenderer} from "./lib/StardustRenderer.mjs";
import {FjsObservable} from "https://fjs.targoninc.com/f.js";
import {VisualizerState} from "./lib/VisualizerState.mjs";
import {KeyboardHandler} from "./lib/KeyboardHandler.mjs";

const domNodeId = "renderer";
const visualizerState = new FjsObservable(new VisualizerState());
const renderer = new StardustRenderer(domNodeId);
renderer.render(visualizerState);

const keyboardHandler = new KeyboardHandler(visualizerState);
document.addEventListener("keydown", keyboardHandler.handleKeyDown.bind(keyboardHandler));
