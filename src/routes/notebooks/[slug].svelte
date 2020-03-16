<script context="module">
	export function preload({ params, session, query }) {
    return this.fetch(`notebooks/${params.slug}.json`)
      .then(r => r.json())
      .then(json => {
        return json
      })
	}
</script>
<script>
  export let notebook, file
  notebook = JSON.parse(notebook)
  import Notebook from "../../components/Notebook.svelte"
</script>

<Notebook {file} {notebook}/>
