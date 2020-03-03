<script context="module">
	export function preload({ params, query }) {
    return this.fetch(`notebooks/${params.slug}.json`)
			.then(r => {
        return r.json()
      })
			.then(notebook => {
				return { notebook };
			}
		);
	}
</script>
<script>
  export let notebook
  import Notebook from "./Notebook.svelte"
</script>

<Notebook {notebook}/>
