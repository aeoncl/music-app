<script lang="ts">
	import { player, audioPlayerStore } from '$lib/audio-player/player.store';
	import { onMount } from 'svelte';

	const isPlaying = $derived($audioPlayerStore.playing);
	const currentTrack = $derived($audioPlayerStore.track);
	
	// Default to 1st track if unknown, and assume 10 tracks if unknown
	// Adjust these angles based on the visual layout of the 3D platter
	const PARKED_ANGLE = 240;
	const OUTER_EDGE_ANGLE = 185;
	const INNER_EDGE_ANGLE = 210;

	const tonearmRotation = $derived.by(() => {
		if (!isPlaying || !currentTrack) return PARKED_ANGLE;
		
		// If we don't have track info, stay at outer edge
		if (currentTrack.track === undefined) return OUTER_EDGE_ANGLE;

		// Estimate progress across the record. 
		// Real records have about 10-20 tracks. 
		// We'll use the track number and assume a max of 12 tracks for the sweep if we don't know total.
		// A better way would be to know the total tracks in the album, but Song doesn't seem to have it.
		// We can also factor in the current track's time progress for a super smooth movement.
		
		const trackNum = currentTrack.track || 1;
		const trackProgress = $audioPlayerStore.duration > 0 
			? $audioPlayerStore.currentTime / $audioPlayerStore.duration 
			: 0;
		
		// Map track number (1-indexed) to 0-1 range. 
		// We'll assume a typical album length of 12 tracks for the visual "sweep".
		// If it's track 1, it starts at 0. If it's track 12, it's at 1.
		const totalTracksEstimate = Math.max(trackNum, 12);
		const overallProgress = (trackNum - 1 + trackProgress) / totalTracksEstimate;
		
		// Interpolate between outer and inner edge
		return OUTER_EDGE_ANGLE + (INNER_EDGE_ANGLE - OUTER_EDGE_ANGLE) * Math.min(overallProgress, 1);
	});

	// Use a faster transition when starting/stopping (parked vs playing)
	// and a slower/no transition when just progressing through the track
	const isParked = $derived(!isPlaying || !currentTrack);

	// Scratching logic
	let isScratching = $state(false);
	let vinylRotation = $state(0);
	let lastAngle = 0;
	let vinylElement: HTMLElement;

	// 33 1/3 RPM is standard. 33.33 rotations per minute = 0.555 rotations per second.
	// 1 rotation (360 deg) = ~1.8 seconds.
	const DEGREES_PER_SECOND = (33.33 * 360) / 60; // 200 degrees per second

	function getAngle(e: MouseEvent) {
		const rect = vinylElement.getBoundingClientRect();
		const center = {
			x: rect.left + rect.width / 2,
			y: rect.top + rect.height / 2
		};
		return Math.atan2(e.clientY - center.y, e.clientX - center.x) * (180 / Math.PI);
	}

	function handleMouseDown(e: MouseEvent) {
		if (!currentTrack) return;
		isScratching = true;
		lastAngle = getAngle(e);
		
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isScratching) return;
		const currentAngle = getAngle(e);
		let delta = currentAngle - lastAngle;

		// Handle wrap around
		if (delta > 180) delta -= 360;
		if (delta < -180) delta += 360;

		vinylRotation += delta;
		lastAngle = currentAngle;

		// Update playback time based on rotation delta
		// delta is in degrees.
		const timeDelta = delta / DEGREES_PER_SECOND;
		player.seek($audioPlayerStore.currentTime + timeDelta);
	}

	function handleMouseUp() {
		if (!isScratching) return;
		isScratching = false;
		
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleMouseUp);
	}

	// Update vinylRotation based on normal playback
	let lastTime = 0;
	onMount(() => {
		let frame: number;
		const update = (t: number) => {
			if (!isScratching && isPlaying) {
				const dt = (t - lastTime) / 1000;
				if (lastTime !== 0) {
					vinylRotation += dt * DEGREES_PER_SECOND;
				}
			}
			lastTime = t;
			frame = requestAnimationFrame(update);
		};
		frame = requestAnimationFrame(update);
		return () => cancelAnimationFrame(frame);
	});

</script>

<div class="turntable-container">
	<div class="turntable" class:playing={isPlaying}>
		<div class="base">
			<div class="platter-container">
				<div class="platter">
					<div 
						bind:this={vinylElement}
						class="vinyl" 
						class:interactive={!!currentTrack}
						onmousedown={handleMouseDown}
						style:transform="translateZ(2px) rotate({vinylRotation}deg)"
					>
						<div class="label" style:--label-color="var(--clr-primary-a40)"></div>
					</div>
				</div>
			</div>
			<div class="tonearm-assembly">
				<div class="tonearm-base"></div>
				<div class="tonearm" 
					class:transitioning={isParked}
					style:transform="translateZ(10px) rotate({tonearmRotation}deg)"
				>
					<div class="arm"></div>
					<div class="headshell"></div>
				</div>
			</div>
			<div class="controls">
				<div class="strobe"></div>
				<div class="start-stop"></div>
			</div>
		</div>
	</div>
</div>

<style>
	.turntable-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		perspective: 1200px;
		background: radial-gradient(circle at center, var(--clr-surface-a10) 0%, transparent 70%);
	}

	.turntable {
		position: relative;
		width: 200px;
		height: 160px;
		transform-style: preserve-3d;
		transform: rotateX(55deg) rotateZ(-30deg);
		transition: transform 0.5s ease-in-out;
	}

	.base {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #222;
		border-radius: 8px;
		box-shadow: 
			0 0 20px rgba(0,0,0,0.5),
			-5px 5px 10px rgba(0,0,0,0.3);
		transform-style: preserve-3d;
	}

	/* Base thickness */
	.base::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 20px;
		background-color: #111;
		transform: rotateX(-90deg) translateZ(-10px);
		transform-origin: top;
	}
	
	.base::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 20px;
		height: 100%;
		background-color: #1a1a1a;
		transform: rotateY(90deg) translateZ(-10px);
		transform-origin: right;
	}

	.platter-container {
		position: absolute;
		top: 15px;
		left: 15px;
		width: 130px;
		height: 130px;
		transform-style: preserve-3d;
	}

	.platter {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #333;
		border-radius: 50%;
		transform: translateZ(5px);
		box-shadow: 0 0 5px rgba(0,0,0,0.8);
		transform-style: preserve-3d;
	}

	.vinyl {
		position: absolute;
		top: 2.5%;
		left: 2.5%;
		width: 95%;
		height: 95%;
		background: 
			radial-gradient(circle at center, #111 4%, #000 4%, #000 5%, #111 5%, #111 10%, rgba(255,255,255,0.03) 10.5%, #111 11%, #111 15%, rgba(255,255,255,0.03) 15.5%, #111 16%, #111 20%, rgba(255,255,255,0.03) 20.5%, #111 21%, #111 25%, rgba(255,255,255,0.03) 25.5%, #111 26%, #111 30%, rgba(255,255,255,0.03) 30.5%, #111 31%, #111 35%, rgba(255,255,255,0.03) 35.5%, #111 36%, #111 40%, rgba(255,255,255,0.03) 40.5%, #111 41%);
		border-radius: 50%;
		box-shadow: 0 0 2px rgba(0,0,0,1);
		user-select: none;
	}

	.interactive {
		cursor: grab;
	}

	.interactive:active {
		cursor: grabbing;
	}

	.label {
		position: absolute;
		top: 35%;
		left: 35%;
		width: 30%;
		height: 30%;
		background-color: var(--label-color);
		border-radius: 50%;
		background-image: radial-gradient(circle at center, #000 10%, transparent 11%);
		pointer-events: none;
	}

	.tonearm-assembly {
		position: absolute;
		bottom: 15px;
		right: 15px;
		width: 40px;
		height: 40px;
		transform-style: preserve-3d;
	}

	.tonearm-base {
		position: absolute;
		width: 30px;
		height: 30px;
		background-color: #444;
		border-radius: 50%;
		transform: translateZ(5px);
		box-shadow: 0 0 5px rgba(0,0,0,0.5);
	}

	.tonearm {
		position: absolute;
		top: 15px;
		left: 15px;
		width: 100px;
		height: 4px;
		transform-origin: 0 50%;
		transform-style: preserve-3d;
	}

	.tonearm.transitioning {
		transition: transform 1s ease-in-out;
	}

	.arm {
		width: 100%;
		height: 100%;
		background-color: #888;
		border-radius: 2px;
		box-shadow: 0 2px 2px rgba(0,0,0,0.3);
	}

	.headshell {
		position: absolute;
		right: -5px;
		top: -2px;
		width: 15px;
		height: 8px;
		background-color: #222;
		border-radius: 2px;
	}

	.controls {
		position: absolute;
		bottom: 10px;
		left: 10px;
		display: flex;
		gap: 10px;
		transform: translateZ(2px);
	}

	.start-stop {
		width: 15px;
		height: 15px;
		background-color: #444;
		border-radius: 2px;
	}

	.playing .start-stop {
		background-color: #c00;
		box-shadow: 0 0 5px #f00;
	}
</style>
