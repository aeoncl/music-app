// place files you want to import through the `$lib` alias in this folder.

export type Artist = {
	id: number;
	name: string;
	artistImageUrl: string;
}

export const artists : Artist[] = [
	{
		id: 1,
		name: 'The Offspring',
		artistImageUrl: '/img/artists/the-offspring.png'
	},
	{
		id: 2,
		name: 'Green Day',
		artistImageUrl: '/img/artists/green-day.png'
	},
	{
		id: 3,
		name: 'Blink-182',
		artistImageUrl: '/img/artists/blink-182.png'
	},
	{
		id: 4,
		name: 'Sum 41',
		artistImageUrl: '/img/artists/sum-41.png'
	},
	{
		id: 5,
		name: 'Rise Against',
		artistImageUrl: '/img/artists/rise-against.png'
	},
	{
		id: 6,
		name: 'Depeche Mode',
		artistImageUrl: '/img/artists/depeche-mode.png'
	},
	{
		id: 7,
		name: 'The Sisters of Mercy',
		artistImageUrl: '/img/artists/the-sisters-of-mercy.png'
	},
	{
		id: 8,
		name: 'Clan of Xymox',
		artistImageUrl: '/img/artists/clan-of-xymox.png'
	},
	{
		id: 9,
		name: 'She Past Away',
		artistImageUrl: '/img/artists/she-past-away.png'
	},
	{
		id: 10,
		name: 'Twin Tribes',
		artistImageUrl: '/img/artists/twin-tribes.png'
	}
];