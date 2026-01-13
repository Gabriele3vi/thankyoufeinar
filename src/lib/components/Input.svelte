<script>
	let {
		type = 'text',
		placeholder = '',
		value = $bindable(''),
		icon = null,
		required = false,
		pattern = null,
		minlength = null,
		maxlength = null,
		title = null
	} = $props();
</script>

<label class="input validator w-full">
	{#if icon}
		{@html icon}
	{/if}
	<input
		{type}
		{placeholder}
		{required}
		{pattern}
		{minlength}
		{maxlength}
		{title}
		bind:value
	/>
</label>
