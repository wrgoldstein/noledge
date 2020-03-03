<script>
  import { stores, goto } from '@sapper/app';

  const { session } = stores()

  function login(){
    fetch('/auth/login').then((response) => {
      goto('/')
    })
  }

  function logout(){
    fetch('/auth/logout').then(() => {
      $session.user = undefined
      goto('/')
    })
  }
</script>

<h1>User settings</h1>

{#if $session.user }
  <h1> Hello { $session.user.login }</h1>
{/if}
<!-- svelte-ignore a11y-missing-attribute -->
<div>
  {#if $session.user}
    <a class="btn" on:click={logout}>Log out</a>
  {:else}
    <a class="btn" on:click={login}>Login (with github)</a>
  {/if}
</div>