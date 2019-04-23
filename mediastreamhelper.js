const CHROME_EXTENSION_ID = "kagiblbfckpnedpcngpgbjnefcnljlef";

export class MediaStreamHelper {

    constructor() {}

    static detectExtension() {
        const promise = new Promise(function(resolve, reject) {
            chrome.runtime.sendMessage(CHROME_EXTENSION_ID, { command: "init" }, (res) => {
                if (chrome.runtime.lastError) {
                    reject();
                } else {
                    (res && res.id === CHROME_EXTENSION_ID) ? resolve() : reject();
                }
            });
        });
        return promise;
    }

    /**
     * wrapper
     * @param  {Object | boolean} video
     * @param  {Object | boolean} audio
     * @return {Promise<MediaStream>}
     */
    static getDisplayMedia(video, audio) {

        if (!!navigator.mediaDevices.getDisplayMedia) {

            const constraints = {
                video: video,
                audio: audio
            };
            return navigator.mediaDevices.getDisplayMedia(constraints);

        } else if (!!navigator.getDisplayMedia) {

            const constraints = {
                video: video,
                audio: audio
            };
            return navigator.getDisplayMedia(constraints);

        } else if (!!navigator.mediaDevices.getUserMedia) {

            const constraints = {
                video: (video === true) ? { mediaSource: 'window' } : video,
                audio: audio
            };
            return navigator.mediaDevices.getUserMedia(constraints);
        }
    }

    /**
     * wrapper
     * @param  Array<string>      sources
     *         array of DesktopCaptureSourceType ("screen", "window", "tab", or "audio")
     * @return {Promise<MediaStream>}
     */
    static getDisplayMediaExtension(sources) {
        const promise = new Promise(function(resolve, reject) {
            chrome.runtime.sendMessage(CHROME_EXTENSION_ID, {
                command: "capture",
                sources: sources
            }, function(res) {
                const constraints = {
                    audio: sources.includes("audio"),
                    video: {
                        'mandatory': {
                            'chromeMediaSource': 'desktop',
                            'chromeMediaSourceId': res.streamId
                        }
                    },
                };
                resolve(navigator.mediaDevices.getUserMedia(constraints));
            });
        });
        return promise;
    }
}
