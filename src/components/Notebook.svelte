<script>
  import Cell from "./Cell.svelte"

  export let notebook, file

  let show_code = notebook.cells.map(i => false)
  
  function show_all_code(){
    show_code = notebook.cells.map(i => true)
  }

  function hide_all_code(){
    show_code = notebook.cells.map(i => false)
  }
</script>
<style>
</style>

<h1>{file.name}</h1>

<!-- svelte-ignore a11y-missing-attribute -->
<div class="button-container">
    <a class="btn" on:click={show_all_code}>Show all code</a>
    <a class="btn" on:click={hide_all_code}>Hide all code</a>
</div>

{#each notebook.cells as cell, i }
  <Cell {cell} bind:showCode={show_code[i]}/>
{/each}


