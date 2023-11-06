export class AudioAnalyzer {
    static getFrequencyData(buffer) {
        const data = new Uint8Array(buffer.frequencyBinCount);
        buffer.getByteFrequencyData(data);
        const newData = AudioAnalyzer.adjustDataLog(data);
        const mode = AudioAnalyzer.getFrequencyMode(newData);
        switch (mode) {
        case "high":
            return newData.slice(newData.length / 2);
        case "low":
            return newData.slice(0, newData.length / 2);
        default:
            return newData;
        }
    }

    static getFrequencyMode(data) {
        const averageUpperHalf = data.slice(data.length / 2).reduce((acc, value) => acc + value, 0) / (data.length / 2);
        const averageLowerHalf = data.slice(0, data.length / 2).reduce((acc, value) => acc + value, 0) / (data.length / 2);
        if (averageUpperHalf > averageLowerHalf) {
            return "high";
        } else {
            return "low";
        }
    }

    static adjustDataLog(data) {
        return data.map((value, index) => {
            const relative = index / data.length;
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