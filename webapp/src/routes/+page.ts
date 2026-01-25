import type { PageLoad } from '../../.svelte-kit/types/src/routes/(content)/artists/[artistId]/$types';
import { PUBLIC_NAVIDROME_URL, PUBLIC_NAVIDROME_TOKEN, PUBLIC_NAVIDROME_USER} from '$env/static/public';

export const load: PageLoad = async ({ params }) => {

	type GetArtistsResponse = {
		"subsonic-response": {
			status: string;
			version: string;
			type: string;
			serverVersion: string;
			openSubsonic: boolean;
			artists: {
				index: AlphabeticalArtists[]
			}
		}
	}

	type AlphabeticalArtists = {
		name: string;
		artist: Artist[]

	}

	type Artist = {
		id: string;
		name: string;
		coverArt: string;
		artistImageUrl: string
	}

	const response = await fetch(
		`${PUBLIC_NAVIDROME_URL}/getArtists?u=${PUBLIC_NAVIDROME_USER}&t=${PUBLIC_NAVIDROME_TOKEN}&s=56228e&f=json&v=1.8.0&c=NavidromeUI`
	);

	const artists: GetArtistsResponse = await response.json();

	console.log(artists);

	let out = artists["subsonic-response"].artists.index.flatMap(artists => {
		return artists.artist.map(artist => {
			return artist;
		});

	});

	return {
		artists: out
	};
};