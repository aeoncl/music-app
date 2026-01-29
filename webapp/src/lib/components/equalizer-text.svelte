<script lang="ts">
	import { audioPlayerStore } from '$lib/audio-player/player.store';
	import { onMount } from 'svelte';

	let { text }: { text: string } = $props();

	let canvas: HTMLCanvasElement;
	let container: HTMLElement;
	let letters = $derived(text.split(''));

	function getScale(index: number, frequencies: Uint8Array) {
		if (frequencies.length === 0) return 1;
		const startBin = 2;
		const endBin = frequencies.length - 2;
		const range = endBin - startBin;
		const bin = startBin + Math.floor((index / letters.length) * range);
		const value = frequencies[bin] || 0;
		// Reduce multiplier to make movement more subtle
		return 1 + (value / 255) * 0.4;
	}

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let frame: number;

		const render = () => {
			const frequencies = $audioPlayerStore.frequencies;
			const style = getComputedStyle(container);
			const font = style.font;
			const color = style.color;
			const textShadow = style.textShadow;

			ctx.font = font;
			const metrics = ctx.measureText(text);
			const width = Math.ceil(metrics.width);
			const height = parseInt(style.lineHeight) || parseInt(style.fontSize) * 1.2;

			// Add padding to prevent clipping of animation and shadows
			const paddingX = 20; // For horizontal glow
			const paddingY = 20; // For vertical animation and glow
			const totalWidth = width + paddingX * 2;
			const totalHeight = height + paddingY * 2;

			if (canvas.width !== totalWidth * devicePixelRatio || canvas.height !== totalHeight * devicePixelRatio) {
				canvas.width = totalWidth * devicePixelRatio;
				canvas.height = totalHeight * devicePixelRatio;
				canvas.style.width = `${totalWidth}px`;
				canvas.style.height = `${totalHeight}px`;
				canvas.style.left = `-${paddingX}px`;
				canvas.style.top = `-${paddingY/1.5}px`;
				container.style.width = `${width}px`;
				container.style.height = `${height}px`;
				container.style.display = 'inline-flex';
				ctx.scale(devicePixelRatio, devicePixelRatio);
				ctx.font = font;
				ctx.textBaseline = 'alphabetic';
			}

			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.restore();

			// Handle neon glow if present
			if (textShadow && textShadow !== 'none') {
				const shadowMatch = textShadow.match(/(-?\d+px)\s+(-?\d+px)\s+(\d+px)\s+(.+)/);
				if (shadowMatch) {
					ctx.shadowOffsetX = 0;
					ctx.shadowOffsetY = 0;
					ctx.shadowBlur = parseInt(shadowMatch[3]);
					ctx.shadowColor = shadowMatch[4];
				}
			} else {
				ctx.shadowBlur = 0;
			}

			ctx.fillStyle = color;

			let x = paddingX;
			letters.forEach((letter, i) => {
				const char = letter === ' ' ? '\u00A0' : letter;
				const charWidth = ctx.measureText(char).width;
				const scale = getScale(i, frequencies);
				
				// To make the baseline be at the middle of the frequencies, 
				// we center the scaling around the baseline.
				// Since ctx.scale(1, scale) at the baseline makes it grow UP and DOWN
				// proportionally to its original height above/below the baseline,
				// if we want it to jump UP and DOWN equally from the baseline,
				// we can use a small Y offset.
				// However, if "baseline is at the middle" means the text itself is 
				// jumping around its center, we need to adjust the origin.
				
				const scaleAmount = scale - 1;
				// This offset balances the vertical growth around the baseline.
				// By moving it down by 3px when scale is 1.4 (max), we counteract the 
				// tendency of the scaling to only expand upwards from the baseline.
				const yOffset = scaleAmount * 7.5; 

				ctx.save();
				const baselineOffset = paddingY + (height * 0.75);
				ctx.translate(x + charWidth / 2, baselineOffset); 
				ctx.scale(1, scale);
				ctx.translate(0, -yOffset); // Move relative to the scaled coordinate system
				ctx.fillText(char, -charWidth / 2, 0);
				ctx.restore();

				x += charWidth;
			});

			frame = requestAnimationFrame(render);
		};

		frame = requestAnimationFrame(render);
		return () => cancelAnimationFrame(frame);
	});
</script>

<span class="equalizer-text-container" bind:this={container}>
	<canvas bind:this={canvas}></canvas>
	<span class="sr-only">{text}</span>
</span>

<style>
	.equalizer-text-container {
		display: inline-flex;
		vertical-align: baseline;
		line-height: 1.2;
		position: relative;
	}
	canvas {
		position: absolute;
		display: block;
		pointer-events: none;
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
