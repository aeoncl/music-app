import type { PageLoad } from './$types';
import {
	PUBLIC_NAVIDROME_TOKEN,
	PUBLIC_NAVIDROME_URL,
	PUBLIC_NAVIDROME_USER
} from '$env/static/public';

//https://opensubsonic.netlify.app/docs/endpoints/getalbum/
export type AlbumResponse = {
	'subsonic-response': {
		status: string;
		version: string;
		type: string;
		serverVersion: string;
		openSubsonic: boolean;
		album: {
			name: string;
			song: Song[];
		};
	};
};

export type Song = {
	id: string;
	parent: string;
	title: string
	type: string;
	albumId: string;
	artistId: string;
	artist: string;
	coverArt: string;
	duration: number;
	bitRate: number;
	bitDepth: number;
	samplingRate: number;
	channelCount: number;
	track: number;
	year: number;
	genre: string;
	size: number;
	discNumber: number;
	suffix: string;
	contentType: string;
	path: string;

}

export const load: PageLoad = async ({ fetch, params }) => {


	const response = await fetch(
		`${PUBLIC_NAVIDROME_URL}/getAlbum?u=${PUBLIC_NAVIDROME_USER}&t=${PUBLIC_NAVIDROME_TOKEN}&s=56228e&f=json&v=1.8.0&c=NavidromeUI&id=${params.albumId}`
	);

	const album = await response
		.json()
		.then((res: AlbumResponse) => res['subsonic-response'].album);

	console.log(album);

	return {
		title: album.name,
		album: album,
		banner: {
			image: ""
		}
	};


};