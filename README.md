# Social DAC for MySky

Forked from `feed-dac-library`.

This DAC uses the https://github.com/SkynetHQ/skystandards data structures

## Usage

Using the library is very straightforward. In this section we'll show an example
of how a skapp could use the content record library and record user interactions.

TODO Update example

```typescript
import { SkynetClient } from "skynet-js";
import { SocialDAC } from "social-dac-library";

(async () => {
  // create client
  const client = new SkynetClient();

  // create Social DAC
  const socialDAC = new SocialDAC();

  // load mysky
  const mySky = await client.loadMySky("exampleskapp.hns");

  // load DACs
  await mySky.loadDacs(socialDAC);

  // check login
  const isLoggedIn = await mySky.checkLogin();
  if (!isLoggedIn) {
    // request login access
  }

  // Follow a user

  const res = await socialDAC.follow("USERIDUSERIDUSERIDUSERIDUSERIDUSERID")
  console.log(`Success: ${res.success}`);
  console.log(`Error (if unsuccessful): ${res.error}`);

  // Get the list of users a user is following
  const followingList = await socialDAC.getFollowingForUser("USERIDUSERIDUSERIDUSERIDUSERIDUSERID")
  console.log(followingList);
})();
```
