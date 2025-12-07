const fs = require("fs");

async function run() {
  const { default: fetch } = await import("node-fetch");
  const bearer = process.env.TWITTER_BEARER_TOKEN;
  const userId = 2996161529;
  const maxTweetCount = 5;
  
  
/*
  // Get user ID
  let res = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
    headers: { Authorization: `Bearer ${bearer}` }
  });
  let u = await res.json();
  if (!u.data) {
    console.error("No user data:", u);
    return;
  }
  const userId = u.data.id; //2996161529
  console.log("UserId:" + userId);
*/

  // 1) Fetch tweets
  const res = await fetch(
    `https://api.twitter.com/2/users/${userId}/tweets?max_results=${maxTweetCount}`,
    {
      headers: { Authorization: `Bearer ${bearer}` }
    }
  );

  const data = await res.json();

  // Throw on non-200 status
  if (!res.ok) {
    throw new Error(
      `Twitter API Error (Status ${res.status}): ${JSON.stringify(data, null, 2)}`
    );
  }

  if (!data.data) {
    console.log("No tweets found");
    return;
  }

  // Build markdown bullet list
  let tweetMd = "";
  data.data.forEach(t => {
    tweetMd += `- ${t.text.replace(/\n/g, " ")}\n`;
  });

  // Read README
  let readme = fs.readFileSync("README.md", "utf8");

  const startTag = "<!-- TWEETS:START -->";
  const endTag = "<!-- TWEETS:END -->";

  const newContent =
    startTag +
    "\n\n" +
    tweetMd +
    "\n" +
    endTag;

  // Replace the section
  const updatedReadme = readme.replace(
    new RegExp(`${startTag}[\\s\\S]*?${endTag}`),
    newContent
  );

  fs.writeFileSync("README.md", updatedReadme);
  console.log("README.md updated with latest tweets!");
}

run();
