<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte.js';

	onMount(() => {
		if (auth.isAuthenticated) {
			goto('/dashboard');
		} else {
			goto('/login');
		}
	});
</script>

<div class="min-h-screen w-full flex justify-center items-center">
	<span class="loading loading-spinner loading-lg"></span>
</div>
