import type { PageLoad } from './$types';
import { artists } from '$lib';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = ({ params }) => {

	const found = artists.find(artist => artist.id === Number(params.artistId));

	if(!found) {
		redirect(500, '/error');
	}

	return {
		artist: found
	};

};


