import type { Song } from '../../routes/(content)/albums/[albumId]/+page';
import { getContext, setContext } from 'svelte';
import type { AudioBackendEventMap, AudioBackendEventType } from '$lib/audio-player/audio-backend';


export type AudioQueueEventMap = {
	trackadded: Song;
	trackremoved: Song;
};

export type AudioQueueEventType = keyof AudioQueueEventMap;


export class AudioQueue {
	public tracks = $state<Song[]>([]);

	private listeners: {
		[K in AudioQueueEventType]: Set<(data: AudioQueueEventMap[K]) => void>;
	} = {
		trackadded: new Set(),
		trackremoved: new Set()
	};

	addEventListener<K extends AudioQueueEventType>(
		event: K,
		callback: (data: AudioQueueEventMap[K]) => void
	): void {
		this.listeners[event].add(callback as any);
	}

	removeEventListener<K extends AudioQueueEventType>(
		event: K,
		callback: (data: AudioQueueEventMap[K]) => void
	): void {
		this.listeners[event].delete(callback as any);
	}

	enqueue(song: Song): void {
		this.tracks.push(song);
		this.listeners.trackadded.forEach((callback) => callback(song));
	}

	enqueue_all(songs: Song[]): void {
		this.tracks.push(...songs);
		songs.forEach((song) => this.listeners.trackadded.forEach((callback) => callback(song)));
	}

	clear(): void {
		this.tracks = [];
	}

	dequeue(): Song | undefined {
		const track = this.tracks.shift();

		if (track) {
			this.listeners.trackremoved.forEach((callback) => callback(track));
		}
		return track;
	}
}

const MAIN_QUEUE_KEY = '$_main_queue';

export const getAudioQueue = (key = MAIN_QUEUE_KEY): AudioQueue => {
	return getContext<AudioQueue>(key);
};

export const setAudioQueue = (key = MAIN_QUEUE_KEY): AudioQueue => {
	const queue = new AudioQueue();
	return setContext(key, queue);
};

const PRIORITY_QUEUE_KEY = '$_priority_queue';

export const getPriorityAudioQueue = (key = PRIORITY_QUEUE_KEY): AudioQueue => {
	return getContext<AudioQueue>(key);
};

export const setPriorityAudioQueue = (key = PRIORITY_QUEUE_KEY): AudioQueue => {
	const queue = new AudioQueue();
	return setContext(key, queue);
};
