<script>
    import { getMessage } from '$lib/example.remote.ts';

    const messagePromise = getMessage();
</script>

<h1>Remote Functions Sourcemap Bug</h1>
<p>This page imports a remote function to trigger the bug and shows query output.</p>

{#await messagePromise}
    <p>Loading query output...</p>
{:then result}
    <p>Query output:</p>
    <pre>{JSON.stringify(result, null, 2)}</pre>
{:catch error}
    <p>Query failed: {error?.message ?? 'Unknown error'}</p>
{/await}