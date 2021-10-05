
(function(window, document) {
    function audioEnviornment (audioContext) {
        //
        // Methods
        //
        /**
            * @param AudioBuffer
            * returns AudioSourceNode
            */
        const createNewAudioBufSource = (audioFileBuffer) => {
            const audioDestinationArray = new Float32Array(
                audioFileBuffer.numberOfChannels 
                * audioFileBuffer.duration
                * audioFileBuffer.sampleRate
            );
            audioFileBuffer.copyFromChannel(audioDestinationArray, 0);
            const bufSource = audioContext.createBufferSource();
            bufSource.buffer = audioFileBuffer;
            return bufSource;
        }

        /**
         * 
         * @param {*} audioBuffer 
         * @param {*} destination 
         * @returns event function
         */
        const plug = (audioBuffer, destination) => (event) => {
            event.preventDefault();
            audioBuffer.connect(destination);
            audioBuffer.start();
        }

        const unplug = (audioBuffer) => (event) => {
            event.preventDefault();
            audioBuffer.stop(); audioBuffer.disconnect();	
            delete audioBuffer.buffer; delete audioBuffer;
            audioBufSource = createNewAudioBufSource(audioFileSource);
        }

        function getArrayBuffer(fileList) {
                const firstFile = fileList[0];
                return await firstFile.arrayBuffer();
        }

        function decodeAudioFile (fileList) {
            const buffer = await getArrayBuffer(event.target.files);
            const audioFileSource = await audioContext.decodeAudioData(buffer)

            console.log('audioFileSource', audioFileSource)
            let audioBufSource = createNewAudioBufSource(audioFileSource);
            console.log({firstFile, fileList, buffer, audioFileSource, audioBufSource});
            return audioBufSource;


        }

        /**
         * called by file input's change event
         */
        function loadSound(masterGain) {
            const startButton = document.getElementsByClassName('start')[0]
            const stopButton = document.getElementsByClassName('stop')[0]


            return async (event) => {

                let audioBufSource = decodeAudioFile(event.target.files);
                console.log({firstFile, fileList, buffer, audioFileSource, audioBufSource});

                addLog(`Loaded file: ${firstFile.name}`);

                startButton.addEventListener('click', plug(audioBufSource, masterGain));
                stopButton.addEventListener('click', unplug(audioBufSource));

                const slider = document.getElementById("myRange");
                var output = document.getElementById("demo");

                output.innerHTML = slider.value;
                slider.oninput = function() {
                    const val = (this.value/100) * 3;
                    output.innerHTML = val;
                    audioBufSource.playbackRate = val;
                }

                const analyser = audioContext.createAnalyser();
                masterGain.connect(analyser);

                const waveform = new Float32Array(analyser.frequencyBinCount);
                analyser.getFloatTimeDomainData(waveform);

                //
                // Canvas functions
                // 
                ;(function updateWaveform() {
                    requestAnimationFrame(updateWaveform)
                    analyser.getFloatTimeDomainData(waveform)
                })()

                const scopeContainer = document.getElementById('vizualizer')
                const scopeCanvas = document.getElementById('oscilloscope')
                // scopeCanvas.scrollHeight
                scopeCanvas.width = waveform.length
                scopeCanvas.height = 200
                const scopeContext = scopeCanvas.getContext('2d');

                const canHlp = new canvasHelpers(scopeContext, scopeCanvas);
                canHlp.drawOscilloscope(waveform);

                window.addEventListener('resize', e => {
                    // console.log('resize event', e, window.innerWidth, window.innerHeight);
                    canHlp.resize(scopeContainer.offsetWidth, scopeContainer.offsetHeight);
                });
            }
        }

        return {
            loadSound,
        }
    };
    window.audioEnviornment = audioEnviornment;
})(window, document);
