// copybank.js - "Suggest text" helper. Pre-written lines, NO AI.
// COPY[siteType][tone][field] is a list; each click shows the next line. {name} becomes the site name.

const TONES = ["formal", "friendly", "bold"];

const COPY = {
  portfolio: {
    formal: { heroTitle: ["Selected work by {name}", "Design and development, done with care"],
      heroText: ["A record of recent projects, the problems behind them and how they were solved.", "Available for freelance and full-time work."],
      about: ["{name} works with small teams to plan, design and build clear digital products. Each project starts with the problem, not the tools. Past clients include startups, local shops and student groups."] },
    friendly: { heroTitle: ["Hi, I'm {name}. I make things for the web.", "Things I've built lately"],
      heroText: ["Here are a few projects I'm proud of, and what I learned from each one.", "Got an idea? I'd love to hear it."],
      about: ["I'm {name}. I started building websites for friends and never stopped. I like simple pages, honest copy and code that is easy to change later. When I'm not working, I'm sketching or learning something new."] },
    bold: { heroTitle: ["{name}. Work that ships.", "Less talk. More launches."],
      heroText: ["Fast, clean, finished projects. See for yourself.", "Every project here went live. Yours can be next."],
      about: ["{name} turns rough ideas into finished products in weeks, not months. No fluff, no endless meetings: a clear plan, steady updates and a launch date that holds."] }
  },
  business: {
    formal: { heroTitle: ["{name}: reliable service since day one", "Professional service you can count on"],
      heroText: ["Clear prices, on-time delivery and a team that answers the phone.", "Serving homes and businesses across the city."],
      about: ["{name} is a local business built on repeat customers. We quote before we start, we finish when we say we will, and we stand behind our work. Call us for a free estimate."] },
    friendly: { heroTitle: ["Your neighbourhood {name}", "Good service, fair prices, no surprises"],
      heroText: ["We're a small team that cares about getting it right the first time.", "Drop by, call, or send a message. We reply the same day."],
      about: ["{name} started as a one-person shop and grew because people told their friends. We still treat every job like it's for family: show up on time, explain everything and clean up after."] },
    bold: { heroTitle: ["{name}. Done right. Done fast.", "The job, finished today."],
      heroText: ["Book now. We handle the rest.", "No waiting lists. No hidden charges."],
      about: ["At {name} we don't do 'maybe next week'. We give a price, a date and a result. Hundreds of customers trust us to get it done the first time."] }
  },
  blog: {
    formal: { heroTitle: ["{name}: notes on what I'm learning", "Essays, guides and reading notes"],
      heroText: ["New posts every week on practical topics, written in plain language.", "Long-form writing, no clickbait."],
      about: ["{name} is a personal journal about learning in public. Each post explains one idea with examples you can try. Comments and corrections are always welcome."] },
    friendly: { heroTitle: ["Welcome to {name}", "Stories, tips and the odd rant"],
      heroText: ["Grab a chai and stay a while. New posts most Sundays.", "Things I wish someone had told me earlier."],
      about: ["Hi! {name} is where I write about the things I'm figuring out: study habits, side projects, books and food. If a post helps you, send me a message. It makes my week."] },
    bold: { heroTitle: ["{name}. Read this before you scroll.", "Straight answers. No filler."],
      heroText: ["Every post fits in a five-minute read.", "If it's here, it's tested."],
      about: ["{name} cuts through the noise. One topic, one clear answer, every post. If something doesn't work, I say so."] }
  },
  event: {
    formal: { heroTitle: ["{name}: join us this season", "{name}: schedule, venue and registration"],
      heroText: ["Talks, workshops and networking in one day. Seats are limited.", "Find the full schedule and venue details below."],
      about: ["{name} brings together students, makers and professionals for a day of talks and hands-on sessions. Registration is open to everyone, and all sessions are in English and Hindi."] },
    friendly: { heroTitle: ["You're invited to {name}!", "Come for the talks, stay for the people"],
      heroText: ["A day of ideas, snacks and new friends. Bring a friend too.", "Everything you need to know is right here."],
      about: ["{name} is run by volunteers who love sharing what they know. Expect short talks, a hands-on workshop and plenty of time to chat. First-timers are very welcome."] },
    bold: { heroTitle: ["{name}. One day. Big ideas.", "Don't miss {name}."],
      heroText: ["Seats are filling fast. Register now.", "Twelve speakers. Six workshops. One day."],
      about: ["{name} is the event people talk about for months. Real speakers, real projects, no sales pitches. Register before seats run out."] }
  },
  restaurant: {
    formal: { heroTitle: ["{name}: fine dining in the heart of the city", "Seasonal menus, cooked to order"],
      heroText: ["Fresh ingredients from local farms, prepared by our head chef every day.", "Reservations recommended for dinner."],
      about: ["{name} serves regional dishes made from scratch each morning. Our spices are ground in-house and our menu changes with the seasons. We welcome families, groups and private events."] },
    friendly: { heroTitle: ["Good food, made with love at {name}", "Come hungry, leave happy"],
      heroText: ["Home-style recipes, generous plates and a warm welcome.", "Dine in, take away, or order on WhatsApp."],
      about: ["{name} started in a small kitchen with family recipes. Today we still cook every dish the same way: slowly, with fresh spices and a lot of care. Pull up a chair, you're among friends."] },
    bold: { heroTitle: ["{name}. Taste the difference.", "Hot. Fresh. Ready now."],
      heroText: ["The city's favourite plates, cooked over open fire.", "Order now. Thank us later."],
      about: ["{name} doesn't do shortcuts. Fire-cooked, spice-forward and made fresh every day. One bite and you'll know why the tables are always full."] }
  },
  student: {
    formal: { heroTitle: ["{name}: B.Tech student and developer", "Projects, skills and achievements"],
      heroText: ["Seeking internships in web development and software engineering.", "A summary of my academic and personal projects."],
      about: ["{name} is an engineering student with hands-on experience in HTML, CSS, JavaScript and Python. Projects include a website builder, a library system and a weather dashboard. Open to internships and team projects."] },
    friendly: { heroTitle: ["Hi, I'm {name}. I like building things.", "Student, learner, builder"],
      heroText: ["Here's what I've made so far, and what I'm learning next.", "Always up for a project or a hackathon team."],
      about: ["I'm {name}, an engineering student who learns best by building. Most of my projects started as 'can I make this?' and ended with something that works. I'm looking for an internship where I can learn from a real team."] },
    bold: { heroTitle: ["{name}. Ready to build.", "Projects first. Résumé second."],
      heroText: ["Shipped projects, not just marks.", "Hire me for an internship. See the proof below."],
      about: ["{name} builds working software, not just assignments. Every project here runs, has been tested and solves a real problem. Give me a task and a deadline."] }
  }
};

// Card ideas per site type: [title, detail]
const CARD_IDEAS = {
  portfolio: [["Brand website", "Five-page site for a local café. Built in two weeks."], ["Mobile app design", "Screens and prototype for a fitness tracker."], ["Logo and identity", "Logo, colors and type for a startup."]],
  business: [["Free estimate", "We visit, measure and give a fixed price."], ["Same-day service", "Call before noon, we come the same day."], ["Annual care plan", "Regular check-ups at a lower yearly price."]],
  blog: [["Start here", "The five posts new readers like most."], ["Study notes", "Short guides from my own courses."], ["Book list", "What I read this year and why."]],
  event: [["10:00 Opening talk", "Why we started this event and what's planned."], ["11:30 Workshop", "Bring a laptop. Build something in 90 minutes."], ["16:00 Demo hour", "Teams show what they made today."]],
  restaurant: [["Chef's thali", "Seven small dishes, rice and two breads."], ["Tandoori platter", "Paneer, mushrooms and vegetables from the clay oven."], ["Masala chai", "Brewed with fresh ginger and cardamom."]],
  student: [["Website builder", "12-step offline site builder in plain JavaScript."], ["Library system", "Issue and return books with a simple database."], ["Weather dashboard", "Live forecast for any city, with charts."]]
};

let copyTone = "friendly";
const copyTurn = {};

function hasCopy(field) {
  return ["heroTitle", "heroText", "about"].includes(field);
}

// Next pre-written line for this field, with the site name filled in
function nextCopy(field) {
  const lines = ((COPY[state.siteType] || COPY.business)[copyTone] || {})[field] || [];
  if (!lines.length) return "";
  const key = field + copyTone;
  copyTurn[key] = ((copyTurn[key] ?? -1) + 1) % lines.length;
  return lines[copyTurn[key]].split("{name}").join(state.siteName.trim() || "We");
}

// Row under a text box: three tone chips and a "Suggest text" button
function copyHelper(field, box) {
  const row = el("div", "copy-helper");
  row.append(el("span", "copy-label", "Need words?"));
  TONES.forEach(tone => {
    const chip = el("button", "chip", tone);
    chip.type = "button";
    chip.setAttribute("aria-pressed", String(tone === copyTone));
    chip.onclick = () => {
      copyTone = tone;
      row.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", String(c === chip)));
    };
    row.append(chip);
  });
  const suggest = el("button", "copy-go", "Suggest text");
  suggest.type = "button";
  suggest.onclick = () => {
    box.value = nextCopy(field).slice(0, box.maxLength);
    // Same event as typing: saves, updates the counter, preview and undo history
    box.dispatchEvent(new Event("input", { bubbles: true }));
    box.focus();
  };
  row.append(suggest);
  return row;
}

// Step 8: fill empty card slots with ideas for this site type
function cardIdeasButton() {
  const button = el("button", "copy-go", "Fill card ideas");
  button.type = "button";
  button.onclick = () => {
    const ideas = CARD_IDEAS[state.siteType] || CARD_IDEAS.business;
    state.cards = state.cards.filter(card => card.title.trim() || card.detail.trim() || card.image);
    ideas.forEach(([title, detail]) => {
      if (state.cards.length < 6 && !state.cards.some(card => card.title === title)) state.cards.push({ title: title, detail: detail, image: "" });
    });
    render();
  };
  return button;
}
