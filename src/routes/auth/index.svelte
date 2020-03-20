<script>
  import { stores, goto } from '@sapper/app';
  import GoogleAuth from '@beyonk/svelte-social-auth/src/google-auth/GoogleAuth.svelte'

  const { session } = stores()
  const github_root = "https://github.com/login/oauth/authorize"
  const redirect_uri = `http://${$session.host}/auth/callback`
  const github_url = [
    `${github_root}?client_id=${$session.github_client_id}`,
    `redirect_uri=${redirect_uri}`,
    `scope=repo`
  ].join('&')

  let loading_message = ''

  function refresh(){
    loading_message = "You will be redirected (this may take a while)"
    fetch('/auth/refresh').then((response) => {
      goto('/notebooks')
    })
  }

  function login(){
    fetch('/auth/login').then((response) => {
      window.location.reload()
    })
  }

  function logout(){
    fetch('/auth/logout').then(() => {
      $session.user = undefined
      goto('/')
    })
  }

  function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
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

<GoogleAuth clientId="234393341639-ouolnt6vcbf1fcteebp9oa3racb9fphi" on:auth-success={e => console.dir(e.detail.user)} />
