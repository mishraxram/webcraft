// categories.js - Extra site types (step 2). Each type is one data object, NO new code per type.
// The loop at the bottom copies each field into the tables the other files already use.
// To add a type: add one object here. Pre-written lines only, NO AI.

const MORE_TYPES = {
  shop: { ld: "Store", heading: "Products", cta: "Ask about stock or delivery.", kicker: "Now in store",
    menu: ["Home", "Products", "About", "Contact"], heroTitle: "Everyday things, fair prices", heroText: "Open daily. Free delivery nearby.",
    about: "What you sell, since when, and why people come back.", card: ["Product name and price", "One line: size, colour or brand"],
    copy: { formal: [["{name}: quality goods, honest prices", "Your local store for daily needs"], ["Wide range in stock, delivered to your door."], ["{name} has served this area for years with genuine products, fair prices and quick home delivery."]],
      friendly: [["Everything you need at {name}", "Your corner shop, now online"], ["Message us your list. We pack it, you pick it up."], ["{name} is a family-run shop. We know our regulars by name and keep what they like in stock."]],
      bold: [["{name}. Best price in town.", "In stock. Ready today."], ["Order on WhatsApp. Delivered in an hour."], ["{name} beats big stores on price and speed. Check it yourself."]] },
    ideas: [["Daily essentials", "Rice, dal, oil and spices at weekly prices."], ["Home delivery", "Free within 3 km on orders above ₹500."], ["Festival packs", "Ready gift boxes for Diwali and Eid."]] },

  clinic: { ld: "MedicalClinic", heading: "Treatments", cta: "Book an appointment.", kicker: "Care you can trust",
    menu: ["Home", "Treatments", "About", "Contact"], heroTitle: "Family doctor, close to home", heroText: "Walk-ins welcome. Appointments preferred.",
    about: "The doctor's name, degrees, years of practice and what the clinic treats.", card: ["Treatment name", "One line: who it is for"],
    copy: { formal: [["{name}: general and family medicine", "Qualified care for every age"], ["Consultations, check-ups and lab tests under one roof."], ["{name} offers general medicine, child care and health check-ups. All consultations are private and records are kept safely."]],
      friendly: [["Feel better at {name}", "A clinic that listens"], ["Short waits, clear advice and a doctor who explains."], ["At {name} we take time to understand what is wrong. Bring your old reports and your questions."]],
      bold: [["{name}. Seen on time.", "No long queues."], ["Book on WhatsApp. Walk in at your slot."], ["{name} runs on appointments so you are seen when promised."]] },
    ideas: [["General consultation", "Fever, cough, BP and sugar checks."], ["Child care", "Vaccines and growth check-ups."], ["Health package", "Blood tests and a doctor review in one visit."]] },

  gym: { ld: "ExerciseGym", heading: "Plans", cta: "Book a free trial session.", kicker: "Train with us",
    menu: ["Home", "Plans", "About", "Contact"], heroTitle: "Get strong. Stay consistent.", heroText: "Open 6am to 10pm. First session free.",
    about: "Your trainers, equipment and the kind of members you help.", card: ["Plan name and monthly price", "One line: what is included"],
    copy: { formal: [["{name}: strength and fitness training", "Certified trainers, modern equipment"], ["Personal plans for weight loss, strength and stamina."], ["{name} has certified trainers, a clean floor and a plan for every level, from first-timers to athletes."]],
      friendly: [["Your fitness starts at {name}", "No judgement, just progress"], ["Come for a free trial. We'll show you around."], ["{name} is a friendly gym where beginners are welcome. Our trainers set a plan and check in every week."]],
      bold: [["{name}. No excuses.", "Show up. Lift. Repeat."], ["First session free. Results in 30 days."], ["{name} is for people who want results. Hard training, clear goals, real coaches."]] },
    ideas: [["Monthly plan", "Full gym access, 6am to 10pm."], ["Personal training", "One-on-one coach, three days a week."], ["Diet guide", "Simple Indian meal plan for your goal."]] },

  salon: { ld: "BeautySalon", heading: "Services", cta: "Book your slot.", kicker: "Hair, skin and style",
    menu: ["Home", "Services", "About", "Contact"], heroTitle: "Look good, feel fresh", heroText: "Hair, skin and bridal care. Book on WhatsApp.",
    about: "Your stylists, the brands you use and what you are known for.", card: ["Service name and price", "One line: time taken"],
    copy: { formal: [["{name}: hair, skin and bridal studio", "Trained stylists, trusted products"], ["Every service uses branded products and clean tools."], ["{name} offers haircuts, colour, facials and bridal packages by trained stylists in a clean, calm studio."]],
      friendly: [["Treat yourself at {name}", "Your new favourite salon"], ["Relax, chat and walk out looking great."], ["{name} is a cosy salon where you can switch off. Tell us what you like and we'll take care of the rest."]],
      bold: [["{name}. Turn heads.", "New look. Today."], ["Book now. Walk out a new person."], ["{name} does bold cuts, bright colour and flawless bridal looks."]] },
    ideas: [["Haircut and style", "Wash, cut and blow-dry in 45 minutes."], ["Facial", "Deep clean and glow, 60 minutes."], ["Bridal package", "Trial, makeup and hair on the day."]] },

  coaching: { ld: "EducationalOrganization", heading: "Courses", cta: "Ask about the next batch.", kicker: "Admissions open",
    menu: ["Home", "Courses", "About", "Contact"], heroTitle: "Small batches. Big results.", heroText: "Classes 6 to 12, JEE and NEET. Demo class free.",
    about: "Your teachers, subjects, batch size and past results.", card: ["Course name and fee", "One line: class, timing and duration"],
    copy: { formal: [["{name}: coaching for school and entrance exams", "Experienced faculty, proven results"], ["Regular tests, doubt sessions and parent updates."], ["{name} teaches maths and science in small batches with weekly tests and monthly parent meetings."]],
      friendly: [["Learn better at {name}", "Where doubts get cleared"], ["Join a free demo class and meet the teachers."], ["{name} keeps batches small so every student gets attention. Ask as many questions as you like."]],
      bold: [["{name}. Results that speak.", "Crack it with {name}."], ["Top ranks every year. Next batch starts soon."], ["{name} students top boards and clear entrances. Join the next batch."]] },
    ideas: [["Class 10 boards", "Maths and science, 6 days a week."], ["JEE foundation", "Two-year course with weekly tests."], ["Doubt clinic", "Sunday sessions for any subject."]] },

  nonprofit: { ld: "NGO", heading: "Our work", cta: "Volunteer or donate.", kicker: "Together we can",
    menu: ["Home", "Our work", "About", "Contact"], heroTitle: "Small help, real change", heroText: "Join us as a volunteer or support a cause.",
    about: "Why you started, who you help, and how money is used.", card: ["Programme name", "One line: who it helps and how"],
    copy: { formal: [["{name}: working for education and health", "Registered non-profit, open accounts"], ["Every rupee is reported in our yearly accounts."], ["{name} is a registered non-profit that runs learning centres and health camps. Accounts are audited and shared every year."]],
      friendly: [["Join the {name} family", "Be part of something good"], ["Give an hour, a book or a meal. It all helps."], ["{name} started with a few friends teaching children on weekends. Today hundreds of volunteers help us."]],
      bold: [["{name}. Act now.", "Change starts with you."], ["One donation feeds a child for a month."], ["{name} does not wait for someone else to fix it. We go, we help, we report back."]] },
    ideas: [["Evening school", "Free classes for children from nearby slums."], ["Health camps", "Monthly check-ups in villages."], ["Food drive", "Meals for daily-wage workers."]] },

  photography: { ld: "ProfessionalService", heading: "Shoots", cta: "Check dates for your shoot.", kicker: "Photo and film",
    menu: ["Home", "Shoots", "About", "Contact"], heroTitle: "Moments, kept for good", heroText: "Weddings, portraits and products.",
    about: "Your style, gear, and the kind of shoots you love.", card: ["Shoot type and starting price", "One line: hours and photos delivered"],
    copy: { formal: [["{name}: wedding and portrait photography", "Natural light, honest moments"], ["Edited photos delivered within two weeks."], ["{name} photographs weddings, families and brands with a calm, natural style. Albums and online galleries included."]],
      friendly: [["Smile! It's {name}", "Photos you'll love looking back on"], ["Tell me your date and your story."], ["I'm the person behind {name}. I keep shoots relaxed so you forget the camera is there."]],
      bold: [["{name}. Frame-worthy.", "Shots that stop the scroll."], ["Dates fill fast. Book yours."], ["{name} shoots bold, bright and real. No stiff poses."]] },
    ideas: [["Wedding day", "Full day, two shooters, 500 edited photos."], ["Portrait session", "One hour, two outfits, 30 photos."], ["Product shoot", "Clean white-background photos for online stores."]] },

  wedding: { ld: "Event", heading: "Events", cta: "Please confirm if you can come.", kicker: "Save the date",
    menu: ["Home", "Events", "Our story", "Contact"], heroTitle: "Priya and Arjun are getting married", heroText: "12 February, Jaipur. We'd love you there.",
    about: "How you met, and a few lines for your guests.", card: ["Event name and date", "One line: time, venue and dress code"],
    copy: { formal: [["{name}: wedding celebrations", "You are cordially invited"], ["Dates, venues and travel details for our guests."], ["With the blessings of our families, we invite you to celebrate our wedding. All details for each event are below."]],
      friendly: [["{name}: we're getting married!", "Come celebrate with us"], ["Food, music and a lot of dancing. See you there!"], ["We met in college and never stopped talking. Now we want our favourite people with us on the big day."]],
      bold: [["{name}. The big day.", "Mark the date."], ["Three days. One party. Don't miss it."], ["It's happening. Pack your best outfit and your dancing shoes."]] },
    ideas: [["Mehendi", "Friday 4pm, garden lawn. Wear green."], ["Sangeet", "Friday 8pm, banquet hall. Dance ready."], ["Wedding", "Saturday 7pm, main hall. Dinner follows."]] }
};

// Copy each type into the tables used by steps.js, parts.js, seo.js and copybank.js
Object.keys(MORE_TYPES).forEach(type => {
  const t = MORE_TYPES[type];
  STEPS.find(step => step.id === "type").options.push(type);
  SITE_DEFAULTS[type] = { menu: t.menu, heroTitle: t.heroTitle, heroText: t.heroText, about: t.about,
    "cards.title": t.card[0], "cards.detail": t.card[1] };
  CARD_HEADINGS[type] = t.heading;
  CTAS[type] = t.cta;
  KICKERS[type] = t.kicker;
  LD_TYPES[type] = t.ld;
  CARD_IDEAS[type] = t.ideas;
  COPY[type] = {};
  TONES.forEach(tone => {
    const [heroTitle, heroText, about] = t.copy[tone];
    COPY[type][tone] = { heroTitle: heroTitle, heroText: heroText, about: about };
  });
});
