import {AudioAnalyzer} from "./AudioAnalyzer.mjs";
import {StardustTemplates} from "./Templates/StardustTemplates.mjs";

export class StardustRenderer {
    domNode = null;
    rendering = false;

    constructor(domNodeId) {
        const domNode = document.getElementById(domNodeId);
        if (!domNode) {
            throw new Error(`DOM node with id ${domNodeId} not found`);
        }
        this.domNode = domNode;
    }

    render(visualizerState) {
        this.initializeVisualization(visualizerState);
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
        this.domNode.innerHTML = "";
        this.domNode.appendChild(StardustTemplates.frame(visualizerState));
    }
}