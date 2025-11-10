// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  // Thanks to https://github.com/MinnDevelopment/fxreddit/blob/master/src/reddit/types.d.ts for the types
  namespace Reddit {
    interface RedditListingData {
      id: string;
      subreddit: string;
      permalink: string;
      title: string;
      author: string;
      original_author?: string;
      is_comment?: boolean;
      post_hint?: string; // 'image' | 'hosted:video'
      url: string;
      selftext?: string; // content in posts
      body?: string; // content in comments
      is_reddit_media_domain: boolean;
      media_only?: boolean;
      num_comments?: number; // number of comments
      domain?: string;
      thumbnail?: string;
      thumbnail_width?: number;
      thumbnail_height?: number;
      replies?: RedditListingResponse;
      media?: {
        reddit_video?: {
          fallback_url: string;
          height: number;
          width: number;
          has_audio: boolean;
        };
        oembed?: {
          thumbnail_url: string;
          thumbnail_width: number;
          thumbnail_height: number;
          width: number;
          height: number;
          title: string;
        };
      };
      preview?: {
        images?: {
          source?: { url: string; width: number; height: number };
          resolutions: { url: string; width: number; height: number }[];
        }[];
      };
      secure_media?: {
        reddit_video?: {
          fallback_url: string;
        };
      };
      secure_media_embed?: {
        media_domain_url: string;
        width: number;
        height: number;
      };
      media_metadata?: Record<
        string,
        | {
            s?: {
              y: number; // height
              x: number; // width
              u: string;
            };
          }
        | undefined
      >;
      gallery_data?: {
        items: [
          {
            caption?: string;
            media_id: string;
          },
        ];
      };
      poll_data?: PollData;
      crosspost_parent_list?: RedditListingData[];
    }

    interface RedditListingResponse {
      kind: string; // 'Listing'
      data: {
        children: {
          kind: string; // 't3'
          data: RedditListingData;
        }[];
      };
    }

    interface RedditPost {
      subreddit: string;
      title: string;
      author: string;
      comment?: RedditPost;
      post_hint: string; // 'image'
      url: string;
      permalink: string;
      description: string;
      is_reddit_media: boolean;
      is_media_only: boolean;
      preview_image_url?: string;
      domain?: string;
      resolution?: {
        width: number;
        height: number;
      };
      video_url?: string;
      video_has_audio?: boolean;
      oembed?: {
        thumbnail_url: string;
        thumbnail_width: number;
        thumbnail_height: number;
        width: number;
        height: number;
        title: string;
      };
      media_metadata?: Image[];
      secure_media_embed?: {
        media_domain_url: string;
        width: number;
        height: number;
      };
      poll_data?: PollData;
    }

    interface Image {
      url: string;
      width: number;
      height: number;
      caption?: string;
    }

    interface PollData {
      total_vote_count: number;
      voting_end_timestamp: number;
      options?: PollDataOption[];
    }

    interface PollDataOption {
      text: string;
      vote_count?: number;
    }
  }
}

export {};
