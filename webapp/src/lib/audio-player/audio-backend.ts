import type { Song } from '../../routes/(content)/albums/[albumId]/+page';
import {
	PUBLIC_NAVIDROME_TOKEN,
	PUBLIC_NAVIDROME_URL,
	PUBLIC_NAVIDROME_USER
} from '$env/static/public';

export type AudioBackendEventMap = {
	timeupdate: number;
	durationchange: number;
	play: void;
	pause: void;
	ended: void;
	trackchange: Song;
};

export type AudioBackendEventType = keyof AudioBackendEventMap;

export interface AudioBackend {
	play(song: Song): Promise<void>;
	pause(): void;
	toggle(): Promise<void>;
	seek(seconds: number): void;
	clear(): void;
	dispose(): void;
	getFrequencyData(): Uint8Array;

	addEventListener<K extends AudioBackendEventType>(
		event: K,
		callback: (data: AudioBackendEventMap[K]) => void
	): void;

	removeEventListener<K extends AudioBackendEventType>(
		event: K,
		callback: (data: AudioBackendEventMap[K]) => void
	): void;
}

export class HtmlAudioBackend implements AudioBackend {
	private audio: HTMLAudioElement;
	private domHandlers: { event: string; handler: () => void }[] = [];
	private listeners: {
		[K in AudioBackendEventType]: Set<(data: AudioBackendEventMap[K]) => void>;
	} = {
		timeupdate: new Set(),
		durationchange: new Set(),
		play: new Set(),
		pause: new Set(),
		ended: new Set(),
		trackchange: new Set()
	};

	private audioContext: AudioContext | null = null;
	private analyser: AnalyserNode | null = null;
	private dataArray: Uint8Array | null = null;
	private source: MediaElementAudioSourceNode | null = null;

	constructor(audioElement: HTMLAudioElement) {
		this.audio = audioElement;
		this.init();
	}

	private initAnalyser(): void {
		if (this.audioContext) {
			if (this.audioContext.state === 'suspended') {
				this.audioContext.resume();
			}
			return;
		}
		this.audioContext = new AudioContext();
		this.analyser = this.audioContext.createAnalyser();
		this.analyser.fftSize = 64;
		this.analyser.smoothingTimeConstant = 0.5; // Reduced further for maximum reactivity
		this.source = this.audioContext.createMediaElementSource(this.audio);
		this.source.connect(this.analyser);
		this.analyser.connect(this.audioContext.destination);
		this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
	}

	getFrequencyData(): Uint8Array {
		if (!this.analyser || !this.dataArray) return new Uint8Array(0);
		this.analyser.getByteFrequencyData(this.dataArray);
		return this.dataArray;
	}

	private init(): void {
		this.audio.preload = 'none';
		this.audio.crossOrigin = 'anonymous';

		this.addDomListener('timeupdate', () => {
			this.emit('timeupdate', this.audio.currentTime);
		});

		this.addDomListener('durationchange', () => {
			this.emit('durationchange', this.audio.duration);
		});

		this.addDomListener('loadedmetadata', () => {
			this.emit('durationchange', this.audio.duration);
		});

		this.addDomListener('play', () => {
			this.emit('play', undefined as void);
		});

		this.addDomListener('pause', () => {
			this.emit('pause', undefined as void);
		});

		this.addDomListener('ended', () => {
			this.emit('pause', undefined as void);
			this.emit('ended', undefined as void);
		});
	}

	private addDomListener(event: string, handler: () => void): void {
		this.audio.addEventListener(event, handler);
		this.domHandlers.push({ event, handler });
	}

	private emit<K extends AudioBackendEventType>(event: K, data: AudioBackendEventMap[K]): void {
		for (const callback of this.listeners[event]) {
			(callback as (data: AudioBackendEventMap[K]) => void)(data);
		}
	}

	addEventListener<K extends AudioBackendEventType>(
		event: K,
		callback: (data: AudioBackendEventMap[K]) => void
	): void {
		this.listeners[event].add(callback as any);
	}

	removeEventListener<K extends AudioBackendEventType>(
		event: K,
		callback: (data: AudioBackendEventMap[K]) => void
	): void {
		this.listeners[event].delete(callback as any);
	}

	async play(song: Song): Promise<void> {
		this.initAnalyser();
		const url = `${PUBLIC_NAVIDROME_URL}/stream?u=${PUBLIC_NAVIDROME_USER}&t=${PUBLIC_NAVIDROME_TOKEN}&s=56228e&format=json&v=1.8.0&c=NavidromeUI&id=${song.id}&format=mp3`;
		this.emit('trackchange', song);
		this.audio.src = url;
		this.audio.currentTime = 0;
		await this.audio.play();
	}

	pause(): void {
		this.audio.pause();
	}

	async toggle(): Promise<void> {
		if (this.audio.paused) await this.audio.play();
		else this.audio.pause();
	}

	seek(seconds: number): void {
		this.audio.currentTime = Math.max(0, seconds);
		this.emit('timeupdate', this.audio.currentTime);
	}

	clear(): void {
		this.pause();
		this.audio.src = '';
	}

	dispose(): void {
		this.audio.pause();
		this.audio.src = '';

		for (const { event, handler } of this.domHandlers) {
			this.audio.removeEventListener(event, handler);
		}

		for (const key of Object.keys(this.listeners) as AudioBackendEventType[]) {
			this.listeners[key].clear();
		}
	}
}
