<script>
  import marked from "marked"
  import Prism from "prismjs"
  import "prismjs/components/prism-python"
  import "prismjs/themes/prism.css"

  export let cell
  export let showCode

  function toggleCode(){
      showCode = !showCode
  }

  function highlight(source){
      return Prism.highlight(`${source}`, Prism.languages.python, 'python')
  }
</script>
<style>
  .code {
      background-color: #f5f5f5;
      border: 1px solid #eee;
      overflow: scroll;
      padding: 5px;
      border-radius: 10px;
  }
  
  .code + .code {
      margin-top: 10px;
  }

  .markdown {
      margin: 15px;
	}
	
	img {
		max-width:80%;
  }

  .output {
    margin: 15px;
  }

  .eye {
    padding: 0 0 0 1.5em;
		background: url(/eye-outline.svg) 0 0.1em no-repeat;
		background-size: 1em 1em;
		font-weight: bold;
    cursor: pointer;
    display: block;
  }

  .blind {
		padding: 0 0 0 1.5em;
		background: url(/eye-off-outline.svg) 0 0.1em no-repeat;
		background-size: 1em 1em;
		font-weight: bold;
		cursor: pointer;
	}
</style>

<!-- svelte-ignore a11y-missing-attribute -->
{#if cell.cell_type == "markdown"}
  <div class="markdown">
    {@html marked(cell.source.join(""))}
  </div>
{:else}
  {#if showCode }
    <span on:click={toggleCode} class='eye'>hide code</span>
    <div class="code">
      <pre>
        <code>
          { @html highlight(cell.source.join("")) }
        </code>
      </pre>
    </div>
  {:else}
    <span on:click={toggleCode} class='eye blind'>show code</span>
  {/if}
  {#each (cell.outputs || []) as output}
    {#if output.output_type != 'stream' }
      <div class="output">
        {#if output.data && output.data['image/png']}
            <img src="data:image/png;base64,{output.data['image/png']}">
        {:else if output.output_type == 'execute_result'}
          {#if output.data && output.data['text/html']}
            { @html output.data['text/html'].join('') }
          {:else if showCode}
            <code>{output.data['text/plain'].join('')}</code>
          {/if}
        {/if}
      </div>
    {/if}
  {/each}
{/if}
