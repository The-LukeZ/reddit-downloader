<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import { ModeWatcher } from "mode-watcher";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen w-full flex-col gap-4 p-3 sm:p-4">
  {@render children()}
</div>

<ModeWatcher defaultMode="dark" />
