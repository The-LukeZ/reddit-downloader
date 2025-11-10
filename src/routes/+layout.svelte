<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import { ModeWatcher } from "mode-watcher";
  import ExternalLink from "@lucide/svelte/icons/external-link";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen w-full flex-col gap-4 p-3 sm:p-4">
  {@render children()}
</div>

<footer>
  <a
    href="https://github.com/The-LukeZ/reddit-downloader"
    target="_blank"
    class="fixed right-4 bottom-4 flex items-center gap-1 text-sm text-muted-foreground hover:underline"
  >
    <ExternalLink class="inline-block size-4" />
    GitHub
  </a>
</footer>

<ModeWatcher defaultMode="dark" />
