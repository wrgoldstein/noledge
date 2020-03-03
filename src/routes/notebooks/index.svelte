<script>
  import { onMount } from "svelte"
  import { stores } from "@sapper/app"
  const { session } = stores()

  function lastPart(filepath){
      let split = filepath.split('/')
      return split.pop()
  }
  
	function anodize(filepath){
        return filepath.replace(/\//g, '|')
  }

  function login(){
    fetch('/auth/login').then((response) => {
      goto('/')
    })
  }

  let notebooks = []
  let path = undefined

  onMount(() => {
    fetch(`notebooks.json`)
      .then(response => {
        if (!response.ok) throw Error(response.statusCode)
        return response
      })
      .then(response => response.json())
      .then(json => {
        notebooks = json.notebooks
        path = json.path
      })
  })
  
  console.log($session)
</script>

<style>
  .giant {
    font-size: 3em;
  }
</style>

<!-- svelte-ignore a11y-missing-attribute -->
{#if notebooks.length}
  <ul>
      {#each notebooks as notebook }
          {#if notebook.slice(-6) == '.ipynb' }
              <li><a href="/notebooks/{anodize(notebook.slice(path.length+1))}">{lastPart(notebook)}</a></li>
          {/if}
      {/each}
  </ul>
{:else}
  <p class='giant'>404</p>
  <p>Perhaps you need to log in?</p>
  <a class='btn' on:click={login}>Log me in with Github!</a>
{/if}
