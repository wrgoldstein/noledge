<script>
  import { stores, goto } from '@sapper/app';
  import loader from '@beyonk/async-script-loader'
  import GoogleAuth from '@beyonk/svelte-social-auth/src/google-auth/GoogleAuth.svelte'

  const { session } = stores()

  const client_id = $session.client_id
  let loading_message = ''

  function pull(){
    loading_message = "You will be redirected when update is complete"
    fetch('/auth/refresh').then((response) => {
      goto('/notebooks')
    })
  }

  function clone(){
    loading_message = "You will be redirected when update is complete (this may take a minute)"
    fetch('/auth/refresh', { method: 'POST' }).then((response) => {
      goto('/notebooks')
    })
  }

  function login(e){
    fetch(`/auth/login?name=${e.detail.user.Tt.Bd}`)
      .then(response => response.json())
      .then(response => {
        session.set({ user: { ...response }} )
        console.log($session)
        goto('/notebooks')
    })
  }

  function logout() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      fetch('/auth/logout').then(() => {
        $session.user = undefined
        goto('/')
      })
    })
  }
</script>
<style>
  .bottom {
    position: fixed;
    bottom: 5em;
  }

  .bottom > a {
    background-color: firebrick;
  }
</style>

{#if $session.user }
  <h1> Hello { $session.user.name }</h1>
{/if}
<!-- svelte-ignore a11y-missing-attribute -->
<div>
  {#if $session.user}
    <a class="btn" on:click={pull}>get latest</a>
    <a class="btn" on:click={logout}>log out</a>
  {/if}
  {#if loading_message}
    <p>{loading_message}</p>
  {/if}
  {#if $session.user}
    <div class="bottom">
      <a class="btn" on:click={clone}>reset notebooks</a>
    </div>
  {:else}
    <div style="display: {$session.user ? 'none' : 'block'}">
      <GoogleAuth clientId="{client_id}" on:auth-success={login} />
    </div>
  {/if}
</div>

