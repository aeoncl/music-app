<script lang="ts">
    import { resizeX, type ResizeXOptions } from '$lib/attachments/resizeX.ts';

    type Props = {
        get: ResizeXOptions['get'];
        set: ResizeXOptions['set'];
        min?: number;
        max?: number;
        direction?: ResizeXOptions['direction'];
        class?: string
    };

    let { get, set, min = 120, max = 500, direction = 1, class: className} = $props();
</script>

<div class="paneResizer {className ?? ''}" {@attach resizeX({ get, set, min, max, direction })}>

    <div class="resize-handle"></div>
</div>

<style lang="css">

    .paneResizer {
        width: .6em;
        text-align: center;
        cursor: ew-resize;
        user-select: none;
    }

    .resize-handle {
        display: inline-block;
        margin: 0 auto;
        width: 30%;
        height: 100%;
    }

    .paneResizer:hover .resize-handle, .paneResizer:hover .resize-handle {
        background-color: var(--clr-light-a0);
    }

</style>