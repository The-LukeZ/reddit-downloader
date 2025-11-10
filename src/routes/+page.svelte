<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Progress } from "$lib/components/ui/progress/index.js";

  import ModeToggle from "$lib/components/ModeToggle.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  import ExternalLink from "@lucide/svelte/icons/external-link";
  import Download from "@lucide/svelte/icons/download";
  import { isShareUrl, sanitizeUrl } from "$lib/utils";
  import Spinner from "$lib/components/ui/spinner/spinner.svelte";

  let inputError = $state("");
  let loading = $state(false);
  let progress = $state(0);
  let mediaItems = $state<Array<{ url: string; type: "image" | "video" }>>([]);
  let downloadingItems = $state<Set<string>>(new Set());

  async function handleSubmit(e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let url = formData.get("url") as string;
    console.log("Submitted URL:", url);

    if (!url) {
      console.error("No URL provided");
      inputError = "Please enter a Reddit post URL.";
      return;
    }

    progress = 10;

    url = sanitizeUrl(url);

    loading = true;
    inputError = "";

    // Handle share URLs
    if (isShareUrl(url)) {
      console.log("Handling share URL:", url);
      progress = 40;
      const resolvedUrlResponse = await fetch(`/api/get-original-url?url=${encodeURIComponent(url)}`);
      const resolvedUrl = resolvedUrlResponse.ok ? await resolvedUrlResponse.text() : null;
      console.log("Resolved share URL to:", url);

      if (resolvedUrl) {
        url = sanitizeUrl(resolvedUrl);
      } else {
        inputError = "Failed to resolve share URL.";
        loading = false;
        return;
      }
    }

    progress = 60;

    // Sanitize reddit url
    const jsonUrl = url.replace(/\/+$/, "") + ".json";
    console.log("Fetching JSON URL:", jsonUrl);

    // Get posts via api proxy route /api/proxy?url=
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(jsonUrl)}`);

    if (response.ok) {
      const listings = (await response.json()) as Reddit.RedditListingResponse[];
      const post = listings[0].data.children.filter((c) => c.kind === "t3")[0].data;
      console.log("Fetched post data:", post);
      console.log("Post title:", post.title);
      console.log("Post media:", post.media);
      console.log("Post media_metadata:", post.media_metadata);

      // Extract media URLs
      const items: Array<{ url: string; type: "image" | "video" }> = [];

      // Handle single image/video
      if (post.url) {
        if (post.url.match(/\.(jpg|jpeg|png|gif)$/i)) {
          items.push({ url: post.url, type: "image" });
        } else if (post.media?.reddit_video && post.media?.reddit_video?.fallback_url) {
          items.push({ url: post.media.reddit_video.fallback_url, type: "video" });
        }
      }

      // Handle gallery/multiple images
      if (post.media_metadata) {
        Object.values(post.media_metadata).forEach((item: any) => {
          if (item.s?.u) {
            const url = item.s.u.replace(/&amp;/g, "&");
            items.push({ url, type: "image" });
          }
        });
      }

      mediaItems = items;
    } else {
      const errorMessage = await response.text();
      console.error("Error fetching data:", response.statusText);
      inputError = `Failed to fetch post data: ${errorMessage || response.statusText}`;
    }
    loading = false;
    progress = 0;
  }

  async function downloadMedia(url: string, type: "image" | "video") {
    try {
      downloadingItems.add(url);
      downloadingItems = downloadingItems; // Trigger reactivity

      const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      const extension = type === "video" ? "mp4" : url.split(".").pop()?.split("?")[0] || "jpg";
      a.download = `reddit-media-${Date.now()}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download media");
    } finally {
      downloadingItems.delete(url);
      downloadingItems = downloadingItems; // Trigger reactivity
    }
  }
</script>

<!-- header -->
<header class="flex h-fit w-full items-center justify-between rounded-lg border p-2">
  <h1 class="text-xl font-bold">Reddit Downloader</h1>
  <ModeToggle />
</header>

<!-- main content -->
<main class="flex h-full w-full flex-col items-center">
  <form onsubmit={handleSubmit} class="mx-auto flex w-full max-w-lg flex-col gap-4">
    <Card.Root>
      <Card.Header>
        <Card.Title>Download Reddit Post Media</Card.Title>
        <Card.Description>Enter the URL of the Reddit post you want to download media from.</Card.Description>
      </Card.Header>
      <Card.Content>
        {#if progress > 0 && progress < 100}
          <Progress class="mb-4" value={progress} />
        {/if}

        <Input id="url" name="url" autocomplete="off" placeholder="https://www.reddit.com/r/madlads/comments/1otakuo" />
        {#if inputError}
          <p class="mt-2 text-sm text-destructive">{inputError}</p>
        {/if}
      </Card.Content>
      <Card.Footer>
        <Button type="submit" class="w-full" disabled={loading}>
          {#if loading}
            <Spinner />
          {:else}
            Fetch Post
          {/if}
        </Button>
      </Card.Footer>
    </Card.Root>
  </form>

  <!-- Media Grid -->
  {#if mediaItems.length > 0}
    <div class="mx-auto mt-8 w-full max-w-6xl">
      <h2 class="mb-4 text-2xl font-bold">Fetched Media ({mediaItems.length})</h2>
      <div class="flex flex-wrap gap-4">
        {#each mediaItems as item}
          <Card.Root class="flex max-w-sm flex-[1_1_150px] flex-col overflow-hidden">
            <Card.Content class="max-h-64 p-0">
              {#if item.type === "image"}
                <img src={item.url} alt="Reddit media" class="mx-auto h-full object-cover" />
              {:else}
                <video src={item.url} controls class="mx-auto h-full object-cover"><track kind="captions" /></video>
              {/if}
            </Card.Content>
            <Card.Footer class="mt-auto flex-row gap-2 p-2">
              <Button
                class="flex-1 text-xs"
                onclick={() => downloadMedia(item.url, item.type)}
                disabled={downloadingItems.has(item.url)}
              >
                <Download />
              </Button>
              <Button variant="outline" class="flex-1 text-xs" onclick={() => window.open(item.url, "_blank")}>
                <ExternalLink />
              </Button>
            </Card.Footer>
          </Card.Root>
        {/each}
      </div>
    </div>
  {/if}
</main>
