<script>
	import { goto } from '$app/navigation';
	import Input from '$lib/components/Input.svelte';
	import { userIcon, keyIcon } from '$lib/components/icons.js';
	import { login } from '$lib/services/api.js';
	import { setToken, auth } from '$lib/stores/auth.svelte.js';
	import { showSuccess, showError, notification } from '$lib/stores/notification.svelte.js';

	let username = $state('');
	let password = $state('');
	let isLoading = $state(false);

	// Redirect if already authenticated
	$effect(() => {
		if (auth.isAuthenticated) {
			goto('/dashboard');
		}
	});

	async function handleLogin(e) {
		e.preventDefault();

		if (!username || !password) {
			showError('Please fill in all fields');
			return;
		}

		isLoading = true;

		try {
			const token = await login(username, password);
			setToken(token);
			showSuccess('Login successful!');
			goto('/dashboard');
		} catch (error) {
			showError(error.message || 'Login failed');
		} finally {
			isLoading = false;
		}
	}

	const messageColor = $derived(
		notification.type === 'success'
			? 'text-green-500'
			: notification.type === 'error'
			? 'text-red-500'
			: ''
	);
</script>

<div class="min-h-screen w-full flex justify-center items-center bg-base-200">
	<div class="flex flex-col items-center gap-8 p-8">
		<div class="text-center">
			<h1 class="font-bold text-6xl font-sans mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
				ThankYouFeinar
			</h1>
			<p class="text-lg text-gray-600 italic">Gestione Timbrature</p>
		</div>

		<div class="divider w-64"></div>

		<form class="flex flex-col gap-4 w-full max-w-xs" onsubmit={handleLogin}>
			<Input
				type="text"
				placeholder="Username"
				bind:value={username}
				icon={userIcon}
				required={true}
				pattern="[A-Za-z][A-Za-z0-9\-]*"
				minlength={3}
				maxlength={30}
				title="Only letters, numbers or dash"
			/>

			<Input
				type="password"
				placeholder="Password"
				bind:value={password}
				icon={keyIcon}
				required={true}
			/>

			<button
				type="submit"
				class="btn btn-primary btn-block"
				disabled={isLoading}
			>
				{isLoading ? 'Logging in...' : 'Login'}
			</button>

			{#if notification.message}
				<p class="font-bold text-center {messageColor}">{notification.message}</p>
			{/if}
		</form>
	</div>
</div>
