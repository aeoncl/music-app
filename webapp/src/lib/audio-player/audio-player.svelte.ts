import type { Song } from '../../routes/(content)/albums/[albumId]/+page';
import type { AudioBackend } from './audio-backend';
import { getContext, setContext } from 'svelte';
import {
	AudioQueue,
	getAudioQueue,
	getPriorityAudioQueue
} from '$lib/audio-player/audio-queue.svelte';

type NowPlayingState = {
	track: Song | null;
	playing: boolean;
	currentTime: number;
	duration: number;
};

class AudioPlayer {
	public mainQueue;
	public priorityQueue;

	constructor(mainQueue: AudioQueue, priorityQueue: AudioQueue) {
		this.mainQueue = mainQueue;
		this.priorityQueue = priorityQueue;
	}

	public nowPlaying = $state<NowPlayingState>({
		playing: false,
		track: null,
		currentTime: 0,
		duration: 0
	});

	private backend: AudioBackend | null = null;

	attach(audioBackend: AudioBackend): void {
		if (this.backend && this.backend !== audioBackend) return;
		this.backend = audioBackend;

		// Subscribe to backend events and update store
		this.backend.addEventListener('timeupdate', (currentTime) => {
			this.nowPlaying.currentTime = currentTime;
		});

		this.backend.addEventListener('durationchange', (duration) => {
			this.nowPlaying.duration = duration;
		});

		this.backend.addEventListener('play', () => {
			this.nowPlaying.playing = true;
		});

		this.backend.addEventListener('pause', () => {
			this.nowPlaying.playing = false;
		});

		this.backend.addEventListener('trackchange', (track) => {
			console.log('trackchange', track);
			this.nowPlaying.track = track;
			this.nowPlaying.duration = track.duration;
		});

		this.backend.addEventListener('ended', () => {
			this.playNext();
		});
	}

	private requireBackend(): AudioBackend {
		if (!this.backend) throw new Error('Player audio backend is not attached yet.');
		return this.backend;
	}

	play(song: Song): void {
		this.requireBackend().play(song);
	}

	playNext(): void {
		let song = this.priorityQueue.dequeue();
		if (!song) song = this.mainQueue.dequeue();

		if (song) {
			this.requireBackend().play(song);
		} else {
			this.nowPlaying = { track: null, playing: false, currentTime: 0, duration: 0 };
			this.requireBackend().clear();
		}
	}

	skip(): void {
		this.playNext();
	}

	back(): void {
		//const previous = queue.previous();
		//if (previous) {
		//	this.requireBackend().play(previous);
		//}
	}

	pause(): void {
		this.requireBackend().pause();
	}

	toggle(): void {
		this.requireBackend().toggle();
	}

	seek(seconds: number): void {
		this.requireBackend().seek(seconds);
	}
}

const DEFAULT_KEY = '$_audio_player';

export const getAudioPlayer = (key = DEFAULT_KEY): AudioPlayer => {
	return getContext<AudioPlayer>(key);
};

export const setAudioPlayer = (key = DEFAULT_KEY): AudioPlayer => {
	const mainQueue = getAudioQueue();
	const priorityQueue = getPriorityAudioQueue();

	const player = new AudioPlayer(mainQueue, priorityQueue);
	return setContext(key, player);
};
