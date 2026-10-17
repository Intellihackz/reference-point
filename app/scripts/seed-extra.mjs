// Usage: node scripts/seed-extra.mjs <baseUrl> <baseWalletAddress> "<creator name>"
// Publishes one extra piece: break-up text templates.
const [base, wallet, creator = "Sample Creator"] = process.argv.slice(2);
if (!base || !/^0x[0-9a-fA-F]{40}$/.test(wallet ?? "")) {
  console.error('usage: node scripts/seed-extra.mjs https://your-app.vercel.app 0xYourBaseWallet "Your Name"');
  process.exit(1);
}

const piece = {
  title: "Break-up text templates: say it kindly and clearly",
  preview: "Five ready-to-send templates for ending a relationship by text, from a few dates to a long relationship, plus what to avoid.",
  tags: ["relationships", "breakup", "text", "template", "communication", "dating"],
  price: 0.03,
  text:
    "A text is not the right way to end every relationship. It works when things are early or casual, when distance makes a conversation hard, or when you do not feel safe talking face to face. For a long or serious relationship, a call or a conversation in person is kinder if you can manage it.\n\n" +
    "The structure of a kind, clear break-up text:\n" +
    "1. Say it in the first sentence. Do not make them read three paragraphs to find out.\n" +
    "2. Use 'I' statements. 'I do not want to continue' is clearer and less hurtful than a list of their faults.\n" +
    "3. Give one honest reason, kept short. You do not owe a full explanation.\n" +
    "4. Thank them for something real.\n" +
    "5. Close the door gently, and say what happens next if it matters.\n" +
    "6. If you are sure, leave no room for negotiation. Avoid 'maybe later' or 'I need time'.\n\n" +
    "Template A, after a few dates:\n" +
    "'Hi Sam, I have enjoyed getting to know you, but I do not feel the connection I would want in order to keep going. I wanted to tell you honestly rather than let it fade. Thank you for the nice evenings. I wish you well.'\n\n" +
    "Template B, a few months in:\n" +
    "'Hi Sam, I need to be honest. I have thought about this a lot, and I do not want to continue our relationship. I care about you and I am grateful for the time we had, but it is not what I am looking for right now. I would rather say this kindly and clearly than let things drag on. Take care of yourself.'\n\n" +
    "Template C, long distance:\n" +
    "'Sam, I have been thinking about us for a while. The distance has made it hard for me to feel close, and I do not think that is going to change. I am ending our relationship. I am sorry to do this over text, and I want you to know it is not because of anything you did wrong. Thank you for everything good between us.'\n\n" +
    "Template D, a long relationship when a conversation is not possible:\n" +
    "'I have decided to end our relationship. I did not make this decision lightly. I am asking for space, and I would like us not to contact each other for a while. I wish you well.'\n\n" +
    "Template E, when they keep reaching out afterwards:\n" +
    "'I told you I do not want to continue, and my answer has not changed. I will not be replying to more messages. I wish you well.'\n\n" +
    "What to avoid: saying 'let us stay friends' if you do not mean it, blaming or listing faults, a long essay, sending it while angry or tired, calling it 'a break' when you mean an ending, and posting about it publicly before they have read it.\n\n" +
    "After you send it: you do not need to reply to arguments or questions that try to reopen the decision. Mute notifications if you need to, tell a friend what you did, and arrange the return of belongings by message. If you ever feel unsafe, do not meet in person, keep the messages, and contact someone you trust or a local support service.",
};

const res = await fetch(`${base.replace(/\/$/, "")}/api/refs`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ kind: "text", title: piece.title, preview: piece.preview, text: piece.text, tags: piece.tags, creator, wallet, priceUsdc: piece.price }),
});
const body = await res.json();
console.log(res.status, body.pageUrl ?? body.error, "|", piece.title);
