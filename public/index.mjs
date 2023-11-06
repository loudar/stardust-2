import {StardustRenderer} from "./lib/StardustRenderer.mjs";
import {FjsObservable} from "https://fjs.targoninc.com/f.js";
import {VisualizerState} from "./lib/VisualizerState.mjs";

const domNodeId = "renderer";
const visualizerState = new FjsObservable(new VisualizerState());
const renderer = new StardustRenderer(domNodeId);
renderer.render(visualizerState);