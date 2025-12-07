const fs = require("fs");

async function run() {
  const { default: fetch } = await import("node-fetch");
  const bearer = process.env.TWITTER_BEARER_TOKEN;
  const username = "alperebicoglu";
  const userId = 2996161529;
  
/*
  // 1) Get user ID
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
  
  // 2) Fetch tweets
  res = await fetch(`https://api.twitter.com/2/users/${userId}/tweets?max_results=3`, {
    headers: { Authorization: `Bearer ${bearer}` }
  });
  const data = await res.json();

  console.log("STATUS:", res.status);
  console.log("RAW RESPONSE:", JSON.stringify(data, null, 2));
  
  if (!data.data) {
    console.log("No tweets found");
    return;
  }

  let md = "## 🐦 Latest Tweets\n\n";
  data.data.forEach(t => {
    md += `- ${t.text.replace(/\n/g, " ")}\n`;
  });

  fs.writeFileSync("TWEETS.md", md);
}

run();
