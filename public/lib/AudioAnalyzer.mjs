export class AudioAnalyzer {
    static getFrequencyData(buffer) {
        const highCutPercentage = 0.75;
        const highCutForAverage = 0.5;

        const data = new Uint8Array(buffer.frequencyBinCount);
        buffer.getByteFrequencyData(data);
        const newData = AudioAnalyzer.adjustDataLog(data);
        let sliced = newData.slice(0, Math.floor(newData.length * highCutPercentage));
        const average = sliced.slice(Math.floor(sliced.length * highCutForAverage)).reduce((a, b) => a + b, 0) / sliced.length;
        if (average < 50) {
            window.below50 = window.below50 ? window.below50 + 1 : 1;
        } else {
            window.below50 = 0;
        }
        if (window.below50 > 50) {
            // Adjusts the frequency data to remove the high frequencies in loud parts of the song, results in a cleaner visualization
            sliced = sliced.slice(0, Math.floor(sliced.length * highCutForAverage));
        }
        return sliced;
    }

    static adjustDataLog(data) {
        return data.map((value, index) => {
            const relative = (index * 3) / data.length;
            return value * (1 + relative);
        });
    }

    static getAudioData() {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    const audioContext = new AudioContext();
                    const source = audioContext.createMediaStreamSource(stream);
                    const analyser = audioContext.createAnalyser();
                    source.connect(analyser);
                    resolve(analyser);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}