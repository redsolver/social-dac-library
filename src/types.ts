
export interface ISocialDACResponse {
  // ref?: string;
  success: boolean;
  error?: string;
}

export interface IUserRelations {
  $schema: string;
  _self: string; // back reference to the path

  relationType: string;

  relations: { [key: string]: any };
}


export interface IDictionary {
  [key: string]: boolean;
}

export interface ISocialDAC {

  // Requires login
  follow(userId: string): Promise<ISocialDACResponse>;
  unfollow(userId: string): Promise<ISocialDACResponse>;

  // isFollowing(userId: string): Promise<boolean>;

}