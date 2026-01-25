<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import PlayerControls from "./player-controls.svelte";

	import '../app.css'
	let { children } = $props();


	let width = $state(240);
	const min = 120;
	const max = 500;

	function startResize(e: MouseEvent) {
		const startX = e.clientX;
		const startWidth = width;

		function onMove(ev: MouseEvent) {
			const next = startWidth + (ev.clientX - startX);
			width = Math.min(max, Math.max(min, next));
		}

		function onUp() {
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onUp);
		}

		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onUp);
	}

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="container">
	<header>

	</header>

	<div class="mainSection">
		<aside class="sidebar" style={`width: ${width}px`}>

		</aside>
		<div class="sidebar-resize1" onmousedown={startResize}>
			<div class="resize-handle"></div>
		</div>

		<main>
			{@render children()}
		</main>

		<div class="sidebar-resize2" onmousedown={startResize}>
			<div class="resize-handle"></div>
		</div>

		<aside class="sidebar2">
			<div class="resize-handle"></div>
		</aside>

	</div>

	<footer>
		<PlayerControls></PlayerControls>
	</footer>
</div>


<style lang="css">

	:global(*) {
		margin: 0;
		padding: 0;
	}

	:global(body) {
		color: var(--clr-light-a0) !important;
		background-color: var(--clr-dark-a0) !important;
		font-family: sans-serif;
	}

	:global(a, button) {
		all: unset;
	}

	.mainSection {
		display: grid;
		grid-template:
		   "sidebar sidebar-reszize main sidebar-reszize2 sidebar2" 1fr
			/ min-content min-content auto min-content min-content;
		min-height: 0;
		flex: 1; /* this essentially means "use all parent's inner width */
		overflow: hidden;

	}

	.container {
		position: absolute;
		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
		border: 0;
		margin: 0;
		padding: 0;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	header {
		height: 4em;
		background-color: var(--clr-dark-a0)
	}

	.sidebar {
		grid-area: sidebar;
		min-height: 0;
		background-color: var(--clr-surface-a0);
	}

	.sidebar2
	{
		width: 20em;
		grid-area: sidebar2;
		min-height: 0;
		background-color: var(--clr-surface-a0);
	}

	main {
		grid-area: main;
		background-color: var(--clr-surface-a0);
		overflow: auto;
	}

	footer {
		background-color: var(--clr-dark-a0)
	}

	.sidebar-resize1 {
		width: .6em;
		text-align: center;
		grid-area: sidebar-reszize;
		cursor: ew-resize;
		user-select: none;
	}

	.sidebar-resize2 {
		width: .6em;
		text-align: center;
		grid-area: sidebar-reszize2;
		cursor: ew-resize;
		user-select: none;
	}

	.resize-handle {
		display: inline-block;
		margin: 0 auto;
		width: 30%;
		height: 100%;
	}

	.sidebar-resize1:hover .resize-handle,.sidebar-resize2:hover .resize-handle {
		background-color: var(--clr-light-a0);
	}

</style>