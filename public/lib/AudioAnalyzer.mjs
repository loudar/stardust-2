export class AudioAnalyzer {
    static getFrequencyData(buffer) {
        const data = new Uint8Array(buffer.frequencyBinCount);
        buffer.getByteFrequencyData(data);
        const newData = AudioAnalyzer.adjustDataLog(data);
        let sliced = newData.slice(0, Math.floor(newData.length * 0.75));
        const average = sliced.slice(Math.floor(sliced.length * 0.5)).reduce((a, b) => a + b, 0) / sliced.length;
        if (average < 50) {
            sliced = sliced.slice(0, Math.floor(sliced.length * 0.5));
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