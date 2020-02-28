<script context="module">
	export function preload({ params, query }) {
		return this.fetch(`notebooks.json`).then(r => r.json()).then(data => {
			return { notebooks: data.files, path: data.path };
		});
	}
</script>

<script>
    export let notebooks, path

    function lastPart(filepath){
        let split = filepath.split('/')
        return split.pop()
    }
    
	function anodize(filepath){
        return filepath.replace(/\//g, '|')
	}
</script>

<style>
</style>

<svelte:head>
	<title>List Notebooks</title>
</svelte:head>

<ul>
    {#each notebooks as notebook }
        {#if notebook.slice(-6) == '.ipynb' }
            <li><a href="/notebooks/{anodize(notebook.slice(path.length+1))}">{lastPart(notebook)}</a></li>
        {/if}
    {/each}
</ul>

