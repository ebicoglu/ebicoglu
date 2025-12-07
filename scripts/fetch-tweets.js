const fs = require("fs");

async function run() {
  const fetch = (await import("node-fetch")).default;

  const username = "alperebicoglu";
  const count = 3;
  const bearer = process.env.TWITTER_BEARER_TOKEN;

  const url = `https://api.twitter.com/2/tweets/search/recent?query=from:${username}&max_results=${count}&tweet.fields=created_at,text`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${bearer}`,
    },
  });

  const data = await res.json();

  if (!data.data) {
    console.error("No tweets found");
    return;
  }

  let content = "## 🐦 Latest Tweets\n\n";
  data.data.forEach((t) => {
    content += `- ${t.text.replace(/\n/g, " ")}\n`;
  });

  fs.writeFileSync("TWEETS.md", content);
}

run();
