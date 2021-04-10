import { Post, PostContent } from "./skystandards";

export interface IFeedDACResponse {
  ref?: string;
  success: boolean;
  error?: string;
}

export interface IFeedDAC {
  createPost(
    content: PostContent | string,
    mentions: string[],
  ): Promise<IFeedDACResponse>;
  
  createComment(
    content: PostContent | string,
    commentTo: string,
    parent: Post | string,
    mentions: string[],
  ): Promise<IFeedDACResponse>;

  createRepost(
    repostOf: string,
    parent: Post | string,
    mentions: string[],
  ): Promise<IFeedDACResponse>
}