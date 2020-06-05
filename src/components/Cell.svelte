<script>
  import marked from "marked"
  import Prism from "prismjs"
  import katex from "katex"
  import { fade, fly } from 'svelte/transition'
  import "prismjs/components/prism-python"
  import "prismjs/themes/prism.css"

  export let cell
  export let showCode

  let wide, echo, omit

  function toggleCode(){
      showCode = !showCode
  }

  function highlight(source){
      return Prism.highlight(`${source}`, Prism.languages.python, 'python')
  }

  function trim_latex(source){
    return source.replace(/(^(\$|\n)*)|((\$|\n)*$)/g, '')
  }

  function mark(source){
    // Do our best to find math
    // Note \begin{equation} doesn't work
    const re = /(\$\n(\n|.)*?\n\$)|(\$(.)*\$)/g
    if (re.test(source)) {
      source = source.replace(
        re, (code) => {
          try {
            return katex.renderToString(trim_latex(code))
          } catch (err){
            console.log('======', code, '=====')
            console.log(err)
            return trim_latex(`<pre>${code}</pre>`)
          }
        })
    }
    let _marked =  marked(source)
    const re2 = /<img src="attachment:(.+?)".*?>/
    if (re2.test(_marked)){
      console.log('------------')
      _marked = _marked.replace(
        re2, (attachment, foo) => {
          console.log(_marked)
          console.log(cell, foo)
          return `<img class='center-image' src="data:image/png;base64,${cell.attachments[foo]['image/png']}">`
        }
      )
    }
    return _marked
  }

  function parse_options(){
    if (cell.cell_type == "markdown") return
    let topline = cell.source[0]
    if (!topline) return
    if (topline[0] == '#'){
      if (topline.includes('echo')) echo = true
      if (topline.includes('wide')) wide = true
      if (topline.includes('omit')) omit = true
    }
  }

  parse_options()
</script>
<style>
  .code {
      background-color: #f5f5f5;
      border: 1px solid #eee;
      overflow: scroll;
      padding: 0;
      padding-left: 1em;
      border-radius: 10px;
  }
  
  .stdout {
    margin: 15px;
    /* border-left: 2px solid #5F74DA;;
    padding-left: 2em; */
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

  .wide {
    margin-left: -10%;
    max-width: 120%;
  }

  .output {
    margin: 15px;
  }

  .eye {
    padding: 0 0 0 1.5em;
		background: url(/eye-outline.svg) 0 0.1em no-repeat;
    background-size: 1em 1em;
    font-family: monospace;
    font-weight: lighter;
    color: #333;
    cursor: pointer;
    display: block;
  }

  .blind {
		padding: 0 0 0 1.5em;
		background: url(/eye-off-outline.svg) 0 0.1em no-repeat;
		background-size: 1em 1em;
		cursor: pointer;
  }
  
  .prose {
    font-family: inherit;
  }
</style>

<!-- svelte-ignore a11y-missing-attribute -->
{#if cell.cell_type == "markdown"}
  <div class="markdown">
    {@html mark(cell.source.join(""))}
  </div>
{:else if omit}
  <span style='display: none;'>omitted</span>
{:else}
  {#if showCode }
    <div class="code" in:fade={{ duration: 200 }}>
      <pre>
        <code>
          { @html highlight(cell.source.join("")) }
        </code>
      </pre>
    </div>
  {/if}
  {#each (cell.outputs || []) as output}
    {#if output.output_type != 'stream' }
      <div class="output">
        {#if output.data && output.data['image/png']}
            <img class:wide src="data:image/png;base64,{output.data['image/png']}">
        {:else if output.output_type == 'execute_result'}
          {#if output.data && output.data['text/html']}
            { @html output.data['text/html'].join('') }
          {:else if showCode }
            <code>{output.data['text/plain'].join('')}</code>
          {/if}
        {/if}
      </div>
    {:else }
      {#if echo || showCode }
        <div class="stdout">
            {#each output.text.join('').split("\n\n") as stdout}
              <pre class="prose">{stdout}</pre>
            {/each}
        </div>
      {/if}
    {/if}
  {/each}
{/if}
