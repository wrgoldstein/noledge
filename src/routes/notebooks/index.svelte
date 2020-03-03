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

  const github_root = "https://github.com/login/oauth/authorize"
  const redirect_uri = `http://${$session.host}/auth/callback`
  const github_url = [
    `${github_root}?client_id=${$session.github_client_id}`,
    `redirect_uri=${redirect_uri}`
  ].join('&')

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
      .catch(err => {
        console.log('not so fast!')
      })
  })
  
  console.log($session)
</script>

<style>
  .giant {
    font-size: 8em;
  }

  .login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 2em;
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
  <div style='display: flex;'>
    <p class='giant'>404</p>
    <div class='login'>
      <p>Perhaps you need to log in?</p>
      <a class='btn' href={github_url}>Log me in with Github!</a>
    </div>
  </div>
{/if}
