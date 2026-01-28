import { writable, type Readable } from 'svelte/store';
import type { Song } from '../../routes/(content)/albums/[albumId]/+page';
import {
	PUBLIC_NAVIDROME_TOKEN,
	PUBLIC_NAVIDROME_URL,
	PUBLIC_NAVIDROME_USER
} from '$env/static/public';

type PlayerState = {
	track: Song | null;
	playing: boolean;
	currentTime: number; // seconds
	duration: number; // seconds (from audio element when available)
	ready: boolean;
};

export const playerState = writable<PlayerState>({
	track: null,
	playing: false,
	currentTime: 0,
	duration: 0,
	ready: false
});

let audio: HTMLAudioElement | null = null;

function requireAudio() {
	if (!audio) throw new Error('Player audio element is not attached yet.');
	return audio;
}

export const player = {
	attach(el: HTMLAudioElement) {
		// attach only once; if layout re-renders, keep the first element
		if (audio && audio !== el) return;

		audio = el;
		audio.preload = 'none';
		audio.crossOrigin = 'anonymous';

		const updateTime = () => playerState.update((s) => ({ ...s, currentTime: audio!.currentTime }));
		const updateDuration = () =>
			playerState.update((s) => ({
				...s,
				duration: Number.isFinite(audio!.duration) ? audio!.duration : s.duration
			}));

		audio.addEventListener('timeupdate', updateTime);
		audio.addEventListener('durationchange', updateDuration);
		audio.addEventListener('loadedmetadata', updateDuration);
		audio.addEventListener('play', () => playerState.update((s) => ({ ...s, playing: true })));
		audio.addEventListener('pause', () => playerState.update((s) => ({ ...s, playing: false })));
		audio.addEventListener('ended', () => playerState.update((s) => ({ ...s, playing: false })));

		playerState.update((s) => ({ ...s, ready: true }));
	},

	async play(song: Song) {
		const a = requireAudio();

		let url = `${PUBLIC_NAVIDROME_URL}/stream?u=${PUBLIC_NAVIDROME_USER}&t=${PUBLIC_NAVIDROME_TOKEN}&s=56228e&format=json&v=1.8.0&c=NavidromeUI&id=${song.id}&format=mp3`;

		// Avoid restarting if it's the same URL and already playing
		const same = a.src === url || a.currentSrc === url;

		playerState.update((s) => ({
			...s,
			track: song,
			duration: song.duration ?? s.duration
		}));

		if (!same) {
			a.src = url;
			a.currentTime = 0;
		}

		await a.play();
	},

	pause() {
		requireAudio().pause();
	},

	async toggle() {
		const a = requireAudio();
		if (a.paused) await a.play();
		else a.pause();
	},

	seek(seconds: number) {
		const a = requireAudio();
		a.currentTime = Math.max(0, seconds);
		playerState.update((s) => ({ ...s, currentTime: a.currentTime }));
	}
};