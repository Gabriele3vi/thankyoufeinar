<script>
	let { value = $bindable('') } = $props();

	// Parse initial value or use current date/time
	function parseDateTime(val) {
		if (val) {
			const dt = new Date(val);
			return {
				year: dt.getFullYear(),
				month: dt.getMonth() + 1,
				day: dt.getDate(),
				hours: dt.getHours(),
				minutes: dt.getMinutes()
			};
		}
		const now = new Date();
		return {
			year: now.getFullYear(),
			month: now.getMonth() + 1,
			day: now.getDate(),
			hours: now.getHours(),
			minutes: now.getMinutes()
		};
	}

	let dateTime = $state(parseDateTime(value));

	// Update value when dateTime changes
	$effect(() => {
		const dt = new Date(
			dateTime.year,
			dateTime.month - 1,
			dateTime.day,
			dateTime.hours,
			dateTime.minutes
		);
		value = dt.toISOString().slice(0, 16);
	});

	// Helper to get days in month
	function getDaysInMonth(year, month) {
		return new Date(year, month, 0).getDate();
	}

	// Increment/Decrement functions
	function changeDay(delta) {
		const maxDays = getDaysInMonth(dateTime.year, dateTime.month);
		let newDay = dateTime.day + delta;

		if (newDay > maxDays) {
			newDay = 1;
			changeMonth(1);
		} else if (newDay < 1) {
			changeMonth(-1);
			const prevMonthDays = getDaysInMonth(dateTime.year, dateTime.month);
			newDay = prevMonthDays;
		} else {
			dateTime.day = newDay;
		}
	}

	function changeMonth(delta) {
		let newMonth = dateTime.month + delta;
		let newYear = dateTime.year;

		if (newMonth > 12) {
			newMonth = 1;
			newYear++;
		} else if (newMonth < 1) {
			newMonth = 12;
			newYear--;
		}

		dateTime.month = newMonth;
		dateTime.year = newYear;

		// Adjust day if it exceeds new month's max days
		const maxDays = getDaysInMonth(newYear, newMonth);
		if (dateTime.day > maxDays) {
			dateTime.day = maxDays;
		}
	}

	function changeHours(delta) {
		let newHours = dateTime.hours + delta;
		if (newHours > 23) {
			newHours = 0;
			changeDay(1);
		} else if (newHours < 0) {
			newHours = 23;
			changeDay(-1);
		} else {
			dateTime.hours = newHours;
		}
	}

	function changeMinutes(delta) {
		let newMinutes = dateTime.minutes + delta;
		if (newMinutes > 59) {
			newMinutes = 0;
			changeHours(1);
		} else if (newMinutes < 0) {
			newMinutes = 59;
			changeHours(-1);
		} else {
			dateTime.minutes = newMinutes;
		}
	}

	// Format display
	function formatDate() {
		return `${String(dateTime.day).padStart(2, '0')}/${String(dateTime.month).padStart(2, '0')}/${dateTime.year}`;
	}

	function formatHours() {
		return String(dateTime.hours).padStart(2, '0');
	}

	function formatMinutes() {
		return String(dateTime.minutes).padStart(2, '0');
	}
</script>

<div class="flex flex-col gap-4">
	<div class="grid grid-cols-3 gap-4">
		<!-- Date Column -->
		<div class="flex flex-col items-center gap-2">
			<label class="label-text font-semibold">Data</label>
			<button
				type="button"
				class="btn btn-sm btn-circle"
				onclick={() => changeDay(1)}
			>
				▲
			</button>
			<input
				type="text"
				class="input input-bordered w-full text-center font-mono"
				value={formatDate()}
				readonly
			/>
			<button
				type="button"
				class="btn btn-sm btn-circle"
				onclick={() => changeDay(-1)}
			>
				▼
			</button>
		</div>

		<!-- Hours Column -->
		<div class="flex flex-col items-center gap-2">
			<label class="label-text font-semibold">Ora</label>
			<button
				type="button"
				class="btn btn-sm btn-circle"
				onclick={() => changeHours(1)}
			>
				▲
			</button>
			<input
				type="text"
				class="input input-bordered w-full text-center font-mono text-2xl"
				value={formatHours()}
				readonly
			/>
			<button
				type="button"
				class="btn btn-sm btn-circle"
				onclick={() => changeHours(-1)}
			>
				▼
			</button>
		</div>

		<!-- Minutes Column -->
		<div class="flex flex-col items-center gap-2">
			<label class="label-text font-semibold">Minuti</label>
			<button
				type="button"
				class="btn btn-sm btn-circle"
				onclick={() => changeMinutes(1)}
			>
				▲
			</button>
			<input
				type="text"
				class="input input-bordered w-full text-center font-mono text-2xl"
				value={formatMinutes()}
				readonly
			/>
			<button
				type="button"
				class="btn btn-sm btn-circle"
				onclick={() => changeMinutes(-1)}
			>
				▼
			</button>
		</div>
	</div>
</div>
