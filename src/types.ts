import { Post, PostContent } from "./skystandards";

export interface IFeedDACResponse {
  ref?: string;
  success: boolean;
  error?: string;
}

export interface IIndex {
  version: number;

  currPageNumber: number;
  currPageNumEntries: number;

  latestItemTimestamp?: number;
  // pages: string[];
  pageSize: number;
}

export interface IPage {
  $schema: string;

  _self: string; // back reference to the path
  indexPath: string; // back reference to the index

  items: Post[];
}

export interface IDictionary {
  [key: string]: boolean;
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