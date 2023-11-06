export class AudioAnalyzer {
    static getFrequencyData(buffer) {
        const data = new Uint8Array(buffer.frequencyBinCount);
        buffer.getByteFrequencyData(data);
        return AudioAnalyzer.adjustDataLog(data);
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