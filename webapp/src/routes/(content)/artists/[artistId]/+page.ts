import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

import {
	PUBLIC_NAVIDROME_TOKEN,
	PUBLIC_NAVIDROME_URL,
	PUBLIC_NAVIDROME_USER
} from '$env/static/public';

export const load: PageLoad = async ({ fetch, params }) => {
	//const artist = artists.find(artist => artist.id === Number(params.artistId));
	const response = await fetch(
		`${PUBLIC_NAVIDROME_URL}/getArtist?u=${PUBLIC_NAVIDROME_USER}&t=${PUBLIC_NAVIDROME_TOKEN}&s=56228e&f=json&v=1.8.0&c=NavidromeUI&id=${params.artistId}`
	);

	let artist = await response.json().then((res) => res['subsonic-response'].artist);

	if (!artist) {
		redirect(500, '/error');
	}

	return {
		artist: artist,
		title: artist.name,
		banner: {
			image: artist.artistImageUrl
		}
	};
};
