// Usage: node scripts/seed.mjs <baseUrl> <baseWalletAddress> "<creator name>"
// Publishes a few short sample articles so the marketplace is not empty for the demo.
const [base, wallet, creator = "Sample Creator"] = process.argv.slice(2);
if (!base || !/^0x[0-9a-fA-F]{40}$/.test(wallet ?? "")) {
  console.error('usage: node scripts/seed.mjs https://your-app.vercel.app 0xYourBaseWallet "Your Name"');
  process.exit(1);
}

const pieces = [
  {
    title: "x402 in plain words: how a web page asks for money",
    preview: "What HTTP 402 means, what an agent sees when a page costs money, and the three steps of paying and retrying.",
    tags: ["x402", "payments", "agents", "http"],
    price: 0.03,
    text:
      "HTTP has always had a status code for 'payment required': 402. For decades nobody used it. x402 gives it a job.\n\n" +
      "When an agent requests a paid page, the server answers 402 and attaches a short description of the price: which token, how much, and which address gets paid. " +
      "The agent signs a payment that matches that description and sends the same request again with the signed payment attached. " +
      "The server checks the payment, settles it onchain, and returns the content.\n\n" +
      "Three things make this useful for agents. There is no account or API key to create. The price is machine readable, so the agent can decide whether it is worth paying. " +
      "And the payment can go directly to the creator's wallet rather than through a platform.\n\n" +
      "The catch is trust: an agent should not pay whatever a page asks. That is why a wallet that enforces limits and asks its owner for approval matters.",
  },
  {
    title: "Reading a stablecoin yield rate without fooling yourself",
    preview: "APY versus APR, why rates move, and the four questions to ask before parking money in a vault.",
    tags: ["defi", "yield", "stablecoins", "savings"],
    price: 0.05,
    text:
      "A yield number is a snapshot, not a promise. Before trusting one, ask four questions.\n\n" +
      "1. Where does the yield come from? Lending interest from borrowers is easy to understand. Token rewards can vanish overnight.\n" +
      "2. Is the rate variable? Most lending rates move with demand. A 9% rate today can be 3% next week.\n" +
      "3. Can I withdraw at any time? Some vaults have limits when many people leave at once.\n" +
      "4. What is the worst case? Smart contract bugs and borrower defaults are the real risks, not market swings.\n\n" +
      "APR is the simple yearly rate. APY includes compounding, so it looks slightly bigger. For short periods the difference is tiny, so compare like with like.\n\n" +
      "A good habit: write down the rate, the date and the source, then check again in a week.",
  },
  {
    title: "A field guide to rainy street photography",
    preview: "Practical notes on shooting wet city streets: light, reflections, timing and keeping gear dry.",
    tags: ["photography", "rain", "street", "city", "night"],
    price: 0.02,
    text:
      "Rain turns an ordinary street into a mirror. Use it.\n\n" +
      "Light. Shoot at dusk or after dark, when signs, windows and headlights give the wet ground something to reflect. Overcast daytime rain is flat and gray.\n\n" +
      "Reflections. Get low. A puddle only reflects the scene if your camera is near its surface. Frame the subject and its reflection together.\n\n" +
      "Timing. Wait for a figure with an umbrella to cross a bright patch of light. One person in a clean frame beats a crowd.\n\n" +
      "Gear. A cheap clear shower cap over the camera works. Carry a microfiber cloth in a plastic bag, and let the camera warm up slowly indoors to avoid fogging.\n\n" +
      "Edit lightly. Rain scenes already carry contrast. Lift the shadows a little and leave the grain.",
  },
  {
    title: "How to cite an AI-assisted source honestly",
    preview: "A short, practical format for crediting the people whose work an AI agent used, including a receipt.",
    tags: ["citation", "ethics", "ai", "attribution", "writing"],
    price: 0.02,
    text:
      "If an AI agent used someone's work to write your answer, say so.\n\n" +
      "A good citation has four parts: the title, the creator's name, where it can be found, and how it was obtained. " +
      "When the work was paid for, add the receipt id so a reader can check that the creator really was paid.\n\n" +
      "Example: \"Title\" by Creator. Used under license, receipt ABC123.\n\n" +
      "Do not quote more than you need. Do not present the creator's idea as the agent's own. " +
      "And if the agent could not verify a claim, say that plainly instead of hiding it.\n\n" +
      "Attribution costs one line. It is the cheapest way to keep creators willing to share their work.",
  },
  {
    title: "Pricing a tiny piece of content: a creator's rule of thumb",
    preview: "How to choose a per-use price between one cent and one dollar, and why cheaper is often better.",
    tags: ["pricing", "creators", "micropayments", "business"],
    price: 0.04,
    text:
      "When the buyer is an agent paying per use, the price has to feel obvious.\n\n" +
      "Start from the effort a human would need to reproduce the work, then divide. A short guide that took an afternoon might be worth two to five cents per use if thousands of agents could read it. " +
      "A rare dataset or a striking image can ask for more.\n\n" +
      "Cheaper is usually better at first. Agents compare options and choose the best value, and every use also builds a public record of demand.\n\n" +
      "Watch the numbers weekly. If almost nobody pays, lower the price or improve the preview. If everyone pays instantly, you are probably too cheap.\n\n" +
      "Never price below what the work is worth to you. You can always run a sale. You cannot easily raise a price people already learned.",
  },
];

for (const p of pieces) {
  const res = await fetch(`${base.replace(/\/$/, "")}/api/refs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "text", title: p.title, preview: p.preview, text: p.text, tags: p.tags, creator, wallet, priceUsdc: p.price }),
  });
  const body = await res.json();
  console.log(res.status, body.pageUrl ?? body.error);
}
