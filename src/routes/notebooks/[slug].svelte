<script context="module">
	function anodize(filepath){
        return filepath.replace(/\//g, '|')
	}

	export function preload({ params, query }) {
		return this.fetch(`notebooks/${anodize(params.slug)}.json`)
			.then(r => r.json())
			.then(data => {
				return data;
			}
		);
	}
</script>
<script>
  export let notebook
  import Notebook from "./Notebook.svelte"
</script>

<Notebook {notebook}/>
