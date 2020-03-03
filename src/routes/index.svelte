<script>
  import { stores, goto } from '@sapper/app';

  const { session } = stores()
</script>

<style>
	figure {
    margin: 0 0 1em 0;
    align-content: center;
	}

	img {
		width: 130%;
		margin: 0 0 1em 0;
	}
</style>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<figure>
	<img alt='Hall of knowledge' src='mbostock.png'>
</figure>
