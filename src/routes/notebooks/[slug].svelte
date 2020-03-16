<script context="module">
	export function preload({ params, session, query }) {
    return this.fetch(`notebooks/${params.slug}.json`)
      .then(r => r.json())
	}
</script>
<script>
  export let notebook, file
  import Notebook from "../../components/Notebook.svelte"
</script>

<Notebook {file} {notebook}/>
