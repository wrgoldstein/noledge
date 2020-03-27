<script>
  import { onMount } from "svelte"
  import { stores } from '@sapper/app';
  const { page } = stores();

  let notebook, file
  let loading = true
  import Notebook from "../../components/Notebook.svelte"

  onMount(() => {
    fetch(`notebooks/${$page.params.slug}.json`)
      .then(r => r.json())
      .then((json) => {
        notebook = json.notebook
        file = json.file
        loading = false
        return json
      })
  })
</script>

{#if loading}
  <h1> Loading...</h1>
{/if}

{#if notebook}
  <Notebook {file} {notebook}/>
{/if}
