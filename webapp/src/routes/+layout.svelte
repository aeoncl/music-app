<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import PlayerControls from "$lib/components/routes/player-controls.svelte";

	import '../app.css'
	import {onMount} from "svelte";
	import {player} from "$lib/state/player.service";
	import PanelResizer from "$lib/components/routes/panel-resizer.svelte";
	import {DragDirection} from "$lib/attachments/resizeX";

	let { children } = $props();

	let widthColumLeft = $state(240);
	let widthColumRight = $state(240);

	let audioEl: HTMLAudioElement;

	onMount(() => {
		player.attach(audioEl);
	});

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="container">
	<header>

	</header>

	<div class="mainSection">
		<aside class="sidebar" style={`width: ${widthColumLeft}px`}>

		</aside>

		<PanelResizer  class="sidebar-resize1" get={() => widthColumLeft}
					   set={(next) => (widthColumLeft = next)} direction={DragDirection.Right} ></PanelResizer>

		<main>
			{@render children()}
		</main>

		<PanelResizer class="sidebar-resize2" get={() => widthColumRight}
					  set={(next) => (widthColumRight = next)} direction={DragDirection.Left} ></PanelResizer>

		<aside class="sidebar2" style={`width: ${widthColumRight}px`}>
		</aside>

	</div>

	<footer>

		<PlayerControls></PlayerControls>
	</footer>

	<audio bind:this={audioEl} ></audio>


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
		   "sidebar sidebar-resize main sidebar-resize2 sidebar2" 1fr
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

	.mainSection :global(.sidebar-resize1) {
		grid-area: sidebar-resize;
	}

	.sidebar2
	{
		width: 20em;
		grid-area: sidebar2;
		min-height: 0;
		background-color: var(--clr-surface-a0);
	}

	.mainSection :global(.sidebar-resize2) {
		grid-area: sidebar-resize2;
	}

	main {
		grid-area: main;
		background-color: var(--clr-surface-a0);
		overflow: auto;
	}

	footer {
		height: 6em;
		background-color: var(--clr-dark-a0)
	}



	@media (max-width: 768px) {
		.mainSection {
			grid-template:
				"main" 1fr
				/ 1fr;
		}

		.mainSection :global(.sidebar-resize1), .mainSection :global(.sidebar-resize2) {
			display: none;
		}

		.sidebar,
		.sidebar2 {
			display: none;
		}
	}

</style>