import {StardustRenderer} from "./lib/StardustRenderer.mjs";
import {FjsObservable} from "@targoninc/fjs";
import {VisualizerState} from "./lib/VisualizerState.mjs";
import {KeyboardHandler} from "./lib/KeyboardHandler.mjs";

const domNodeId = "renderer";
const uiNodeId = "ui";
const visualizerState = new FjsObservable(new VisualizerState());
const renderer = new StardustRenderer(domNodeId, uiNodeId);
renderer.render(visualizerState);

const keyboardHandler = new KeyboardHandler(visualizerState);
document.addEventListener("keydown", keyboardHandler.handleKeyDown.bind(keyboardHandler));
