<script>
  import { onMount } from "svelte"
  import Folder from "../../components/Folder.svelte"
  import { stores } from "@sapper/app"
  import _ from "lodash"
  import moment from "moment"

  import Notebook from "../../components/Notebook.svelte"

  const { session } = stores()

  let display = 'stream'

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
        files = json.files
        // files = _.sortBy(json.files, (f) => f.type == 'folder' ? 0 : 1)
        loading = false
      })
      .catch(err => {
        error = err
      })
  })
  
  let term = ''
  function search(){
    fetch('/notebooks/search', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ term }) 
      })
      .then(response => response.json())
      .then(json => {
        files = json.files
      })
  }
</script>

<style>
  .giant {
    font-size: 4em;
  }

  .file {
    display: flex;
    flex-direction: row;
    margin: 1em;
  }

  .file + .file {
    border-top: 1px solid #eee;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .date {
    font-size: .7em;
    text-align: right;
  }

  span {
    font-size: 1.3em;
  }

  input {
    width: 40%;
    height: 1.5em;
    border-radius: 5px;
    font-size: 19px;
    border: 1px solid #eee;
    background-image:none;
    background-color:transparent;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
  }
  input:focus {
    outline:none;
  }

  .wide {
    flex-grow: 1
  }

  .tag {
    font-size: .7em;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #efefef;
    margin: 5px;
    display: inline-block;
    text-align: center;
  }

  author {
    display: block;
  }
</style>

<!-- svelte-ignore a11y-missing-attribute -->
<header>Search posts:</header>
  <input bind:value={term} on:change={search}/>
{#if Object.keys(files).length}
  {#each files as file}
    <div class="file column">
      <div class="row">
        <div class="column wide">
          <span><a href="/notebooks/{file.sha}">{file.name}</a></span>
          <author>by {file.author.name}</author>
        </div>
        <div class='column'>
          <p class="date">Updated {moment(file.updated_at).format('MM/DD/YYYY')}</p>
          <div>
            {#each (file.tags || []) as tag}
              <p class="tag">{tag}</p>
            {/each}
          </div>
        </div>
      </div>
      <div class="row">
        <p class="description">{file.description || 'No description'}</p>
      </div>
    </div>
  {/each}
{:else if loading}
  <p class='giant'>{loading}</p>
{:else}
  <p>Nothing found</p>
{/if}
