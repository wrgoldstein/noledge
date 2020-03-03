<script context="module">
	function anodize(filepath){
        return filepath.replace(/\//g, '|')
	}

	export function preload({ params, query }) {
		return this.fetch(`notebooks/${anodize(params.slug)}.json`)
			.then(r => r.json())
			.then(data => {
				return data;
			}
		);
	}
</script>

<script>
    import marked from "marked"
    import Prism from "prismjs"
    import "prismjs/components/prism-python"
    import "prismjs/themes/prism.css"

    export let notebook;
	let show_code = false

    function toggleCode(){
        show_code = !show_code
    }

    function highlight(source){
        return Prism.highlight(`${source}`, Prism.languages.python, 'python')
    }
</script>

<style>
    .code {
        background-color: #f0f0f0;
        overflow: scroll;
        padding: 5px;
    }
    
    .code + .code {
        margin-top: 10px;
    }

    .button-container {
        position: fixed;
        right: 50px;
    }

    .markdown {
        margin: 15px;
	}
	
	img {
		max-width:80%;
	}

    button {
        padding: 15px;
        border-radius: 3px;
        font-size: 16px;
        background-color:#666;
        color: #eee;
    }
</style>

<svelte:head>
	<title>A Notebook</title>
</svelte:head>

<div class="button-container">
    <button on:click={toggleCode}>
        { show_code ?
            "Hide code" :
            "Show code" }
    </button>
</div>
<!-- svelte-ignore a11y-missing-attribute -->
{#each notebook.cells as cell }
    {#if cell.cell_type == "markdown"}
        <div class="markdown">
            {@html marked(cell.source.join(""))}
        </div>
    {:else}
        {#if show_code}
            <div class="code">
                <pre>
                    <code>
                        { @html highlight(cell.source.join("")) }
                    </code>
                </pre>
            </div>
        {/if}
        {#each cell.outputs as output}
            {#if output.data && output.data['image/png']}
                <img src="data:image/png;base64,{output.data['image/png']}">
            {/if}
        {/each}
    {/if}
{/each}


