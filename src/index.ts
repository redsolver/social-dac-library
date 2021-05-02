import { CustomConnectorOptions, DacLibrary, MySky, SkynetClient } from "skynet-js";
import { PermCategory, Permission, PermType } from "skynet-mysky-utils";
import { PostContent, Convert, Post } from "./skystandards";

import {
  ISocialDACResponse, ISocialDAC, IDictionary, IUserRelations
} from "./types";

const DAC_DOMAIN = "social-dac.hns";

export class SocialDAC extends DacLibrary implements ISocialDAC {
  public constructor() {
    super(DAC_DOMAIN);
  }

  client: SkynetClient | undefined

  async init(client: SkynetClient, customOptions: CustomConnectorOptions): Promise<void> {
    this.client = client;

    return super.init(client, customOptions);
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

/*   public async isFollowing( // TODO Implement
    userId: string
  ): Promise<boolean> { // TODO Get logged-in userId using the DAC
    const map = await null;
    return false;
  } */

  public async getFollowingForUser(userId: string): Promise<string[]> { // TODO Caching
    if (typeof this.client === "undefined") {
      throw Error('SocialDAC: SkynetClient not initialized')
    }


    if (userId.startsWith('ed25519-')) {
      userId = userId.substring(8);
    } else {
      throw Error('SocialDAC: Unsupported userId format')
    }

    let skappsIndex = await this.downloadFile<IDictionary>(userId, `${DAC_DOMAIN}/skapps.json`);
    if (!skappsIndex) {
      return [];
    }

    const promiseList: Promise<{ [key: string]: any }>[] = [];


    for (const skapp of Object.keys(skappsIndex)) {
      promiseList.push(this.fetchUserRelationsPage(userId, skapp));
    }

    const list = await Promise.all(promiseList);

    const allUserRelations: { [key: string]: any } = Object.assign({}, ...list);

    return Object.keys(allUserRelations);
  }

  private async fetchUserRelationsPage(userId: string, skapp: string): Promise<{ [key: string]: any }> {

    const userRelations = await this.downloadFile<IUserRelations>(userId, `${DAC_DOMAIN}/${skapp}/following.json`);

    if (!userRelations) {
      return {};
    }

    return userRelations.relations;
  }

  public async getFollowingCountForUser(userId: string): Promise<number> {

    const following = await this.getFollowingForUser(userId);

    return Object.keys(following).length;
  }


  public async follow(
    userId: string
  ): Promise<ISocialDACResponse> {
    if (!this.connector) {
      throw new Error("Connector not initialized");
    }


    return await this.connector.connection
      .remoteHandle()
      .call("follow", userId);
  }

  public async unfollow(
    userId: string
  ): Promise<ISocialDACResponse> {
    if (!this.connector) {
      throw new Error("Connector not initialized");
    }
    return await this.connector.connection
      .remoteHandle()
      .call("unfollow", userId);
  }



  // downloadFile merely wraps getJSON but is typed in a way that avoids
  // repeating the awkward "as unknown as T" everywhere
  private async downloadFile<T>(userId: string, path: string): Promise<T | null> {

    if (typeof this.client === "undefined") {
      throw Error('SocialDAC: SkynetClient not initialized')
    }

    console.log("downloading file at path", path);
    const { data } = await this.client.file.getJSON(userId, path);
    if (!data) {
      console.log("no data found at path", path);
      return null;
    }
    console.log("data found at path", path, data);
    return (data as unknown) as T;
  }
}
