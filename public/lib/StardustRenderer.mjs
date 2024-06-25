import {AudioAnalyzer} from "./AudioAnalyzer.mjs";
import {StardustTemplates} from "./Templates/StardustTemplates.mjs";
import {StardustUiRenderer} from "./StardustUiRenderer.mjs";

export class StardustRenderer {
    domNode = null;
    uiNode = null;
    rendering = false;
    skippedFrames = 0;

    constructor(domNodeId, uiNodeId) {
        const domNode = document.getElementById(domNodeId);
        if (!domNode) {
            throw new Error(`DOM node with id ${domNodeId} not found`);
        }
        this.domNode = domNode;
        this.uiRenderer = new StardustUiRenderer(uiNodeId);
    }

    render(visualizerState) {
        this.initializeVisualization(visualizerState);
        this.uiRenderer.initialize(visualizerState);
    }

    initializeVisualization(visualizerState) {
        AudioAnalyzer.getAudioData()
            .then(analyser => {
                visualizerState.value = {
                    ...visualizerState.value,
                    dataSource: analyser
                };
                this.renderFrame(visualizerState);
            })
            .catch(err => console.error(err));
    }

    /**
     *
     * @param visualizerState {FjsObservable<VisualizerState>}
     */
    renderFrame(visualizerState) {
        requestAnimationFrame(() => this.renderFrame(visualizerState));
        if (this.rendering) {
            console.log("Skipping frame");
            this.skippedFrames++;
            return;
        }
        this.rendering = true;
        visualizerState.value = {
            ...visualizerState.value,
            data: AudioAnalyzer.getFrequencyData(visualizerState.value.dataSource)
        };
        this.renderVisualFrame(visualizerState.value);
        this.rendering = false;
    }

    renderVisualFrame(visualizerState) {
        const frame = document.getElementById("frame");
        const newFrame = StardustTemplates.frame(visualizerState);
        if (frame) {
            this.domNode.replaceChild(newFrame, frame);
        } else {
            this.domNode.appendChild(newFrame);
        }
    }
}