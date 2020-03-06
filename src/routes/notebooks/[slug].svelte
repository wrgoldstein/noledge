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
  console.log(file)
  import Notebook from "../../components/Notebook.svelte"
</script>

<Notebook {file} {notebook}/>
