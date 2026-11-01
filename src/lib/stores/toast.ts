import { writable } from 'svelte/store';

export type ToastMessage = {
	id: number;
	type: 'success' | 'error' | 'info';
	title: string;
	description?: string;
};

let nextId = 1;
const store = writable<ToastMessage[]>([]);

/** 自动移除 */
function autoDismiss(id: number, ms: number) {
	setTimeout(() => dismiss(id), ms);
}

export function show(
	type: ToastMessage['type'],
	title: string,
	description?: string,
	ms = 3000
) {
	const id = nextId++;
	store.update((list) => [...list, { id, type, title, description }]);
	autoDismiss(id, ms);
	return id;
}

export function dismiss(id: number) {
	store.update((list) => list.filter((t) => t.id !== id));
}

export function clear() {
	store.set([]);
}

export const toasts = {
	subscribe: store.subscribe,
	show,
	dismiss,
	clear,
	success: (title: string, description?: string) => show('success', title, description),
	error: (title: string, description?: string) => show('error', title, description, 5000),
	info: (title: string, description?: string) => show('info', title, description)
};
