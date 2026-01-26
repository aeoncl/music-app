import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

import {
	PUBLIC_NAVIDROME_TOKEN,
	PUBLIC_NAVIDROME_URL,
	PUBLIC_NAVIDROME_USER
} from '$env/static/public';



type ArtistsResponse = {
	"subsonic-response": {
		status: string;
		version: string;
		type: string;
		serverVersion: string;
		openSubsonic: boolean;
		artist: Artist
	}
}

type Artist = {
	id: string;
	name: string;
	coverArt: string;
	albumCount: number;
	artistImageUrl: string;
	album: Album[]
};

type Album = {
	id: string;
	name: string;
	artist: string;
	artistId: string;
	coverArt: string; //Id
	songCount: number;
	duration: number;
	playCount: number;
	created: string;
	year: number;
	genre: string;
	played: string;
	artists: [{
		id: string;
		name: string;
	}]
	displayArtist: string;
}

export const load: PageLoad = async ({ fetch, params }) => {
	//const artist = artists.find(artist => artist.id === Number(params.artistId));
	const response = await fetch(
		`${PUBLIC_NAVIDROME_URL}/getArtist?u=${PUBLIC_NAVIDROME_USER}&t=${PUBLIC_NAVIDROME_TOKEN}&s=56228e&f=json&v=1.8.0&c=NavidromeUI&id=${params.artistId}`
	);



	const artist = await response.json().then((res: ArtistsResponse) => res['subsonic-response'].artist);

	console.log(artist);

	if (!artist) {
		redirect(500, '/error');
	}

	return {
		artist: artist,
		getImagePath: (coverArt: string) => { return `${PUBLIC_NAVIDROME_URL}/getCoverArt?u=${PUBLIC_NAVIDROME_USER}&t=${PUBLIC_NAVIDROME_TOKEN}&s=56228e&f=json&v=1.8.0&c=NavidromeUI&id=${coverArt}&_=2025-12-12T13:08:37Z&size=300&square=true`; },
		title: artist.name,
		banner: {
			image: artist.artistImageUrl
		}
	};
};
