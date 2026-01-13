<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import TimbratureTable from '$lib/components/TimbratureTable.svelte';
	import DateTimePicker from '$lib/components/DateTimePicker.svelte';
	import { fetchTimbrature, clockInOut } from '$lib/services/api.js';
	import { auth, clearToken, getToken } from '$lib/stores/auth.svelte.js';
	import { showSuccess, showError, notification, clearNotification } from '$lib/stores/notification.svelte.js';

	let giornate = $state([]);
	let timestamp = $state('');
	let isLoading = $state(false);
	let isFetching = $state(false);

	// Redirect if not authenticated
	$effect(() => {
		if (!auth.isAuthenticated) {
			goto('/login');
		}
	});

	/**
	 * Get date range: 7 days in the past to 3 days in the future
	 */
	function getDateRange() {
		const today = new Date();
		const start = new Date();
		const end = new Date();

		start.setDate(today.getDate() - 7);
		end.setDate(today.getDate() + 3);

		const formatDate = (date) => {
			return date.toISOString().split('T')[0];
		};

		return {
			start: formatDate(start),
			end: formatDate(end)
		};
	}

	/**
	 * Filter giornate: exclude future days with no timbrature
	 */
	function filterGiornate(giornate) {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		return giornate.filter((giornata) => {
			const giornataDate = new Date(giornata.data);
			giornataDate.setHours(0, 0, 0, 0);

			// If it's today or in the past, always include
			if (giornataDate <= today) {
				return true;
			}

			// If it's in the future, only include if it has timbrature
			return giornata.timbrature && giornata.timbrature.length > 0;
		});
	}

	/**
	 * Load timbrature data
	 */
	async function loadTimbrature() {
		isFetching = true;
		try {
			const token = getToken();
			const { start, end } = getDateRange();
			const data = await fetchTimbrature(token, start, end);
			giornate = filterGiornate(data.giornate || []);
		} catch (error) {
			showError(error.message || 'Failed to load data');
			if (error.message.includes('401') || error.message.includes('403')) {
				clearToken();
				goto('/login');
			}
		} finally {
			isFetching = false;
		}
	}

	/**
	 * Handle clock in
	 */
	async function handleClockIn() {
		if (!timestamp) {
			showError('Please select a date and time');
			return;
		}

		isLoading = true;
		clearNotification();

		try {
			const token = getToken();
			await clockInOut('E', token, timestamp);
			showSuccess('Clock-in successful!');
			timestamp = '';
			await loadTimbrature();
		} catch (error) {
			showError(error.message || 'Clock-in failed');
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Handle clock out
	 */
	async function handleClockOut() {
		if (!timestamp) {
			showError('Please select a date and time');
			return;
		}

		isLoading = true;
		clearNotification();

		try {
			const token = getToken();
			await clockInOut('U', token, timestamp);
			showSuccess('Clock-out successful!');
			timestamp = '';
			await loadTimbrature();
		} catch (error) {
			showError(error.message || 'Clock-out failed');
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Handle logout
	 */
	function handleLogout() {
		clearToken();
		goto('/login');
	}

	const messageColor = $derived(
		notification.type === 'success'
			? 'text-green-500'
			: notification.type === 'error'
			? 'text-red-500'
			: ''
	);

	onMount(() => {
		loadTimbrature();
	});
</script>

<div class="min-h-screen w-full p-4 md:p-8 bg-base-200">
	<div class="max-w-6xl mx-auto">
		<div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
			<h1 class="font-bold text-5xl font-sans bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
				ThankYouFeinar
			</h1>
			<button class="btn btn-outline" onclick={handleLogout}>Logout</button>
		</div>

		<!-- Clock In/Out Section -->
		<div class="card bg-base-100 shadow-xl mb-8">
			<div class="card-body">
				<h2 class="card-title mb-4">Nuova Timbratura</h2>

				<form class="flex flex-col gap-4" onsubmit={(e) => e.preventDefault()}>
					<DateTimePicker bind:value={timestamp} />

					<div class="flex flex-row gap-2">
						<button
							type="button"
							class="btn btn-success flex-1"
							onclick={handleClockIn}
							disabled={isLoading || !timestamp}
						>
							{isLoading ? 'Loading...' : 'Entra'}
						</button>
						<button
							type="button"
							class="btn btn-error flex-1"
							onclick={handleClockOut}
							disabled={isLoading || !timestamp}
						>
							{isLoading ? 'Loading...' : 'Esci'}
						</button>
					</div>

					{#if notification.message}
						<p class="font-bold text-center {messageColor}">{notification.message}</p>
					{/if}
				</form>
			</div>
		</div>

		<!-- Timbrature Section -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title mb-4">Timbrature Recenti</h2>

				{#if isFetching}
					<div class="flex justify-center py-8">
						<span class="loading loading-spinner loading-lg"></span>
					</div>
				{:else}
					<TimbratureTable {giornate} />
				{/if}
			</div>
		</div>
	</div>
</div>
