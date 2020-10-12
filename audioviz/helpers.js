// helpers.js
// (function (window, document) {
const create = (tagName) => document.createElement(tagName);

	console.log('hello from the helpers');
	class AudioPlayer {
		/*
		 *
		 *
		 * Creates an maintains an audio buffer with UI
		 */
		constructor (audioContext) {
			this.audioCtx = audioContext;


		}

		createHTML () {
			// container
			const c = create('div');

			const createFileInput () => {
				const fileSelector = create('input');
				fileSelector.setAttribute('type', 'file');
				fileSelector.setAttribute('id', 'file-selector');
			}
			const fileSelector = createFileInput();



		}

	}

	class canvasHelpers {
		constructor (canvasElement) {


			// scopeCanvas.width = waveform.length
			// scopeCanvas.height = 200

			this.scopeContext = canvasElement.getContext('2d');
			console.log(this.scopeCanvas);
			
			this.scopeCanvas = canvasElement;
		}

		drawText (text, x, y) {
			const xOffset = -20, yOffset = 30
			this.scopeContext.strokeText(text, x, y);
			this.scopeContext.fillText(text, x + xOffset, y + yOffset);
		}

		drawLine (val, x, y) {
			this.scopeContext.beginPath()
			this.scopeContext.moveTo(x, y);
			this.scopeContext.lineTo(x + (500 * val), y)
		  this.scopeContext.stroke()
		}

		drawOscilloscope (waveform) {
			const that = this;
			;(function (ctx) {
				;(function drawOscilloscope() {
					requestAnimationFrame(drawOscilloscope)
					ctx.clearRect(0, 0, that.scopeCanvas.width, that.scopeCanvas.height)
					ctx.beginPath()
					let circle = [0], circle_i = 0;
					for (let i = 0; i < waveform.length; i++) {
						ctx.strokeStyle = `rgba(${waveform[i]}, ${waveform[i]}, ${circle[circle_i]}, ${0.5})`;
					  const x = i
					  const y = (0.5 + waveform[i] / 2) * that.scopeCanvas.height;
					  if (i == 0) {
					    ctx.moveTo(x, y)
					  } else {
					    ctx.lineTo(x, y)
					  }
					  // levelDisplay.innerHtml = waveform[0];
						if (i === (waveform.length/4)) {
							ctx.font = '50px serif';
							that.drawText(waveform[0], 50, 90);
							circle_i = circle_i === 1024 ? 0 : circle_i + 1;
							if(waveform[i]) {
								circle[circle_i] = waveform[i];
							}
						}
					}
					ctx.stroke()

					const rms = Math.sqrt(circle
						// .map((x) => x + 0.5)
						.reduce((acc, val) => acc + val)
						/ circle.length
					);
					that.drawText(rms,  300, 150);
					that.drawLine(rms, 50, 0);	
				})();
			})(this.scopeContext);	
		}
	}
