export class AudioAnalyzer {
    static getFrequencyData(buffer) {
        const highCutPercentage = 0.75;
        const highCutForAverage = 0.5;

        const data = new Uint8Array(buffer.frequencyBinCount);
        buffer.getByteFrequencyData(data);
        const newData = AudioAnalyzer.adjustDataLog(data);
        let highCut = AudioAnalyzer.highCutData(newData, highCutPercentage);
        const currentAverage = AudioAnalyzer.getAverageOfFrequencyData(highCut, highCutForAverage);
        //AudioAnalyzer.cacheFrequencyData(newData);
        if (currentAverage < 50) {
            window.below50 = window.below50 ? window.below50 + 1 : 1;
        } else {
            window.below50 = 0;
        }
        if (window.below50 > 50) {
            // Adjusts the frequency data to remove the high frequencies in loud parts of the song, results in a cleaner visualization
            highCut = highCut.slice(0, Math.floor(highCut.length * highCutForAverage));
        }
        return highCut;
    }

    static averageOfLast(count = 100) {
        if (!window.frequencyDataCache) {
            return 0;
        }
        const averages = window.frequencyDataCache.map(data => {
            let highCut = AudioAnalyzer.highCutData(data, 0.75);
            return AudioAnalyzer.getAverageOfFrequencyData(highCut, count);
        });
        return averages.reduce((a, b) => a + b, 0) / averages.length;
    }

    static highCutData(data, cutAt = 0.75) {
        return data.slice(0, Math.floor(data.length * cutAt));
    }

    static getAverageOfFrequencyData(data, highCutAt = 0.5) {
        const cut = AudioAnalyzer.highCutData(data, highCutAt);
        return cut.reduce((a, b) => a + b, 0) / data.length;
    }

    static cacheFrequencyData(data) {
        if (!window.frequencyDataCache) {
            window.frequencyDataCache = [];
        }
        window.frequencyDataCache.push(data);
        if (window.frequencyDataCache.length > 100) {
            window.frequencyDataCache.shift();
        }
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