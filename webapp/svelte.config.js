import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: 'index.html'
		}),
		/*		,
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ['unsafe'],
				'img-src': ['self'],
				'script-src': ['self'],
				'style-src': ['self', 'unsafe-inline'],
				'connect-src': process.env.TAURI_DEBUG === 'true' ? ['ws://localhost:5173'] : undefined
			}
		}*/
	}
};


export default config;
