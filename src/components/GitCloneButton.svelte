<script>
  import { stores, goto } from '@sapper/app';

  import Loading from "./Loading.svelte";

  export let callback
  export let message

  let loading;

  function clone(){
    loading = true;
    fetch('/auth/refresh', { method: 'POST' }).then((response) => {
      if (callback) callback()  
    })
  }

</script>

<!-- svelte-ignore a11y-missing-attribute -->
<div>
  {#if loading}
    <Loading />
    <p>Getting the latest notebooks, this may take a minute.</p>
    <p>You'll be redirected.</p>
  {:else}
    {@html message} <a class="btn" on:click={clone}>reset notebooks</a>
  {/if}
</div>
