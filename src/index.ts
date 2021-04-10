import { CustomConnectorOptions, DacLibrary, SkynetClient } from "skynet-js";
import { PermCategory, Permission, PermType } from "skynet-mysky-utils";
import { PostContent, Convert, Post } from "./skystandards";

import {
  
  IFeedDACResponse, IFeedDAC
  
} from "./types";

const DAC_DOMAIN = "skyfeed-dev.hns";

export class FeedDAC extends DacLibrary implements IFeedDAC {
  public constructor() {
    super(DAC_DOMAIN);
  }

  public getPermissions(): Permission[] {
    return [
      new Permission(
        DAC_DOMAIN,
        DAC_DOMAIN,
        PermCategory.Discoverable,
        PermType.Read
      ),
      new Permission(
        DAC_DOMAIN,
        DAC_DOMAIN,
        PermCategory.Discoverable,
        PermType.Write
      ),
    ];
  }

  public async createPost(
    content: PostContent | string,
    mentions: string[] = [],
  ): Promise<IFeedDACResponse> {
    if (!this.connector) {
      throw new Error("Connector not initialized");
    }

    if(typeof content === 'string'){
      content = Convert.toPostContent(content);
    }

    return await this.connector.connection
      .remoteHandle()
      .call("createPost", content, mentions);
  }

  public async createComment(
    content: PostContent | string,
    commentTo: string,
    parent: Post | string,
    mentions: string[] = []
  ): Promise<IFeedDACResponse> {
    if (!this.connector) {
      throw new Error("Connector not initialized");
    }

    if(typeof content === 'string'){
      content = Convert.toPostContent(content);
    }

    if(typeof parent === 'string'){
      parent = Convert.toPost(parent);
    }

    return await this.connector.connection
      .remoteHandle()
      .call("createComment", content,
      commentTo,
      parent,
      mentions);
  }

  public async createRepost(
    repostOf: string,
    parent: Post | string,
    mentions: string[] = [],
  ): Promise<IFeedDACResponse> {
    if (!this.connector) {
      throw new Error("Connector not initialized");
    }
    if(typeof parent === 'string'){
      parent = Convert.toPost(parent);
    }

    return await this.connector.connection
      .remoteHandle()
      .call("createRepost", repostOf, parent,mentions);
  }
}
