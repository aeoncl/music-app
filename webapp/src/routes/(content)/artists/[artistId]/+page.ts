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

type ArtistInfoResponse = {
	"subsonic-response": {
		status: string;
		version: string;
		type: string;
		serverVersion: string;
		openSubsonic: boolean;
		artistInfo: ArtistInfo;
	};
}

type ArtistInfo = {
	biography: string;
	musicBrainzId: string;
	lastFmUrl: string;
	smallImageUrl: string;
	mediumImageUrl: string;
	largeImageUrl: string;
	similarArtist: SimilarArtist[];
}

type SimilarArtist = {
	id: string;
	name: string;
	coverArt: string;
	artistImageUrl: string;
}

function removeHtmlTags(input: string): string {
	return input.replace(/<(\w+)[^>]*>[\s\S]*?<\/\1>|<[^>]*\/>/g, '');
}


export const load: PageLoad = async ({ fetch, params }) => {
	//const artist = artists.find(artist => artist.id === Number(params.artistId));
	const response = await fetch(
		`${PUBLIC_NAVIDROME_URL}/getArtist?u=${PUBLIC_NAVIDROME_USER}&t=${PUBLIC_NAVIDROME_TOKEN}&s=56228e&f=json&v=1.8.0&c=NavidromeUI&id=${params.artistId}`
	);



	const artist = await response.json().then((res: ArtistsResponse) => res['subsonic-response'].artist);

	const response2 = await fetch(
		`${PUBLIC_NAVIDROME_URL}/getArtistInfo?u=${PUBLIC_NAVIDROME_USER}&t=${PUBLIC_NAVIDROME_TOKEN}&s=56228e&f=json&v=1.8.0&c=NavidromeUI&id=${params.artistId}`
	);

	const artistInfo = await response2
		.json()
		.then((res: ArtistInfoResponse) => res['subsonic-response'].artistInfo)
		.then((artistInfo) => {
			artistInfo.biography = removeHtmlTags(artistInfo.biography);
			return artistInfo;
		});


/*
	const response3 = await fetch(
		`${PUBLIC_NAVIDROME_URL}/getTopSongs?u=${PUBLIC_NAVIDROME_USER}&t=${PUBLIC_NAVIDROME_TOKEN}&s=56228e&f=json&v=1.8.0&c=NavidromeUI&artist=${artist.name}`
	);

	console.log(response3);


	const topSongs = await response3
		.json()
		.then((res: ArtistInfoResponse) => res['subsonic-response'].artistInfo)
		.then((artistInfo) => {
			artistInfo.biography = removeHtmlTags(artistInfo.biography);
			return artistInfo;
		});
*/




	if (!artist) {
		redirect(500, '/error');
	}

	return {
		artist: artist,
		artistInfo: artistInfo,
		getImagePath: (coverArt: string) => { return `${PUBLIC_NAVIDROME_URL}/getCoverArt?u=${PUBLIC_NAVIDROME_USER}&t=${PUBLIC_NAVIDROME_TOKEN}&s=56228e&f=json&v=1.8.0&c=NavidromeUI&id=${coverArt}&_=2025-12-12T13:08:37Z&size=300&square=true`; },
		title: artist.name,
		banner: {
			image: artist.artistImageUrl
		}
	};
};
