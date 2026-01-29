<script lang="ts">
	import { audioPlayerStore } from '$lib/audio-player/player.store';

	let { text }: { text: string } = $props();

	// We use a derived value to calculate the gradient based on frequencies
	let gradientStyle = $derived.by(() => {
		const frequencies = $audioPlayerStore.frequencies;
		if (frequencies.length === 0) {
			return 'linear-gradient(90deg, var(--clr-primary-a20), var(--clr-primary-a40))';
		}

		// Take a few samples from the frequency data to create color stops
		// We'll map frequency intensity to color brightness or shift
		const numStops = 5;
		const stops = [];
		const step = Math.floor(frequencies.length / numStops);

		for (let i = 0; i < numStops; i++) {
			const value = frequencies[i * step] || 0;
			const percent = (i / (numStops - 1)) * 100;
			
			// Primary colors from app.css:
			// --clr-primary-a0: #691dcc;
			// --clr-primary-a20: #9155d9;
			// --clr-primary-a40: #b385e5;
			
			// We can interpolate between a darker purple and a lighter one based on frequency
			const hue = 260 + (value / 255) * 40; // Shift from purple to more pinkish
			const saturation = 60 + (value / 255) * 40;
			const lightness = 40 + (value / 255) * 40;
			
			stops.push(`hsl(${hue}, ${saturation}%, ${lightness}%) ${percent}%`);
		}

		return `linear-gradient(90deg, ${stops.join(', ')})`;
	});

    // Alternatively, we can animate the background-size or position based on average frequency
    let avgFrequency = $derived.by(() => {
        const frequencies = $audioPlayerStore.frequencies;
        if (frequencies.length === 0) return 0;
        const sum = frequencies.reduce((a, b) => a + b, 0);
        return sum / frequencies.length;
    });

    let backgroundSize = $derived(`${100 + (avgFrequency / 255) * 100}% 100%`);
    let backgroundPosition = $derived(`${(avgFrequency / 255) * 100}% center`);
</script>

<span 
    class="frequency-gradient-text" 
    style:background-image={gradientStyle}
    style:background-size={backgroundSize}
    style:background-position={backgroundPosition}
>
	{text}
</span>

<style>
	.frequency-gradient-text {
		font-weight: bold;
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
		transition: background-image 0.1s linear, background-size 0.1s linear, background-position 0.1s linear;
        display: inline-block;
        background-color: var(--clr-primary-a20); /* Fallback */
        background-repeat: no-repeat;
	}
</style>
