# Before this goes public — questions for Ivy

Jeff built this site for you. **Nothing has been published.** It exists only on his
machine. This file is the list of things that need your word before it goes anywhere.

Please read it end to end. Several items are claims about you that neither of us can
verify, and a couple are things we may simply have got wrong.

---

## 1. Do you actually want this public?

You currently work at Quepay. This site says "Open to instrumentation & control roles"
and is built to be found in a Google search for your name. That means your current
employer can find it too.

Nobody asked you about that. It is your call, not ours.

- [ ] Yes, publish it and make it findable
- [ ] Publish, but leave it out of search engines
- [ ] Keep it private, link-only
- [ ] Don't publish

---

## 2. Numbers we could not source

These appear on the site or in your CV. Some came from your own public posts and are
solid. The rest were **drafted, not sourced** — plausible for your work, but nobody
measured them.

**Please give the real figure, or say "cut it" and we remove it.** Do not just confirm
the number below: it will anchor you. Try to recall the actual value first.

| Claim | Where | Status |
| --- | --- | --- |
| KES 10M+ processed, 99% uptime, 6+ verticals | QuePay | ✅ from quepay.co.ke |
| 40 × 50 mm, 50% Uno replication | Atmega board | ✅ your LinkedIn post |
| 4-layer QuePay board, 6-layer EPS board | both | ⚠️ from Jeff, needs your confirm |
| ±2% dispense accuracy | QuePay | ❌ drafted |
| 92% conversion efficiency, 5 W budget | EPS | ❌ drafted |
| 18 mA standby reduction, 6 candidate MCUs | EPS | ❌ drafted |
| 2 ms control loop jitter, 32 KB flash, 8 drivers | Veno | ❌ drafted |
| 7 products in 10 months | Veno | ⚠️ from Veno's project page, is it yours? |
| 250 installed units, 60% return-rate drop, 15 escalations | QuePay | ❌ drafted |
| 4-person team, 12-minute validation, 2% defect rate | QuePay | ❌ drafted |
| 3 rigs / 4 boards / 6 interfaces / 35% power cut | Gearbox | ❌ drafted |

---

## 3. Three things we think are wrong

**a. CP2101 or CP2102?**
Your repo README says **CP2101**. Your LinkedIn post says **CP2102**. Different parts.
The schematic in `First-Atmega328P-code` settles it — please check and tell us which.
A hardware reviewer will open that repo.

**b. The Atmega8 claim.**
Your LinkedIn said you used the bridge "instead of the Atmega8 used on some boards."
That is not right: the Uno used an ATmega8U2 (R1/R2) or ATmega16U2 (R3), never a plain
ATmega8. Worse, an earlier draft of your CV dropped your hedge and stated it flatly.
The site now avoids the part number entirely and describes the decision instead. Your CV
may still need fixing.

**c. Fusion 360 timing.**
Your CV says you did enclosure and packaging design at Veno (through Jan 2025). Your
`LearnFusion360` repo was last pushed **May 2025** and describes a 5-week beginner plan.
If the CAD came after the job, the CV claim needs rewording.

---

## 4. TIA Portal and PLC

Your CV claims **Siemens TIA Portal, PLC programming, ladder logic and HMI**. There is no
evidence for any of it in your public record. Your one PLC-labelled repo
(`Power_Supply_Mod`, "My first PLC ladder logic programs") actually contains a 240 V
bench power supply schematic — looks like a copy-paste error in the description.

This matters because **Octavia Carbon runs TIA Portal**. The person interviewing you uses
it daily and will spot an overstatement in about two questions.

- [ ] I have real TIA Portal experience — here is where
- [ ] University coursework only → we move it under Education as coursework
- [ ] I have not used it → we cut it

If it is coursework, that is completely fine and still worth listing. It just has to be
labelled honestly.

**A better option, if you have two spare evenings:** do a small OpenPLC or TIA Portal
trial exercise and push it to your GitHub with a README. That turns the weakest claim on
your CV into a true, dated, publicly verifiable one.

---

## 5. Things only you know

- **Level Sensor** — what medium, what range, what accuracy? This is the single most
  relevant thing you have for the Octavia role and the page currently says nothing
  specific. Real numbers here would be worth more than everything else on this list.
- **Awamu** — it is on Veno's project page. What is it? What did you do on it?
- **Which of the seven Veno products did you lead**, versus contribute to?
- **Your Quepay title** — the site says "Hardware Designer & Technical Operations Lead."
  ZoomInfo says "Embedded Hardware Designer." Which is on your contract?
- **Notice period**, if you want it listed.

---

## 6. Photos

Every image on the site is an empty dashed placeholder. Anything you can publish helps,
in rough order of value:

1. A portrait — every comparable portfolio has one
2. The Atmega328P board (yours outright, already open source, zero clearance needed)
3. Any employer board you have written permission to show
4. Screenshots from Altium or KiCad — often easier to clear than a photo of hardware

Drop files in `public/` and set `cover:` in the matching file under `content/projects/`.
The build resizes and converts them automatically.

---

## 7. The writing is in your voice but is not your words

The whole site is first person. Jeff and an AI wrote it. Lines like *"on someone else's
worst day"* and *"I read fairly indiscriminately"* are our characterisation of you.

Read it as if a stranger will judge you by it, because they will. Rewrite anything that
does not sound like you — especially the hero and the About section.

The one line that is genuinely yours is from your LinkedIn: embedded systems as an art
spanning electronic, mechanical and software design. That one we kept because you said it.

---

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # unit tests
npm run build   # production build into out/
```

Editing content, no React needed:

- **Your experience** → `content/timeline.ts`
- **Project write-ups** → `content/projects/*.mdx`
- **Everything else on the home page** → `app/page.tsx`

If a project file has a typo in its header, the build tells you which file and keeps
going rather than dying.
