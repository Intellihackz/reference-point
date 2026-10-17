// Usage: node scripts/seed-more.mjs <baseUrl> <baseWalletAddress> "<creator name>"
// Publishes a second batch of original, practical and creative pieces.
const [base, wallet, creator = "Sample Creator"] = process.argv.slice(2);
if (!base || !/^0x[0-9a-fA-F]{40}$/.test(wallet ?? "")) {
  console.error('usage: node scripts/seed-more.mjs https://your-app.vercel.app 0xYourBaseWallet "Your Name"');
  process.exit(1);
}

const pieces = [
  {
    title: "A cold email that gets replies: the five-line template",
    preview: "A short structure for first-contact emails, with a worked example and the mistakes that get messages ignored.",
    tags: ["email", "outreach", "writing", "business", "template"],
    price: 0.05,
    text:
      "Most cold emails fail in the first line, because they are about the sender. Use five lines.\n\n" +
      "Subject: say what it is about in under six words. Plain beats clever.\n" +
      "Line 1: one specific thing you noticed about them. Not flattery, a fact. 'Your June post on onboarding emails changed how I think about the first day.'\n" +
      "Line 2: why you are writing, in one sentence. 'I run a small tool that cuts that first-day setup to ten minutes.'\n" +
      "Line 3: one small, easy ask. 'Would it be useful if I sent a two-minute demo?'\n" +
      "Line 4: an easy way out. 'If the timing is wrong, no problem at all.'\n" +
      "Line 5: your name and one link, nothing else.\n\n" +
      "Worked example:\nSubject: Faster first-day setup\nHi Amara, your June post on onboarding emails changed how I think about the first day. I run a small tool that cuts that setup to ten minutes. Would a two-minute demo be useful? If the timing is wrong, no problem. Tomas, tomas.example\n\n" +
      "Mistakes to avoid: three paragraphs about yourself, attachments in a first email, asking for a call before they know who you are, and follow-ups that only say 'bumping this'. If you follow up, add something new: a relevant link or a result.",
  },
  {
    title: "Caption formulas that never run dry",
    preview: "Five repeatable structures for social captions, each with a fill-in-the-blank example you can use today.",
    tags: ["captions", "social media", "instagram", "writing", "template"],
    price: 0.03,
    text:
      "When you stare at a blank caption box, pick a formula instead of waiting for inspiration.\n\n" +
      "1. Hook, detail, question. 'Nobody tells you [surprising thing]. Here is [specific detail]. Has this happened to you?'\n" +
      "2. Micro-story in three beats. 'I almost [skipped it]. Then [small turn]. Now [result or feeling].'\n" +
      "3. List of three. 'Three things I learned from [experience]: [one], [two], [three].'\n" +
      "4. Contrast. 'Everyone says [common belief]. What actually worked for me: [opposite].'\n" +
      "5. Invitation. 'I am doing [thing] on [day]. Come if you [reason]. Details in the link.'\n\n" +
      "Rules of thumb: put the interesting words in the first line, because most feeds cut the rest. Use one idea per caption. Write the way you would say it to a friend. End with one clear action or question, not three.\n\n" +
      "Quick edit pass: delete the first sentence if it only warms up, replace vague words (amazing, great) with a detail, and read it aloud once.",
  },
  {
    title: "Poetic lines for the ocean",
    preview: "Ten original one-line poems about the sea, tides and shorelines, for captions, cards and quiet moments.",
    tags: ["poetry", "ocean", "sea", "nature", "verse", "captions"],
    price: 0.02,
    text:
      "The tide keeps its promises in small, wet handwriting along the sand.\n" +
      "Every wave is the sea clearing its throat before a very old story.\n" +
      "Gulls write loose cursive on the wind and never finish a word.\n" +
      "The horizon is where the sky and the water agree to disagree.\n" +
      "Salt is just the ocean's way of staying in touch.\n" +
      "A shell is a quiet house the sea forgot to lock.\n" +
      "At night the water borrows the moon and returns it a little silver.\n" +
      "The shoreline erases your footprints and keeps the feeling.\n" +
      "Boats leave like questions and come back like answers.\n" +
      "Stand where the foam ends and you will understand how patience sounds.",
  },
  {
    title: "Poetic lines for rain and city nights",
    preview: "Ten original one-line poems about wet streets, neon reflections and late-night windows.",
    tags: ["poetry", "rain", "city", "night", "verse", "captions"],
    price: 0.02,
    text:
      "Rain turns every streetlight into a small, borrowed moon.\n" +
      "The city sounds softer when the sky is doing the talking.\n" +
      "Puddles hold the neon like a secret they plan to keep until morning.\n" +
      "Umbrellas bloom in a hurry and close without saying goodbye.\n" +
      "A lit window at midnight is someone else's quiet story, glowing.\n" +
      "The last train carries a hundred separate silences, and none of them are lonely.\n" +
      "Wet pavement is the city holding a mirror up to itself.\n" +
      "Somewhere above the rooftops the rain is still rehearsing its applause.\n" +
      "Footsteps in the rain keep time with a song nobody wrote down.\n" +
      "The night shift hums, and the street answers in soft, silver static.",
  },
  {
    title: "Twelve story openers to start any short story",
    preview: "Twelve first lines in different moods, plus a simple method for turning one into a finished scene.",
    tags: ["writing", "fiction", "story", "prompts", "creative"],
    price: 0.03,
    text:
      "A first line has one job: make the reader need the second one. Twelve to borrow or bend.\n\n" +
      "1. The letter arrived three days after the person who wrote it stopped existing.\n" +
      "2. Nobody on the bus noticed that the driver had changed, except Imani.\n" +
      "3. By the time the lighthouse keeper counted the ships, there were seven too many.\n" +
      "4. I inherited a house, a debt, and a very polite ghost.\n" +
      "5. The map was accurate in every way except that it showed a door where there was a wall.\n" +
      "6. It was the fourth Tuesday in a row that the clock in the square struck thirteen.\n" +
      "7. My brother taught me to lie, and then he asked me never to lie to him.\n" +
      "8. The recipe called for one ingredient nobody was willing to name.\n" +
      "9. On the day the river changed direction, the town finally had to talk.\n" +
      "10. She kept the spare key under a flowerpot for a house she no longer owned.\n" +
      "11. The new neighbor returned everything we lent him, including things we never gave.\n" +
      "12. We were told the storm would pass. We were not told what it would leave.\n\n" +
      "Turn one into a scene: choose a line, write who wants what in one sentence, add one obstacle, and end the scene on a choice rather than an answer.",
  },
  {
    title: "A product description checklist for small online shops",
    preview: "What to include so shoppers can decide quickly, from the first line to care instructions and returns.",
    tags: ["ecommerce", "copywriting", "shop", "product", "checklist"],
    price: 0.04,
    text:
      "A good product description answers the questions a shopper would ask a shop assistant.\n\n" +
      "First line: what it is and who it is for, in plain words. 'A linen shirt for warm weather, cut loose at the shoulders.'\n" +
      "Benefits before features. Say what it does for the buyer, then the detail that proves it.\n" +
      "Concrete details: size or dimensions, materials, weight, colors, and what is included in the box.\n" +
      "Fit and use: how it fits, how it is used, and one realistic situation. Avoid superlatives you cannot back up.\n" +
      "Care and durability: washing or cleaning instructions, expected wear, and any limits.\n" +
      "Shipping and returns in one clear line, close to the buy button, not buried in a policy page.\n" +
      "Honest limits: if it runs small or needs assembly, say so. It prevents returns and builds trust.\n\n" +
      "Format: short paragraphs, a few bullets for specs, and one sentence of voice that sounds like your brand. Read the page out loud. If a sentence could describe any product, rewrite it so it could only describe this one.",
  },
  {
    title: "How to write a bug report developers will thank you for",
    preview: "A seven-part structure for clear, reproducible bug reports, with an example and what to leave out.",
    tags: ["software", "bug report", "testing", "template", "developers"],
    price: 0.04,
    text:
      "A good bug report lets someone reproduce the problem without asking you anything.\n\n" +
      "1. Title: what broke and where. 'Checkout button does nothing after applying a discount code.'\n" +
      "2. Environment: app version, device, operating system, browser, and whether you were logged in.\n" +
      "3. Steps to reproduce: numbered, one action per step, starting from a clean state.\n" +
      "4. Expected result: what you thought would happen.\n" +
      "5. Actual result: what happened instead, including exact error messages.\n" +
      "6. Frequency: every time, sometimes, or once. If sometimes, note what seems to change it.\n" +
      "7. Evidence: a screenshot, a short screen recording, or logs, with private data removed.\n\n" +
      "Example:\nTitle: Cart total shows $0 after removing the last item\nSteps: 1. Add one item. 2. Open the cart. 3. Remove the item. 4. Add a different item.\nExpected: total matches the new item. Actual: total stays $0.00 until refresh. Frequency: every time on mobile Safari, never on desktop.\n\n" +
      "Leave out: opinions about the code, several unrelated problems in one report, and guesses presented as facts. One bug per report.",
  },
  {
    title: "A meeting agenda template that keeps meetings short",
    preview: "A one-page agenda format with time boxes, owners and a decision log, plus rules for ending on time.",
    tags: ["meetings", "productivity", "template", "work", "agenda"],
    price: 0.03,
    text:
      "Most meetings run long because nobody decided what they were for. Use this one-page agenda.\n\n" +
      "Top of the page: purpose in one sentence ('Decide the launch date') and the outcome you need ('One date, one owner').\n" +
      "Attendees: only people who must decide or deliver. Everyone else gets the notes.\n" +
      "Agenda items: each with an owner and a time box. 'Launch risks, Dana, 10 minutes.' Total time should be shorter than the slot.\n" +
      "Pre-reads: send them a day before and put the link in the invite, not in the room.\n" +
      "Decision log: a running list of what was decided, by whom, and the next action with a date.\n" +
      "Parking lot: anything off topic goes here and gets an owner after the meeting.\n\n" +
      "Rules that help: start on time without recapping for latecomers, assign a note-taker before you begin, and stop each item when its time box ends by deciding or assigning a follow-up. End five minutes early and read the decisions back aloud.\n\n" +
      "If a meeting has no decision to make, replace it with a short written update.",
  },
  {
    title: "A wedding toast in four parts",
    preview: "A simple structure for a toast that lands: opening, a story, a turn toward the couple, and a raised glass.",
    tags: ["wedding", "speech", "toast", "writing", "event"],
    price: 0.03,
    text:
      "A good toast is short, specific and kind. Aim for two to three minutes.\n\n" +
      "1. Opening, 20 seconds. Say who you are and how you know the couple. 'For those who do not know me, I have been Priya's friend since we shared a very small apartment.'\n" +
      "2. One story, 60 to 90 seconds. Pick a single moment that shows who one of them is. A small, true story beats a list of qualities.\n" +
      "3. The turn, 30 seconds. Connect the story to the couple together. What do you see when they are in a room? What did their relationship change?\n" +
      "4. The raised glass, 15 seconds. A wish in one sentence, then 'Please raise a glass to...' and their names.\n\n" +
      "Do: practice out loud, keep the stories kind, and speak slowly. Do not: mention exes, tell inside jokes the room cannot follow, read from your phone for the whole speech, or run past five minutes.\n\n" +
      "Template to fill: 'I met [name] when [moment]. I knew [name] was [quality] the day [story]. Then [partner] arrived, and [what changed]. So here is to [wish]. Please raise your glasses to [names].'",
  },
  {
    title: "Eight ways to open a thank-you note",
    preview: "Opening lines for thank-you messages in different situations, with a short formula for the rest of the note.",
    tags: ["thank you", "writing", "cards", "etiquette", "template"],
    price: 0.02,
    text:
      "A thank-you note works when it is specific. Start with one of these, then add a detail.\n\n" +
      "1. For a gift: 'Thank you for the [gift]. I have already used it for [specific use].'\n" +
      "2. For help: 'I could not have finished [task] without you. Thank you for giving me your afternoon.'\n" +
      "3. For hosting: 'Thank you for having us. The [dish or moment] is what I keep thinking about.'\n" +
      "4. For advice: 'Your suggestion to [advice] changed what I did next, and it worked.'\n" +
      "5. For a recommendation: 'Thank you for speaking up for me. I know it carried weight.'\n" +
      "6. For support in a hard time: 'I do not have the right words, but I wanted you to know how much your [message or visit] meant.'\n" +
      "7. For a team: 'Thank you for the extra hours on [project]. The result is better because of you.'\n" +
      "8. For a customer: 'Thank you for trusting us with [order]. If anything is not right, tell me and I will fix it.'\n\n" +
      "Formula: thanks, one specific detail, what it made possible, a warm close. Three or four sentences is enough. Send it within a week, and handwrite it when you can.",
  },
  {
    title: "Quiet motivation: twelve lines for the morning",
    preview: "Twelve original lines to start a day without clichés, for captions, journals and desk notes.",
    tags: ["motivation", "morning", "quotes", "captions", "mindset"],
    price: 0.02,
    text:
      "You do not need the whole staircase, only the first step you can see.\n" +
      "Begin badly. A rough start is still a start.\n" +
      "Today is made of small hours, and you can win one of them.\n" +
      "Be the kind of tired that comes from trying, not from waiting.\n" +
      "Progress is quiet. It rarely announces itself.\n" +
      "Make the bed, open the window, and let the day find you ready enough.\n" +
      "You are allowed to be unfinished and still be on your way.\n" +
      "Do the next right thing, then the one after that.\n" +
      "Some mornings the goal is only to show up. Show up.\n" +
      "Your future self is already grateful for the ten minutes you give today.\n" +
      "Coffee first, doubt later, work in between.\n" +
      "Small and steady beats loud and brief.",
  },
  {
    title: "Naming a small business: a practical method",
    preview: "A step-by-step way to find, test and check a business name, from brainstorming to a final sanity check.",
    tags: ["business", "naming", "startup", "branding", "guide"],
    price: 0.05,
    text:
      "A good name is easy to say, easy to spell, and not already taken. Use this method.\n\n" +
      "1. Write the job. In one sentence, what do you do and for whom? Names that feel right usually come from a clear job.\n" +
      "2. Collect words. List 30 words in four buckets: what you do, how it feels, your place or origin, and invented words.\n" +
      "3. Combine and trim. Pair words, shorten them, and say each aloud. Cross out anything awkward on a phone call.\n" +
      "4. Shortlist five. Choose names that are short, distinct, and not easily confused with a well-known brand.\n" +
      "5. Test with people. Say each name to five people. Later ask them to write it down. Mistakes in spelling are a warning sign.\n" +
      "6. Check availability. Search the web and social handles, look for a matching domain, and check your local business and trademark registers. Ask a professional if the stakes are high.\n" +
      "7. Check meaning. Make sure the name does not mean something unfortunate in the languages your customers speak.\n" +
      "8. Decide and move on. A fine name used well beats a perfect name still being debated.\n\n" +
      "Avoid names that are hard to spell, too similar to a competitor, or tied to one product you may outgrow.",
  },
  {
    title: "A weekly review in fifteen minutes",
    preview: "A simple Friday routine to look back, clear loose ends and choose three priorities for the next week.",
    tags: ["productivity", "planning", "routine", "review", "habits"],
    price: 0.03,
    text:
      "A weekly review keeps small problems from becoming big ones. Set a timer for fifteen minutes.\n\n" +
      "Minutes 1 to 4: look back. Scan your calendar and notes. Write three things that went well and one thing that did not.\n" +
      "Minutes 5 to 8: clear loose ends. Empty your inbox of anything that takes under two minutes. Move the rest to a task list. Close tabs and notes you finished.\n" +
      "Minutes 9 to 12: look ahead. Check next week's calendar for conflicts and deadlines. Move anything that cannot realistically fit.\n" +
      "Minutes 13 to 15: choose three priorities. Write the three outcomes that would make next week a good one, and the first action for each.\n\n" +
      "Keep it light: the same time and place each week, a single page of notes, and no new tools required. If you skip a week, do the short version: only the three priorities.\n\n" +
      "Questions to keep on the page: What gave me energy? What drained it? What am I avoiding? What can I stop doing?",
  },
  {
    title: "Writing useful alt text for images",
    preview: "How to describe images for people using screen readers, with simple rules and before and after examples.",
    tags: ["accessibility", "alt text", "images", "web", "writing"],
    price: 0.03,
    text:
      "Alt text describes an image for people who cannot see it. Good alt text is short and useful.\n\n" +
      "Rules:\n" +
      "1. Describe what matters in context. Ask what you would say if you were reading the page aloud over the phone.\n" +
      "2. Keep it brief, usually one sentence. Put long explanations in the page text.\n" +
      "3. Skip 'image of' or 'picture of'. Screen readers already announce it is an image.\n" +
      "4. Include text that appears in the image, word for word.\n" +
      "5. For purely decorative images, use empty alt text so screen readers skip them.\n" +
      "6. For charts, give the main finding in the alt text and the data in a nearby table.\n" +
      "7. For links and buttons, describe the destination or action, not the picture.\n\n" +
      "Before and after:\nBefore: 'photo1.jpg'\nAfter: 'A baker sliding a tray of sourdough loaves out of a stone oven.'\n\n" +
      "Before: 'Chart'\nAfter: 'Line chart showing monthly signups rising from 200 in January to 900 in June.'\n\n" +
      "Check your work by asking: does the page still make sense if the image never loads?",
  },
];

for (const p of pieces) {
  const res = await fetch(`${base.replace(/\/$/, "")}/api/refs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "text", title: p.title, preview: p.preview, text: p.text, tags: p.tags, creator, wallet, priceUsdc: p.price }),
  });
  const body = await res.json();
  console.log(res.status, body.pageUrl ?? body.error, "|", p.title);
}
