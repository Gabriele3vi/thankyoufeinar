<script>
	let { giornate = [] } = $props();

	/**
	 * Sort giornate in descending order (most recent first)
	 */
	const sortedGiornate = $derived(
		[...giornate].sort((a, b) => new Date(b.data) - new Date(a.data))
	);

	/**
	 * Format date to readable format (short weekday + date)
	 * @param {string} dateString
	 */
	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('it-IT', {
			weekday: 'short',
			day: '2-digit',
			month: '2-digit'
		});
	}

	/**
	 * Format time to HH:MM
	 * @param {string} dateTimeString
	 */
	function formatTime(dateTimeString) {
		const date = new Date(dateTimeString);
		return date.toLocaleTimeString('it-IT', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	/**
	 * Get direction label
	 * @param {string} verso
	 */
	function getVersoLabel(verso) {
		return verso === 'E' ? 'Entrata' : 'Uscita';
	}

	/**
	 * Get badge class based on direction
	 * @param {string} verso
	 */
	function getVersoBadgeClass(verso) {
		return verso === 'E' ? 'badge-success' : 'badge-error';
	}
</script>

<div class="overflow-x-auto">
	<table class="table w-full">
		<thead>
			<tr>
				<th>Data</th>
				<th>Orario</th>
				<th>Tipo</th>
				<th>Timbratore</th>
				<th>Stato</th>
			</tr>
		</thead>
		<tbody>
			{#if sortedGiornate.length === 0}
				<tr>
					<td colspan="5" class="text-center text-gray-500 py-8">
						Nessuna timbratura trovata
					</td>
				</tr>
			{:else}
				{#each sortedGiornate as giornata}
					{#if giornata.timbrature && giornata.timbrature.length > 0}
						{#each giornata.timbrature as timbratura, index}
							<tr>
								{#if index === 0}
									<td rowspan={giornata.timbrature.length} class="align-top font-semibold">
										{formatDate(giornata.data)}
									</td>
								{/if}
								<td class="font-mono">{formatTime(timbratura.dataOra)}</td>
								<td>
									<span class="badge {getVersoBadgeClass(timbratura.verso)}">
										{getVersoLabel(timbratura.verso)}
									</span>
								</td>
								<td>{timbratura.timbratore}</td>
								{#if index === 0}
									<td rowspan={giornata.timbrature.length} class="align-top">
										{#if giornata.anomalia}
											<span class="badge badge-warning">Anomalia</span>
										{:else if giornata.giornataChiusa}
											<span class="badge badge-info">Chiusa</span>
										{:else}
											<span class="badge badge-ghost">Aperta</span>
										{/if}
									</td>
								{/if}
							</tr>
						{/each}
					{:else}
						<tr>
							<td class="font-semibold">{formatDate(giornata.data)}</td>
							<td colspan="3" class="text-gray-500 italic">Nessuna timbratura</td>
							<td>
								{#if giornata.anomalia}
									<span class="badge badge-warning">Anomalia</span>
								{:else if giornata.giornataChiusa}
									<span class="badge badge-info">Chiusa</span>
								{:else}
									<span class="badge badge-ghost">Aperta</span>
								{/if}
							</td>
						</tr>
					{/if}
				{/each}
			{/if}
		</tbody>
	</table>
</div>
