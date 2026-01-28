// place files you want to import through the `$lib` alias in this folder.

export function durationToString(durationInSec: number): string {
	const hours = Math.floor(durationInSec / 3600);
	const minutes = Math.floor((durationInSec - hours * 3600) / 60);
	const seconds = Math.floor(durationInSec - hours * 3600 - minutes * 60);

	let out = '';
	if (hours > 0) {
		out += hours + ':';
	}

	const secondsFormatted = seconds < 10 ? '0' + seconds : seconds;

	out += `${minutes}:${secondsFormatted}`;

	return out;
}