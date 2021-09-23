// helpers.js
// (function (window, document) {

console.log('hello from the helpers');

class canvasHelpers {
	constructor (ctx, canvasElement) {
		this.scopeContext = ctx;
		this.scopeCanvas = canvasElement; 
		this.height = this.scopeCanvas.height;
		this.width = this.scopeCanvas.width;
	}

	set height (h) {

	}

	resize (width, height) {
		this.scopeCanvas.width = width;
		console.log('did resize')
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
				// const width = this.scopeCanvas.width;
				// const height = this.scopeCanvas.height;
				ctx.clearRect(0, 0, that.scopeCanvas.width, that.scopeCanvas.height)
				ctx.beginPath()
				let circle = [0], circle_i = 0;
				for (let i = 0; i < waveform.length; i++) {
					const lineColor = `rgba(
						${Math.floor((waveform[i]))}, 
						${Math.floor((waveform[i]))}, 
						${Math.floor((parseInt(circle[circle_i], 10)))}, 
						${0.5}
					)`;
					ctx.strokeStyle = '#fff'; // lineColor; // `rgba(${Math.floor(waveform[i]%200)}, ${Math.floor(waveform[i]%200)}, ${Math.floor(circle[circle_i]%200)}, ${0.5})`;
					const x = i
					const y = (0.5 + waveform[i] / 2) * that.scopeCanvas.height;
					if (i == 0) {
						ctx.moveTo(x, y)
					} else {
						ctx.lineTo(x, y)
					}
					// levelDisplay.innerHtml = waveform[0];
					// out of phase by 1/4 subroutine
					if (i === (waveform.length/4)) {
						ctx.font = '50px serif'; that.drawText(waveform[0], 50, 90);
						// deal with circular buffer
						circle_i = circle_i === 1024 ? 0 : circle_i + 1;
						if (waveform[i]) {
					// console.log(lineColor);
							circle[circle_i] = waveform[i];
						}
					}
				}
				ctx.stroke()

				// calculate and draw rms
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
