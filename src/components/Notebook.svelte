<script>
  import moment from "moment"
  import Cell from "./Cell.svelte"

  export let file, notebook

  let show_code = notebook.cells.map(i => false)
  
  function show_all_code(){
    show_code = notebook.cells.map(i => true)
  }

  function hide_all_code(){
    show_code = notebook.cells.map(i => false)
  }
  
</script>
<style>

tag {
    padding: 5px;
    border: 1px solid #eee;
    border-radius: 10px;
    background-color: #efefef;
    margin: 5px;
    display: inline-block;
    min-width: 3em;
    text-align: center;
}

vspacer {
  display: block;
  height: 1em;
}

</style>

<h1>{file.name}</h1>
<p>by {file.author.name}</p>
<p>updated {moment(file.updated_at).format('MMMM Do YYYY, h:mm:ss a')}</p>
{#each (file.tags || []) as tag}
  <tag>{tag}</tag>
{/each}

{#if file.description }
  <description>{file.description}</description>
{/if}

<vspacer></vspacer>

<!-- svelte-ignore a11y-missing-attribute -->
<div class="button-container">
    <a class="btn" on:click={show_all_code}>Show all code</a>
    <a class="btn" on:click={hide_all_code}>Hide all code</a>
</div>

{#each notebook.cells as cell, i }
  <Cell {cell} bind:showCode={show_code[i]}/>
{/each}


