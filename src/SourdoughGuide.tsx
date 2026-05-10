import { useState } from "react";

const TABS = ["schedule", "flour", "stages", "recipes", "rye"] as const;
type Tab = typeof TABS[number];
const TAB_LABELS: Record<Tab, string> = { schedule: "📅 Schedule", flour: "🌾 Flour", stages: "🔬 Why each stage", recipes: "🍞 More recipes", rye: "🌾 Rye loaf" };

const days = [
  {
    day: "Friday",
    label: "Day 1",
    color: "#E1F5EE", border: "#0F6E56", text: "#085041",
    steps: [{
      time: "6pm", icon: "1", title: "Wake-up feed 1 — leave overnight",
      detail: "Take the starter out of the fridge. Discard down to 30g, then add:\n• 24g strong white bread flour\n• 6g rye flour\n• 30g water\n\nMix well until no dry flour remains. Mark the level on the jar with a rubber band or a piece of tape so you can track how much it rises. Cover with a loose lid or a plate resting on top — not a cloth, which dries the surface out and causes a hard crust.\n\nLeave on the counter overnight at room temperature (ideally 21–24°C). By morning it should have visibly risen and smell yeasty and slightly sour."
    }]
  },
  {
    day: "Saturday",
    label: "Day 2 — Mix dough",
    color: "#FAEEDA", border: "#854F0B", text: "#633806",
    steps: [
      {
        time: "Morning (~8am)", icon: "1", title: "Wake-up feed 2",
        detail: "Your starter should have risen and be bubbly. Discard down to 30g, then add:\n• 24g strong white bread flour\n• 6g rye flour\n• 30g water\n\nLeave on the counter. It should peak within 4–6 hours.\n\nOptional float test: drop a spoonful into water. If it floats, it's already active enough to bake with."
      },
      {
        time: "When starter peaks (~1–2pm)", icon: "2", title: "Autolyse + mix dough",
        detail: "Take out 90g of starter for the bread. Put the rest back in the fridge.\n\nMix your autolyse:\n• 450g strong white bread flour\n• 320g lukewarm water\n\nCover and rest 30–60 minutes, then add:\n• 90g active starter\n• 9g fine salt\n\nSqueeze and fold everything together until well combined. It'll feel shaggy — that's normal.\n\nOptional: save a marble-sized piece of dough in a glass of water as an 'aliquot' to track fermentation."
      },
      {
        time: "Over the next 2 hours", icon: "3", title: "Stretch and folds",
        detail: "Do 4–5 sets of stretch and folds, one set every 30 minutes:\n\n• Wet your hand\n• Grab one side of the dough, stretch it up as high as it'll go without tearing\n• Fold it over to the opposite side\n• Rotate the bowl 90° and repeat — 4 times per set\n\nDon't skip these — they build the gluten network that stops your loaf spreading flat."
      },
      {
        time: "~5–9pm", icon: "4", title: "Bulk ferment",
        detail: "Leave the dough covered at room temperature until it has grown 50–75%, looks bubbly and feels jiggly. This will take roughly 3–4 hours depending on your kitchen temperature.\n\nUse the aliquot jar as a guide — when the small piece has risen by 50–75%, the dough is ready."
      },
      {
        time: "Before bed", icon: "5", title: "Pre-shape + final shape + fridge",
        detail: "Pre-shape: tip dough onto an unfloured surface, fold edges in, rotate into a rough round. Rest uncovered 20 minutes.\n\nFinal shape: gently flatten, fold sides in, roll towards you to build surface tension. Place seam-side UP in a well-floured banneton or bowl.\n\nCover tightly with a plastic bag or shower cap and place in the fridge."
      }
    ]
  },
  {
    day: "Sunday – Monday",
    label: "48h cold retard",
    color: "#EEEDFE", border: "#534AB7", text: "#3C3489",
    steps: [{
      time: "All weekend", icon: "❄", title: "The fridge does the work — 48 hours",
      detail: "Your shaped dough cold-proofs for a full 48 hours. This is the key change from your first bake — the longer cold retard is what develops the deep, complex, wheaty flavour you were after.\n\nDon't touch it. It will sit happily in the fridge until Monday evening."
    }]
  },
  {
    day: "Monday",
    label: "Bake day!",
    color: "#EAF3DE", border: "#3B6D11", text: "#27500A",
    steps: [
      {
        time: "5pm — 1 hour before baking", icon: "1", title: "Preheat oven + vessel",
        detail: "Place your baking vessel in the oven and preheat to 240°C conventional heat (not fan — fan disperses steam too quickly).\n\nYour options, best to worst:\n\n🥇 Lidded casserole dish — almost as good as a Dutch oven\n🥈 Two roasting tins — one to bake on, one upturned on top\n🥉 Single roasting tin + boiling water — place tin on middle shelf, put an empty deep tin on the oven floor\n\nPreheat for at least 45–60 minutes. The vessel must be very hot."
      },
      {
        time: "6pm", icon: "2", title: "Score + load the oven",
        detail: "Take the dough straight from the fridge — bake it cold, do not let it warm up.\n\nTip onto baking parchment, seam-side down. Score with one confident slash at 30–45° angle, about 1cm deep. Use a razor blade (lame) or very sharp serrated knife.\n\nSlide into the hot oven. If using the water method, immediately pour a full kettle of boiling water into the bottom tin and shut the door fast.\n\nBake 20 minutes with steam/lid on."
      },
      {
        time: "After 20 minutes", icon: "3", title: "Remove lid — bake uncovered",
        detail: "Remove the lid or water tin. You can switch to fan now for more even colour.\n\nBake at 220°C for 20–25 more minutes until the crust is a deep mahogany brown. Don't be scared of colour!\n\nShelf tip: position the shelf one lower than you think to avoid scorching the top. Only reduce temperature if it's still scorching after moving the shelf."
      },
      {
        time: "Out of the oven", icon: "4", title: "Rest — the hardest step",
        detail: "Transfer to a wire rack immediately. Do NOT cut for at least 1 hour, ideally 2 hours.\n\nThe interior is still cooking and the crumb is setting. Cutting too soon gives a gummy interior.\n\nListen for the crust crackle — it's called 'the singing of the bread'. 🎶"
      }
    ]
  }
];

const stages = [
  {
    name: "Feeding the starter", icon: "🫙",
    why: "Your starter is a living culture of wild yeast and bacteria. Feeding gives them fresh flour to eat, which produces CO₂ (the gas that makes bread rise) and lactic/acetic acids (the flavour). Without feeding, they starve and the starter becomes too acidic and weak to leaven bread.",
    whatCanGoWrong: [
      { problem: "Starter doesn't rise after feeding", fix: "Kitchen too cold — move somewhere warmer (21–24°C). Or try adding a little more rye flour to the feed." },
      { problem: "Grey liquid on top (hooch)", fix: "Normal — just means it's hungry. Stir it in or pour it off, then feed. Feed a little more frequently." },
      { problem: "Hard crust on surface", fix: "Surface dried out. Scrape it off — the starter underneath is fine. Use a loose lid or plate next time, not a cloth." },
      { problem: "Pink or orange streaks", fix: "Contamination — discard and start again. This is rare but serious." }
    ]
  },
  {
    name: "Autolyse", icon: "💧",
    why: "Mixing flour and water together before adding starter or salt gives the flour time to fully hydrate and lets gluten start forming on its own — no kneading needed. This makes the dough more extensible and easier to work with, and improves the final crumb structure.",
    whatCanGoWrong: [
      { problem: "Autolyse left too long (over 2 hours)", fix: "Gluten can start breaking down. Stick to 30–60 minutes." },
      { problem: "Dough feels very stiff", fix: "Water was too cold. Use lukewarm water (around 25–30°C) next time." },
      { problem: "Dry patches in the dough", fix: "Not mixed enough. Squeeze and fold more thoroughly until fully combined." }
    ]
  },
  {
    name: "Adding starter + salt", icon: "🧂",
    why: "The starter introduces wild yeast and bacteria into the dough — these will ferment the sugars in the flour, produce gas, and develop flavour over the next several hours. Salt is added separately (not with the starter) because in high concentrations it can slow down or harm the microorganisms in the starter.",
    whatCanGoWrong: [
      { problem: "Forgot to add salt", fix: "Dissolve salt in a tiny bit of water and fold it in as soon as you notice — even mid-bulk ferment is fine." },
      { problem: "Starter sinks in float test", fix: "Not ready yet. Wait another 1–2 hours and test again. Don't mix until it floats." },
      { problem: "Dough won't come together", fix: "Keep squeezing and folding — it takes a few minutes. Wet hands help." }
    ]
  },
  {
    name: "Stretch and folds", icon: "🤲",
    why: "Sourdough isn't kneaded in the traditional sense. Instead, stretch and folds build the gluten network gradually during bulk fermentation. Each set aligns the gluten strands and builds strength and elasticity. Without them, the dough stays slack, spreads flat, and can't hold the gas bubbles produced by fermentation.",
    whatCanGoWrong: [
      { problem: "Dough tears during stretching", fix: "Too tight — it needs more rest. Leave 30–45 minutes between sets." },
      { problem: "Dough stays very slack and sticky", fix: "Normal at first — it firms up with each set. If still slack after 4 sets, the kitchen may be too warm or the starter too active; try a shorter bulk ferment." },
      { problem: "Forgot to do stretch and folds", fix: "Your dough will be slacker and harder to shape, but it will still bake. Do 2–3 sets the next morning if you catch it in time." }
    ]
  },
  {
    name: "Bulk fermentation", icon: "⏱",
    why: "This is the main rise — the yeast consumes sugars in the flour and produces CO₂, which inflates the gluten network. At the same time, bacteria produce acids that develop flavour. The dough should grow by 50–75% and become visibly bubbly. Temperature is the biggest variable: warmer = faster, cooler = slower.",
    whatCanGoWrong: [
      { problem: "Dough barely rose overnight", fix: "Kitchen too cold, or starter not active enough. Next time ensure starter passes float test before mixing." },
      { problem: "Dough over-fermented (very bubbly, sticky, slack)", fix: "Fermented too long or kitchen too warm. Move to shaping immediately even if timing is off. Reduce bulk time next bake." },
      { problem: "Hard to tell if it's ready", fix: "Use the aliquot method — a small piece in a glass of water shows clearly how much the dough has risen." }
    ]
  },
  {
    name: "Shaping", icon: "🫓",
    why: "Shaping creates surface tension on the outside of the loaf — like inflating a balloon. This tension holds the gas inside and gives the loaf its structure in the oven. Without proper shaping, the loaf spreads flat. The pre-shape and bench rest relax the gluten so the final shape is easier to achieve.",
    whatCanGoWrong: [
      { problem: "Dough sticks to everything", fix: "Use wet hands, not flour. A bench scraper is essential for sticky dough. Don't over-handle it." },
      { problem: "Dough tears during shaping", fix: "Too tight from over-development or cold. Let it rest longer during bench rest." },
      { problem: "Can't build any tension — loaf spreads flat", fix: "Under-developed gluten from skipped stretch and folds. Chill the dough in the fridge for 20 minutes first — cold dough is easier to shape." }
    ]
  },
  {
    name: "Cold retard", icon: "❄️",
    why: "Putting the shaped dough in the fridge slows fermentation dramatically. This develops complex flavour (the cold favours bacteria over yeast, producing more acid), firms up the dough for easier scoring, and gives you total control over when you bake. 48 hours gives noticeably more flavour than 12.",
    whatCanGoWrong: [
      { problem: "Dough over-proofs in the fridge", fix: "Usually only happens after 48+ hours. Check at 36 hours — if it's very bubbly and puffy, bake sooner." },
      { problem: "Dough forms a dry skin in the fridge", fix: "Not covered tightly enough. Use cling film or a shower cap — no gaps." },
      { problem: "Loaf doesn't spring in the oven", fix: "May have over-proofed or the starter wasn't active enough. The cold retard itself is not usually the cause." }
    ]
  },
  {
    name: "Scoring", icon: "🔪",
    why: "Scoring controls where the loaf opens up as it expands in the oven. Without a score, the bread bursts unpredictably at its weakest point. A good score also creates the 'ear' — that dramatic flap of crust. The blade must be very sharp; a blunt knife drags and deflates the dough.",
    whatCanGoWrong: [
      { problem: "Score doesn't open up (no ear)", fix: "Blade not sharp enough, or angle too steep. Score at 30–45° to the surface, not straight down. Cold dough scores better." },
      { problem: "Dough deflates when scored", fix: "Over-proofed — the gluten structure is too weak. Score quickly and get it straight in the oven." },
      { problem: "Score sticks or drags", fix: "Use a razor blade or lame, not a kitchen knife. Wet the blade slightly." }
    ]
  },
  {
    name: "Baking (steamed + dry phases)", icon: "🔥",
    why: "Baking has two distinct phases. Phase 1 (with steam, 20 min): steam keeps the crust soft so the loaf can expand fully — this is oven spring. Without steam the crust sets too early and the loaf can't open. Phase 2 (no steam, 20–25 min): dry heat sets and colours the crust to create that characteristic crunch.",
    whatCanGoWrong: [
      { problem: "Pale, soft crust", fix: "Oven not hot enough, or steam phase too short. Preheat longer and make sure the vessel is truly hot." },
      { problem: "Top scorches before loaf is baked through", fix: "Move shelf one position lower first. If still scorching, reduce to 220°C after the first 10 minutes." },
      { problem: "Gummy, dense crumb", fix: "Cut too soon — the loaf is still cooking inside when it comes out. Wait at least 1 hour, ideally 2, before slicing." },
      { problem: "Flat loaf with no oven spring", fix: "Either the starter was weak, dough over-proofed, or not enough steam. Check all three on your next bake." }
    ]
  }
];

const recipes = [
  {
    name: "Focaccia", level: "Very easy", time: "Same day or overnight",
    color: "#FAEEDA", border: "#854F0B", text: "#633806",
    why: "The perfect second bake. High hydration dough that lives in a tin, so shaping is just pouring it in — no technique needed. No scoring, no Dutch oven. Incredibly forgiving.",
    ingredients: ["500g strong white bread flour", "375g lukewarm water (75% hydration)", "100g active starter", "10g fine salt", "4 tbsp good olive oil", "Toppings: flaky salt, rosemary, olives, cherry tomatoes"],
    method: ["Mix flour, water, starter and salt. Cover and leave 30 min.", "Do 4 sets of stretch and folds over 2 hours.", "Pour into an oiled deep baking tin (roughly 30x20cm). Drizzle generously with olive oil.", "Optional: cover and refrigerate overnight for more flavour.", "Remove from fridge and leave at room temperature for 2–4 hours until puffy.", "Preheat oven to 220°C fan.", "Dimple the dough all over with your fingers, pushing all the way to the bottom. Add toppings and more olive oil.", "Bake 25–30 minutes until deep golden brown.", "Cool on a rack for 20 minutes before cutting."],
    tips: "Don't be shy with the olive oil — it's what makes focaccia focaccia. The dimples stop it puffing up unevenly and hold little pools of oil."
  },
  {
    name: "Sourdough pizza", level: "Easy", time: "Same day",
    color: "#FAECE7", border: "#993C1D", text: "#712B13",
    why: "A great use of discard or active starter. Thinner dough than bread, baked at very high heat. No shaping skill needed — just stretch and lay on a tray.",
    ingredients: ["300g strong white bread flour", "180g lukewarm water (60% hydration)", "75g active starter (or discard)", "6g fine salt", "1 tbsp olive oil"],
    method: ["Mix all ingredients together until a smooth dough forms. Cover and rest 30 min.", "Do 3 sets of stretch and folds over 1.5 hours.", "Divide into 2 balls. Cover and rest at room temperature for 3–4 hours (or fridge overnight).", "Preheat oven to its maximum temperature (250°C+) with a baking tray or pizza stone inside for at least 30 minutes.", "On a lightly floured surface, stretch each ball into a rough circle by hand — don't use a rolling pin.", "Transfer to baking parchment. Add toppings.", "Slide onto the hot tray and bake 8–12 minutes until the edges are charred and the base is crispy."],
    tips: "The hotter the oven the better. If your oven has a grill setting, use it for the last 2 minutes to blister the cheese. Discard works well here — it adds flavour without needing to be fully active."
  },
  {
    name: "Sourdough tin loaf", level: "Easy", time: "Overnight",
    color: "#EEEDFE", border: "#534AB7", text: "#3C3489",
    why: "A loaf tin provides the structure, so you don't need to build tension through shaping. The result is a tall, even sandwich loaf with a soft crust.",
    ingredients: ["450g strong white bread flour", "320g lukewarm water (70% hydration)", "90g active starter", "9g fine salt", "Oil or butter for greasing"],
    method: ["Mix flour, water, starter and salt. Cover and rest 30 min.", "Do 4 sets of stretch and folds over 2 hours.", "Bulk ferment until dough has grown 50–75% (4–6 hours at room temp, or overnight in fridge).", "Grease a standard 2lb loaf tin (roughly 23x13cm) well.", "Tip the dough out, flatten gently into a rectangle roughly the width of your tin.", "Roll it up tightly like a swiss roll, then place seam-side down in the tin.", "Cover with a plastic bag and refrigerate overnight.", "Preheat oven to 230°C conventional heat.", "Score down the centre lengthways with a sharp knife.", "Place a roasting tin of boiling water on the oven floor for steam.", "Bake 20 min with steam, then remove water tin and bake a further 20–25 min until deep brown.", "Cool on a rack for at least 1 hour before slicing."],
    tips: "This is the most forgiving recipe — the tin does all the structural work. Great for sandwiches. The crumb will be slightly tighter than a free-form loaf, which makes it easier to slice."
  },
  {
    name: "Sourdough milk bread", level: "Easy", time: "Same day or overnight",
    color: "#FBEAF0", border: "#993556", text: "#72243E",
    why: "An enriched bread — containing milk, butter and egg — which makes the crumb incredibly soft, pillowy and slightly sweet. The fat slows fermentation, so the flavour is milder and less sour than a standard sourdough. Perfect for toast or french toast.",
    ingredients: ["400g strong white bread flour", "200g whole milk (lukewarm)", "50g lukewarm water", "80g active starter", "40g unsalted butter (softened)", "20g caster sugar", "8g fine salt", "1 egg (for the dough)", "1 egg yolk + 1 tbsp milk (for egg wash)"],
    method: ["Mix flour, milk, water, starter, sugar and salt until combined. Rest 30 min.", "Add softened butter a little at a time, squeezing and folding until fully incorporated. Then add the egg and mix well.", "Do 4 sets of stretch and folds over 2 hours.", "Bulk ferment at room temperature until grown by about 50% (4–6 hours). The fat slows things down — be patient.", "Grease a 2lb loaf tin generously with butter.", "Divide the dough into 4 equal pieces. Shape each into a smooth ball.", "Place the 4 balls in a row in the tin. Cover and refrigerate overnight (or prove at room temp for 2–3 hours until puffy).", "Preheat oven to 180°C fan.", "Brush gently with egg wash (yolk + milk).", "Bake 30–35 minutes until deep golden brown. Cover loosely with foil if the top browns too fast.", "Cool in the tin for 10 minutes, then turn out onto a rack. Wait 30 minutes before slicing."],
    tips: "The four-ball method gives you natural pull-apart sections. Because this is an enriched dough, it won't have the same sour tang as a plain sourdough — the flavour is mild, buttery and slightly sweet."
  },
  {
    name: "Wholemeal sourdough tin loaf", level: "Easy", time: "Overnight",
    color: "#EAF3DE", border: "#3B6D11", text: "#27500A",
    why: "A heartier, more nutritious loaf using a blend of wholemeal and strong white flour. The tin provides structure. The wholemeal adds a nutty, earthy depth of flavour and a slightly denser, more satisfying crumb.",
    ingredients: ["300g strong white bread flour", "150g strong wholemeal flour", "330g lukewarm water (75% hydration)", "90g active starter", "9g fine salt", "1 tbsp olive oil (optional)", "Oil or butter for greasing"],
    method: ["Mix both flours together, then add water, starter, salt and olive oil if using. Mix until no dry flour remains.", "Rest 45 minutes — wholemeal needs a longer hydration rest than white flour.", "Do 4 sets of stretch and folds over 2 hours.", "Bulk ferment until grown by 50–75%. Wholemeal ferments faster — check after 3–4 hours.", "Grease a 2lb loaf tin well.", "Shape into a log and place seam-side down in the tin. Cover and refrigerate overnight.", "Preheat oven to 230°C conventional heat.", "Score down the centre. Add steam (boiling water in a tray on the oven floor).", "Bake 20 min with steam, then remove water and bake 20–25 min more until the loaf sounds hollow when tapped on the bottom.", "Cool on a rack for at least 1 hour before slicing."],
    tips: "Don't go higher than 50% wholemeal as a beginner — the bran weakens the gluten and the loaf gets dense. 33% wholemeal gives you all the flavour with a manageable dough."
  },
  {
    name: "Sourdough flatbreads", level: "Very easy", time: "30 minutes (plus discard)",
    color: "#FAEEDA", border: "#854F0B", text: "#633806",
    why: "The quickest thing you can make with sourdough discard — no proving, no oven, ready in minutes. Cooked in a dry frying pan. Great as a wrap, alongside soup, or with dips.",
    ingredients: ["200g sourdough discard (unfed, straight from the fridge)", "100g strong white bread flour", "½ tsp fine salt", "½ tsp baking powder (optional — makes them puffier)", "1 tbsp olive oil"],
    method: ["Mix all ingredients together until a soft dough forms. Add a little more flour if too sticky.", "Divide into 4 equal pieces. Roll each one out as thin as you can — about 2–3mm.", "Heat a dry frying pan over medium-high heat until very hot. No oil needed.", "Cook each flatbread for 1.5–2 minutes per side until dark spots appear and it puffs slightly.", "Stack under a clean tea towel to keep warm and soft while you cook the rest.", "Serve immediately — best eaten fresh and warm."],
    tips: "The older and more sour the discard, the more flavour the flatbreads will have. Try rubbing with a cut garlic clove and brushing with butter straight out of the pan."
  }
];

export default function SourdoughGuide() {
  const [tab, setTab] = useState<Tab>("schedule");
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [openStep, setOpenStep] = useState<string | null>(null);
  const [openStage, setOpenStage] = useState<number | string | null>(null);
  const [openRecipe, setOpenRecipe] = useState<number | null>(null);
  const [openProblem, setOpenProblem] = useState<string | null>(null);

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--color-text-primary)", padding: "1rem 0", maxWidth: 700 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "7px 14px", borderRadius: "var(--border-radius-md)",
            border: tab === t ? "1.5px solid var(--color-border-primary)" : "0.5px solid var(--color-border-tertiary)",
            background: tab === t ? "var(--color-background-secondary)" : "transparent",
            color: "var(--color-text-primary)", cursor: "pointer", fontWeight: tab === t ? 500 : 400, fontSize: 13
          }}>{TAB_LABELS[t]}</button>
        ))}
      </div>

      {tab === "schedule" && (
        <div>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 20, lineHeight: 1.6 }}>
            Feed your starter on Friday, bake on Monday. Click any day to expand.
          </p>
          {days.map((d, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <button onClick={() => setOpenDay(openDay === i ? null : i)} style={{
                width: "100%", textAlign: "left", padding: "12px 16px",
                background: d.color, border: `0.5px solid ${d.border}`,
                borderRadius: openDay === i ? "var(--border-radius-md) var(--border-radius-md) 0 0" : "var(--border-radius-md)",
                cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <span style={{ fontWeight: 500, fontSize: 15, color: d.text }}>{d.day}</span>
                <span style={{ fontSize: 12, color: d.border, background: "rgba(255,255,255,0.5)", padding: "2px 10px", borderRadius: 20, border: `0.5px solid ${d.border}` }}>{d.label}</span>
              </button>
              {openDay === i && (
                <div style={{ border: `0.5px solid ${d.border}`, borderTop: "none", borderRadius: "0 0 var(--border-radius-md) var(--border-radius-md)", padding: "12px 16px", background: "var(--color-background-primary)" }}>
                  {d.steps.map((s, j) => {
                    const key = `${i}-${j}`;
                    return (
                      <div key={j} style={{ marginBottom: j < d.steps.length - 1 ? 12 : 0 }}>
                        <button onClick={() => setOpenStep(openStep === key ? null : key)} style={{
                          width: "100%", textAlign: "left", background: "var(--color-background-secondary)",
                          border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)",
                          padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12
                        }}>
                          <span style={{ fontSize: 11, fontWeight: 500, color: d.border, background: d.color, width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `0.5px solid ${d.border}` }}>{s.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 2 }}>{s.time}</div>
                            <div style={{ fontSize: 14, fontWeight: 500 }}>{s.title}</div>
                          </div>
                          <span style={{ color: "var(--color-text-tertiary)", fontSize: 12, marginTop: 4 }}>{openStep === key ? "▲" : "▼"}</span>
                        </button>
                        {openStep === key && (
                          <div style={{ padding: "12px 16px", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderTop: "none", borderRadius: "0 0 var(--border-radius-md) var(--border-radius-md)", fontSize: 13.5, lineHeight: 1.75, color: "var(--color-text-secondary)", whiteSpace: "pre-line" }}>
                            {s.detail}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          <div style={{ marginTop: 20, padding: "12px 16px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--color-text-primary)" }}>London kitchen tip:</strong> London kitchens often run 18–22°C. If yours is cooler, fermentation will be slower — add 1–2 hours to bulk ferment. If your starter is slow to peak, place it in the oven with just the light on. Always go by the look and feel of the dough, not the clock alone.
          </div>
        </div>
      )}

      {tab === "flour" && (
        <div>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 20, lineHeight: 1.6 }}>
            In the UK, flour is named differently from the US. Here's what to buy and where to find it in London.
          </p>
          {[
            { name: "Strong white bread flour", protein: "12–13%", recommended: true, badge: "Best for beginners", brands: ["Allinson Strong White", "Marriages Strong White", "Doves Farm Strong White", "Waitrose Duchy Organic Strong White"], where: "Any major supermarket (Sainsbury's, Tesco, Waitrose, Ocado, M&S)", notes: "The easiest flour to work with. High protein gives strong gluten, great rise, and an open crumb. Start here. Never use plain flour — it's too low in protein." },
            { name: "Premium artisan strong white", protein: "12.5–13.5%", recommended: false, badge: "Step up", brands: ["Matthews Cotswold Churchill", "Shipton Mill No.4", "Gilchesters Organic Strong White"], where: "Bakery Bits, Shipton Mill online, independent delis", notes: "British heritage wheat, more complex flavour. Excellent but not essential to start." },
            { name: "Wholemeal rye flour", protein: "8–10%", recommended: false, badge: "For starter + rye loaf", brands: ["Doves Farm Organic Wholemeal Rye (Amazon UK)", "Shipton Mill Rye", "Matthews Cotswold Rye"], where: "Most supermarkets and Amazon UK", notes: "Use 20% in every starter feed (alongside 80% strong white). Rich in wild yeasts and enzymes. Don't use white rye — the bran has been removed, which removes the benefit." },
            { name: "Wholemeal strong flour", protein: "11–13%", recommended: false, badge: "Add 20% to bread", brands: ["Allinson Wholemeal", "Matthews Cotswold Stoneground Wholemeal", "Doves Farm Wholemeal"], where: "Supermarkets and online", notes: "Use as 20–30% of the total bread flour alongside strong white for a nuttier flavour. Don't use 100% — it makes a dense loaf." }
          ].map((f, i) => (
            <div key={i} style={{ marginBottom: 12, padding: "14px 16px", background: "var(--color-background-primary)", border: f.recommended ? "1.5px solid #0F6E56" : "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ fontWeight: 500, fontSize: 15 }}>{f.name}</div>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: f.recommended ? "#E1F5EE" : "var(--color-background-secondary)", color: f.recommended ? "#085041" : "var(--color-text-secondary)", border: f.recommended ? "0.5px solid #0F6E56" : "0.5px solid var(--color-border-tertiary)", flexShrink: 0 }}>{f.badge}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 8 }}>Protein: {f.protein}</div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 8, lineHeight: 1.6 }}>{f.notes}</div>
              <div style={{ fontSize: 12, marginBottom: 4 }}><span style={{ color: "var(--color-text-tertiary)" }}>Brands: </span><span style={{ color: "var(--color-text-secondary)" }}>{f.brands.join(" · ")}</span></div>
              <div style={{ fontSize: 12 }}><span style={{ color: "var(--color-text-tertiary)" }}>Where: </span><span style={{ color: "var(--color-text-secondary)" }}>{f.where}</span></div>
            </div>
          ))}
        </div>
      )}

      {tab === "stages" && (
        <div>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 20, lineHeight: 1.6 }}>
            What each stage does, why it matters, and what can go wrong. Click a stage to expand.
          </p>
          {stages.map((s, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <button onClick={() => setOpenStage(openStage === i ? null : i)} style={{
                width: "100%", textAlign: "left", padding: "12px 16px",
                background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: openStage === i ? "var(--border-radius-md) var(--border-radius-md) 0 0" : "var(--border-radius-md)",
                cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{s.icon} {s.name}</span>
                <span style={{ color: "var(--color-text-tertiary)", fontSize: 12 }}>{openStage === i ? "▲" : "▼"}</span>
              </button>
              {openStage === i && (
                <div style={{ border: "0.5px solid var(--color-border-tertiary)", borderTop: "none", borderRadius: "0 0 var(--border-radius-md) var(--border-radius-md)", padding: "14px 16px", background: "var(--color-background-primary)" }}>
                  <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.75, marginBottom: 16 }}>{s.why}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>What can go wrong</div>
                  {s.whatCanGoWrong.map((p, j) => {
                    const pk = `stage-${i}-${j}`;
                    return (
                      <div key={j} style={{ marginBottom: 6 }}>
                        <button onClick={() => setOpenProblem(openProblem === pk ? null : pk)} style={{
                          width: "100%", textAlign: "left", padding: "8px 12px",
                          background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)",
                          borderRadius: openProblem === pk ? "var(--border-radius-md) var(--border-radius-md) 0 0" : "var(--border-radius-md)",
                          cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}>
                          <span style={{ fontSize: 13, color: "var(--color-text-primary)" }}>⚠ {p.problem}</span>
                          <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{openProblem === pk ? "▲" : "▼"}</span>
                        </button>
                        {openProblem === pk && (
                          <div style={{ padding: "10px 12px", background: "#EAF3DE", border: "0.5px solid #3B6D11", borderTop: "none", borderRadius: "0 0 var(--border-radius-md) var(--border-radius-md)", fontSize: 13, color: "#27500A", lineHeight: 1.6 }}>
                            ✓ {p.fix}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "recipes" && (
        <div>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 20, lineHeight: 1.6 }}>
            Six beginner-friendly recipes — no Dutch oven needed for any of them. Click a recipe to expand.
          </p>
          {recipes.map((r, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <button onClick={() => setOpenRecipe(openRecipe === i ? null : i)} style={{
                width: "100%", textAlign: "left", padding: "14px 16px",
                background: r.color, border: `0.5px solid ${r.border}`,
                borderRadius: openRecipe === i ? "var(--border-radius-md) var(--border-radius-md) 0 0" : "var(--border-radius-md)",
                cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 15, color: r.text }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: r.border, marginTop: 2 }}>{r.level} · {r.time}</div>
                </div>
                <span style={{ fontSize: 12, color: r.border }}>{openRecipe === i ? "▲" : "▼"}</span>
              </button>
              {openRecipe === i && (
                <div style={{ border: `0.5px solid ${r.border}`, borderTop: "none", borderRadius: "0 0 var(--border-radius-md) var(--border-radius-md)", padding: "16px", background: "var(--color-background-primary)" }}>
                  <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>{r.why}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 8 }}>Ingredients</div>
                      {r.ingredients.map((ing, j) => (
                        <div key={j} style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>• {ing}</div>
                      ))}
                    </div>
                    <div style={{ padding: "12px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)" }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 6 }}>Baker's tip</div>
                      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.65 }}>{r.tips}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Method</div>
                  {r.method.map((step, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 11, fontWeight: 500, color: r.border, background: r.color, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `0.5px solid ${r.border}`, marginTop: 1 }}>{j + 1}</span>
                      <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.65 }}>{step}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "rye" && (
        <div>
          <div style={{ padding: "14px 16px", background: "#FAEEDA", border: "0.5px solid #854F0B", borderRadius: "var(--border-radius-lg)", marginBottom: 16 }}>
            <div style={{ fontWeight: 500, fontSize: 15, color: "#633806", marginBottom: 4 }}>Rye-Forward Sourdough</div>
            <div style={{ fontSize: 12, color: "#854F0B", marginBottom: 8 }}>Strong white + rye · Intermediate · Overnight</div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>Better structure than plain flour, with stronger rise and easier handling. Using strong white + rye is the sweet spot — you keep rye flavour while preserving gluten strength. Mild tang, earthy, slight sweetness, darker crust.</div>
          </div>
          <div style={{ padding: "12px 16px", background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", marginBottom: 16, fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
            <strong style={{ color: "var(--color-text-primary)" }}>Quick reference</strong><br/>
            300g strong white + 150g rye · 345–350g water · 90g starter · 9g salt<br/>
            Bulk 4–5 hrs · Cold retard overnight · Bake 40–45 min
          </div>
          {[
            { title: "🧂 Ingredients", color: "#FAECE7", border: "#993C1D", text: "#712B13", content: <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8 }}><strong style={{ color: "var(--color-text-primary)" }}>Flour (total 450g):</strong><br/>• 300g strong white bread flour<br/>• 150g rye flour<br/><br/><strong style={{ color: "var(--color-text-primary)" }}>Other:</strong><br/>• 345–360g water<br/>• 90g active starter (100% hydration)<br/>• 9g salt<br/><br/><strong style={{ color: "var(--color-text-primary)" }}>Hydration guide:</strong><br/>• 345g = easier shaping, safer for first try ✓<br/>• 355–360g = more open crumb, stickier dough<br/>Start at 345–350g for your first attempt.</div> },
            { title: "1️⃣ Autolyse (20–30 min)", color: "#FAEEDA", border: "#854F0B", text: "#633806", content: <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>Mix together:<br/>• 300g strong white flour<br/>• 150g rye flour<br/>• ~325g water (hold back 20–25g for later)<br/><br/>Rest 20–30 minutes only — no longer.<br/><br/><strong style={{ color: "var(--color-text-primary)" }}>Why shorter than usual?</strong> Rye weakens gluten over time, so a shorter autolyse protects dough strength.</div> },
            { title: "2️⃣ Add starter + salt", color: "#FAEEDA", border: "#854F0B", text: "#633806", content: <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>Add:<br/>• 90g active starter<br/>• 9g salt<br/>• Remaining 20–25g water<br/><br/>Mix until fully incorporated.<br/><br/><strong style={{ color: "var(--color-text-primary)" }}>What to expect:</strong> Stickier than a white dough, but noticeably more structure than a plain flour version. A slight tackiness is completely normal — don't add more flour.</div> },
            { title: "3️⃣ Bulk fermentation (4–5 hours)", color: "#FAEEDA", border: "#854F0B", text: "#633806", content: <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8 }}><strong style={{ color: "var(--color-text-primary)" }}>Folding schedule (first 2 hours):</strong><br/>• 0:30 — fold set 1<br/>• 1:00 — fold set 2<br/>• 1:30 — fold set 3<br/>• 2:00 — fold set 4 (optional)<br/><br/>Then leave alone until bulk is complete.<br/><br/><strong style={{ color: "var(--color-text-primary)" }}>Ready when:</strong><br/>• 50–70% rise (don't wait for doubling)<br/>• Puffier feel<br/>• Visible bubbles<br/>• Slight jiggle when you shake the bowl</div> },
            { title: "4️⃣ Pre-shape + final shape", color: "#EEEDFE", border: "#534AB7", text: "#3C3489", content: <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8 }}><strong style={{ color: "var(--color-text-primary)" }}>Pre-shape:</strong><br/>• Lightly flour the surface<br/>• Shape gently into a round<br/>• Rest 15–20 minutes uncovered<br/><br/><strong style={{ color: "var(--color-text-primary)" }}>Final shape:</strong><br/>• Shape firmly to build good surface tension<br/>• Place seam-side UP in a well-floured banneton or bowl<br/>• Cover tightly and refrigerate</div> },
            { title: "5️⃣ Cold retard", color: "#EEEDFE", border: "#534AB7", text: "#3C3489", content: <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>Refrigerate for 12–18 hours ideally.<br/><br/>Can push to ~24 hours safely — the strong white flour gives the dough stability to handle a longer retard without collapsing.<br/><br/>The rye flavour deepens noticeably with a longer cold retard.</div> },
            { title: "6️⃣ Bake", color: "#EAF3DE", border: "#3B6D11", text: "#27500A", content: <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8 }}><strong style={{ color: "var(--color-text-primary)" }}>Preheat:</strong> 240–250°C for 30–45 min with your vessel inside. Steam tray on the oven floor if no Dutch oven.<br/><br/><strong style={{ color: "var(--color-text-primary)" }}>Score:</strong> One confident slash, slightly deeper than you'd score a white loaf.<br/><br/><strong style={{ color: "var(--color-text-primary)" }}>Phase 1:</strong> 20 min at 240–250°C with steam<br/><strong style={{ color: "var(--color-text-primary)" }}>Phase 2:</strong> 20–25 min at 220–230°C without steam<br/><strong style={{ color: "var(--color-text-primary)" }}>Total:</strong> 40–45 minutes<br/><br/><strong style={{ color: "var(--color-text-primary)" }}>Cool:</strong> Minimum 2–3 hours before cutting — rye loaves need longer than white to set properly.</div> },
            { title: "✦ Expected results", color: "#E1F5EE", border: "#0F6E56", text: "#085041", content: <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>Compared to your first (plain white) loaf:<br/><br/>• Better rise and oven spring<br/>• Stronger, easier shaping<br/>• Slightly more open crumb<br/>• Darker crust<br/>• Much more flavour — earthy, mild tang, slight sweetness from the rye<br/><br/>This is one of the best daily rye sourdough ratios: enough rye for character, enough white for reliability.</div> }
          ].map((section, i) => {
            const isOpen = openStage === `rye-${i}`;
            return (
              <div key={i} style={{ marginBottom: 8 }}>
                <button onClick={() => setOpenStage(isOpen ? null : `rye-${i}`)} style={{
                  width: "100%", textAlign: "left", padding: "11px 16px",
                  background: section.color, border: `0.5px solid ${section.border}`,
                  borderRadius: isOpen ? "var(--border-radius-md) var(--border-radius-md) 0 0" : "var(--border-radius-md)",
                  cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <span style={{ fontWeight: 500, fontSize: 14, color: section.text }}>{section.title}</span>
                  <span style={{ fontSize: 12, color: section.border }}>{isOpen ? "▲" : "▼"}</span>
                </button>
                {isOpen && (
                  <div style={{ border: `0.5px solid ${section.border}`, borderTop: "none", borderRadius: "0 0 var(--border-radius-md) var(--border-radius-md)", padding: "14px 16px", background: "var(--color-background-primary)" }}>
                    {section.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
