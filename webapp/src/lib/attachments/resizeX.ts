import type { Attachment } from 'svelte/attachments';

export type ResizeXOptions = {
	get: () => number;
	set: (next: number) => void;
	min?: number;
	max?: number;
	/**
	 * +1 means dragging right increases value (left sidebar)
	 * -1 means dragging right decreases value (right sidebar)
	 */
	direction?: DragDirection;
};

export enum DragDirection {
	Left = -1,
	Right = 1
}

export function resizeX(options: ResizeXOptions) : Attachment {
	return (element) => {

		const node = element as HTMLElement

		const min = options.min ?? 120;
		const max = options.max ?? 500;
		const direction = options.direction ?? 1;

		const clamp = (v: number) => Math.min(max, Math.max(min, v));

		function onPointerDown(e: PointerEvent) {
			if (e.button !== 0) return;

			const startX = e.clientX;
			const startWidth = options.get();

			node.setPointerCapture(e.pointerId);

			const onMove = (ev: PointerEvent) => {
				const delta = (ev.clientX - startX) * direction;
				options.set(clamp(startWidth + delta));
			};

			const onUp = () => {
				node.removeEventListener('pointermove', onMove);
				node.removeEventListener('pointerup', onUp);
				node.removeEventListener('pointercancel', onUp);
			};

			node.addEventListener('pointermove', onMove);
			node.addEventListener('pointerup', onUp);
			node.addEventListener('pointercancel', onUp);
		}

		node.addEventListener('pointerdown', onPointerDown);

		return () => {
			node.removeEventListener('pointerdown', onPointerDown);
		};
	};
}
