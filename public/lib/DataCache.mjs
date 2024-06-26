export function cache(key, value) {
    window.dataCache = window.dataCache ?? {};
    window.dataCache[key] = value;
}

export function getCache(key) {
    window.dataCache = window.dataCache ?? {};
    return window.dataCache[key];
}