import { writable, get } from 'svelte/store';
import type { Song } from '../../routes/(content)/albums/[albumId]/+page';
import type { AudioBackend } from './audio-backend';
import { queue } from './queue.store';

type PlayerState = {
	track: Song | null;
	playing: boolean;
	currentTime: number;
	duration: number;
};

export const audioPlayerStore = writable<PlayerState>({
	track: null,
	playing: false,
	currentTime: 0,
	duration: 0
});

class AudioPlayer {
	private backend: AudioBackend | null = null;

	attach(audioBackend: AudioBackend): void {
		if (this.backend && this.backend !== audioBackend) return;
		this.backend = audioBackend;

		// Subscribe to backend events and update store
		this.backend.addEventListener('timeupdate', (currentTime) => {
			audioPlayerStore.update((s) => ({ ...s, currentTime }));
		});

		this.backend.addEventListener('durationchange', (duration) => {
			audioPlayerStore.update((s) => ({ ...s, duration }));
		});

		this.backend.addEventListener('play', () => {
			audioPlayerStore.update((s) => ({ ...s, playing: true }));
		});

		this.backend.addEventListener('pause', () => {
			audioPlayerStore.update((s) => ({ ...s, playing: false }));
		});

		this.backend.addEventListener('trackchange', (track) => {
			console.log('trackchange', track);
			audioPlayerStore.update((s) => ({ ...s, track, duration: track.duration }));
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
		this.requireBackend().play(song)
	}

	enqueue(song: Song): void {
		queue.enqueue(song);
		const state = get(audioPlayerStore);
		if (!state.playing && !state.track) {
			this.playNext();
		}
	}

	playNext(): void {
		const song = queue.next();
		if (song) {
			this.requireBackend().play(song);
		} else {
			audioPlayerStore.set({ track: null, playing: false, currentTime: 0, duration: 0 });
			this.requireBackend().clear();
		}
	}

	skip(): void {
		this.playNext();
	}

	back(): void {
		const previous = queue.previous();
		if(previous){
			this.requireBackend().play(previous);
		}
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

export const player = new AudioPlayer();
