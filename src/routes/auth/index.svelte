<script>
  import { stores, goto } from '@sapper/app';

  const { session } = stores()
  const github_root = "https://github.com/login/oauth/authorize"
  const redirect_uri = `http://${$session.host}/auth/callback`
  const github_url = [
    `${github_root}?client_id=${$session.github_client_id}`,
    `redirect_uri=${redirect_uri}`
  ].join('&')

  function refresh(){
    fetch('/auth/refresh').then((response) => {
      goto('/notebooks')
    })
  }

  function login(){
    fetch('/auth/login').then((response) => {
      goto('/notebooks')
    })
  }

  function logout(){
    fetch('/auth/logout').then(() => {
      $session.user = undefined
      goto('/')
    })
  }
</script>

{#if $session.user }
  <h1> hello { $session.user.login }</h1>
{/if}
<!-- svelte-ignore a11y-missing-attribute -->
<div>
  {#if $session.user}
    <a class="btn" on:click={refresh}>reload notebooks</a>
    <a class="btn" on:click={logout}>log out</a>
  {:else}
    <a class="btn" href="{github_url}">login (with github)</a>
  {/if}
</div>