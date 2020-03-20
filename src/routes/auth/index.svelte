<script>
  import { stores, goto } from '@sapper/app';
  import loader from '@beyonk/async-script-loader'
  import GoogleAuth from '@beyonk/svelte-social-auth/src/google-auth/GoogleAuth.svelte'

  const { session } = stores()
  // const github_root = "https://github.com/login/oauth/authorize"
  // const redirect_uri = `http://${$session.host}/auth/callback`
  // const github_url = [
  //   `${github_root}?client_id=${$session.github_client_id}`,
  //   `redirect_uri=${redirect_uri}`,
  //   `scope=repo`
  // ].join('&')

  const client_id = $session.client_id
  let loading_message = ''

  function refresh(){
    loading_message = "You will be redirected (this may take a while)"
    fetch('/auth/refresh').then((response) => {
      goto('/notebooks')
    })
  }

  // function login(){
    // fetch('/auth/login').then((response) => {
    //   window.location.reload()
    // })
  // }

  // function logout(){
  //   fetch('/auth/logout').then(() => {
  //     $session.user = undefined
  //     goto('/')
  //   })
  // }

  function login(e){
    console.log(e.detail.user.Qt.Ad)
    fetch(`/auth/login?name=${e.detail.user.Qt.Ad}`)
      .then(response => response.json())
      .then(response => {
        console.log($session)
        session.set({ user: { login: e.detail.user.Qt.Ad, ...response }} )
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

{#if $session.user }
  <h1> hello { $session.user.login }</h1>
{/if}
<!-- svelte-ignore a11y-missing-attribute -->
<div>
  {#if $session.user}
    <a class="btn" on:click={refresh}>reload notebooks</a>
    <a class="btn" on:click={logout}>log out</a>
  {/if}
  <div style="display: {$session.user ? 'none' : 'block'}">
    <GoogleAuth clientId="{client_id}" on:auth-success={login} />
  </div>
</div>

