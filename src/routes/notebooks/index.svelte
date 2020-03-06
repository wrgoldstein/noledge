<script>
  import { onMount } from "svelte"
  import Folder from "../../components/Folder.svelte"
  import { stores } from "@sapper/app"
  import _ from "lodash"

  import Notebook from "../../components/Notebook.svelte"

  const { session } = stores()

  let display = 'stream'

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

  let files = []
  let flat_files
  let path = undefined
  let error = undefined
  let loading = 'Loading page'

  onMount(() => {
    loading = 'Loading data'
    fetch(`notebooks.json`)
      .then(response => {
        if (!response.ok) throw Error(response.statusCode)
        return response
      })
      .then(response => response.json())
      .then(json => {
        flat_files = _.flatten(json.files).filter(f => f.type == 'file')
        console.log(flat_files)
        files = _.sortBy(json.files, (f) => f.type == 'folder' ? 0 : 1)
        loading = false
      })
      .catch(err => {
        error = err
      })
  })
  
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
{#if Object.keys(files).length}
  <div class='sidebar'>
    <Folder name="root" {files} expanded/>
  </div>
  <div class='notebook-preview'>
  </div>
{:else if loading}
  <p class='giant'>{loading}</p>
{:else if error }
<div style='display: flex;'>
    <p class='giant'>404</p>
    <div class='login'>
      <p>Perhaps you need to log in?</p>
      <a class='btn' href={github_url}>Log me in with Github!</a>
    </div>
  </div>
{/if}
