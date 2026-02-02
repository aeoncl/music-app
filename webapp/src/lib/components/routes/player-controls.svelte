<script lang="ts">
	import { getAudioPlayer } from '$lib/audio-player/audio-player.svelte';
	import { durationToString } from '$lib';
	import type { Attachment } from 'svelte/attachments';

	let audioPlayer = getAudioPlayer();

	let isDragging = $state(false);
	let dragPercent = $state(0);



	let progress = $derived.by(() => {
		if (isDragging) return dragPercent;
		const duration = audioPlayer.nowPlaying.duration || audioPlayer.nowPlaying.track?.duration || 0;
		if (duration <= 0) return 0;
		return Math.max(0, Math.min(1, audioPlayer.nowPlaying.currentTime / duration));
	});

	const timelineDrag: Attachment = (node) => {
		const element = node as HTMLElement;

		function getPercent(e: PointerEvent) {
			const rect = element.getBoundingClientRect();
			return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
		}

		function onPointerDown(e: PointerEvent) {
			if (e.button !== 0) return;

			isDragging = true;
			dragPercent = getPercent(e);
			element.setPointerCapture(e.pointerId);

			const onMove = (ev: PointerEvent) => {
				dragPercent = getPercent(ev);
			};

			const onUp = (ev: PointerEvent) => {
				isDragging = false;
				element.removeEventListener('pointermove', onMove);
				element.removeEventListener('pointerup', onUp);
				element.removeEventListener('pointercancel', onUp);

				const duration = audioPlayer.nowPlaying.duration || audioPlayer.nowPlaying.track?.duration || 0;
				if (duration > 0) {
					audioPlayer.seek(duration * getPercent(ev));
				}
			};

			element.addEventListener('pointermove', onMove);
			element.addEventListener('pointerup', onUp);
			element.addEventListener('pointercancel', onUp);
		}

		element.addEventListener('pointerdown', onPointerDown);

		return () => {
			element.removeEventListener('pointerdown', onPointerDown);
		};
	};
</script>

<div class="player-controls-container">
	<div class="controls">
		<button>🔀</button>
		<button onclick={() => audioPlayer.back()}>⏮</button>
		<button class="play" onclick={() => audioPlayer.toggle()}>
			{audioPlayer.nowPlaying.playing ? '⏸' : '▶︎'}
		</button>
		<button onclick={() => audioPlayer.skip()} >⏭</button>
		<button>🔂</button>
	</div>

	<span>{durationToString(audioPlayer.nowPlaying.currentTime)}</span>

	<div class="timeline" class:dragging={isDragging} {@attach timelineDrag}>
		<div class="bar-empty"></div>
		<div class="bar" style:width="{progress * 100}%"></div>
		<div class="ball" style:left="{progress * 100}%"></div>
	</div>
</div>

<style lang="css">
	.player-controls-container {
		user-select: none;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.controls {
		display: flex;
		justify-content: center;
		gap: 1em;
		padding: 0.5em;
		width: 10vw;
	}

	.controls button {
		cursor: pointer;
		padding: 0.1em;
		color: var(--clr-surface-a50);
		transition:
			color 0.1s ease-in,
			scale 0.1s ease-in;
		scale: 1;
	}

	.controls button:hover {
		color: var(--clr-light-a0);
		scale: 1.1;
	}

	.controls button:active {
		color: var(--clr-surface-a50);
		scale: 0.9;
	}

	.controls .play {
		font-size: 16pt;
	}

	.timeline {
		position: relative;
		width: 30vw;
		height: 20px;
		cursor: pointer;
	}

	.bar-empty {
		position: absolute;
		top: 50%;
		height: 5px;
		width: 100%;
		transform: translateY(-50%);
		background-color: var(--clr-surface-a20);
		text-align: center;
		z-index: 1;
	}

	.bar {
		position: absolute;
		background-color: var(--clr-light-a0);
		transform: translateY(-50%);
		top: 50%;
		height: 6px;
		width: 5%;
		z-index: 2;
	}

	.ball {
		position: absolute;
		visibility: hidden;
		background-color: var(--clr-light-a0);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		top: 50%;
		left: 5%;
		height: 12px;
		width: 12px;
		z-index: 2;
	}

	.timeline:hover .bar,
	.timeline.dragging .bar {
		background-color: var(--clr-primary-a0);
	}

	.timeline:hover .ball,
	.timeline.dragging .ball {
		visibility: visible;
	}
</style>
