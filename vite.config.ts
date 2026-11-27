import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// .env can be a 1Password-mounted pipe whose mtime changes on every read, which restarts the server forever.
	server: { watch: { ignored: ['**/.env'] } }
});
