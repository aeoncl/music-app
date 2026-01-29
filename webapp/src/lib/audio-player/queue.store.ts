import { writable, get } from 'svelte/store';
import type { Song } from '../../routes/(content)/albums/[albumId]/+page';

export const remainingQueueStore = writable<Song[]>([]);

export const remainingQueue = {
	enqueue(song: Song) {
		remainingQueueStore.update((q) => [...q, song]);
	},

	push_front(song: Song) {
		remainingQueueStore.update((q) => [song, ...q]);
	},

	dequeue(): Song | undefined {
		let song: Song | undefined;
		remainingQueueStore.update((q) => {
			if (q.length === 0) return q;
			[song, ...q] = q;
			return q;
		});
		return song;
	},

	clear() {
		remainingQueueStore.set([]);
	},

	isEmpty(): boolean {
		return get(remainingQueueStore).length === 0;
	}
};

class Queue {
	private songs: Song[] = [];
	private currentIndex: number = -1;

	enqueue(song: Song) {
		this.songs.push(song);
		remainingQueue.enqueue(song);
	}

	next(): Song | undefined {
		if (this.currentIndex + 1 >= this.songs.length) return undefined;
		this.currentIndex++;
		remainingQueue.dequeue();
		return this.songs[this.currentIndex]
	}

	previous(): Song | undefined {
		if (this.currentIndex <= 0) return undefined;
		remainingQueue.push_front(this.songs[this.currentIndex]);
		this.currentIndex--;
		return this.songs[this.currentIndex];
	}

	current(): Song | undefined {
		return this.songs[this.currentIndex];
	}

	hasNext(): boolean {
		return this.currentIndex + 1 < this.songs.length;
	}

	hasPrevious(): boolean {
		return this.currentIndex > 0;
	}

	getHistory(): Song[] {
		return this.songs.slice(0, this.currentIndex + 1);
	}

	getUpcoming(): Song[] {
		return this.songs.slice(this.currentIndex + 1);
	}

	clear() {
		this.songs = [];
		this.currentIndex = -1;
		remainingQueue.clear();
	}
}

export const queue = new Queue();