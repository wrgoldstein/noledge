<script>
  import { onMount } from "svelte"
  import { goto, stores } from "@sapper/app"

  const { session } = stores()

  onMount(async () => {
    // handle auth redirect
    if (/code=/.exec(window.location.search)){
      const code = new URLSearchParams(window.location.search).get('code')
      const response = await fetch(`auth/login?code=${code}`)

      session.set({ user: response.user })
      goto('/')
    }
  })
</script>

<p>Authenticating...</p>
