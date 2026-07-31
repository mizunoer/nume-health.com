# Stakeholder email draft — 2026-07-30 (v3: funnel demo added)

**To:** Caleb, Sean
**Subject:** Demo links, migration weekend (Aug 8), and answers to your list

---

Hi Caleb and Sean,

Great calls last week. Links first, then answers to your list.

**New Mythic Rx site** (rebuilt — no more glitching, and built for quick ad pages):
- Site: https://d14of04ct3ybgj.cloudfront.net/v2/index.html
- Color schemes: https://d14of04ct3ybgj.cloudfront.net/v2/brand-options/index.html — pick a direction and the whole site re-paints live, so you can judge each palette on the real thing.

**Sample ad funnel** — what a TikTok/Instagram ad will click into. One question at a time, and it walks you all the way to booking an appointment:
- https://d2cyrazw2rfbbd.cloudfront.net/v2/q.html
- It's in demo mode (nothing you type is stored or sent). Try answering "Another state" or one of the health-history options to see how it politely turns people away.

**Provider portal / EHR demo** (what Kara walked through; all patients intentionally fictional):
- https://nume-health.com/workshift-pharmacy-portal-demo.html

**About the long addresses:** we're moving our websites to Amazon's cloud, and the "cloudfront.net" links are the new hosting's direct addresses — a preview before the signs go up. We're targeting **Saturday evening, August 8** to point mythic-rx.com and nume-health.com at it. Websites should switch without a blip. Email isn't moving, but the switch touches the same routing, so there's a small chance of email delays for an hour or two that evening — hence a weekend. I'll confirm the date beforehand.

**Your list:**

1. **Price list** — got it; since Kara already has it, I'll just reconfirm with her and cc you. One typo to fix before wider use: "Semorelin" → "Sermorelin" (page 2). The ad funnel above already uses this pricing (semaglutide from $100/mo, tirzepatide from $170/mo).
2. **Credentials** — received and verified: Sara's licenses (active to 9/30/2027) and NPI check out, and the pharmacy license (to 9/30/2027) and DEA (to 1/31/2028) are all current. Enrollment screens are being prefilled now — note the license reads "Sara," so we'll enroll that spelling. One ask, no rush: the pharmacy licenses for the other six states — LegitScript and the ad networks will want proof for every state we serve.
3. **Portal feedback** — links above, whenever.
4. **TikTok** — thank Shannyn for us. Organic GLP-1 conversation is alive, so TikTok stays on the launch list — and the ad funnel above is exactly the page those ads will land on. Since influencers are tired of compounding-pharmacy sponsorship pitches, we won't make them — our own content plus regular paid ads instead. Peptide trends: watching, but we only advertise what we dispense and what the platforms and LegitScript allow.
5. **Pilot** — providers. Kara first; send any other provider (or front-office) names and I'll include them in the enrollment links. Test patients come later.
6. **Branding** — so far: Shannyn likes Direction 2, you both like the colors in 1 and 3, nobody loves the logos. Suggestion: pick the palette this week using the live color-scheme link above, and treat the logo as its own project — nothing is waiting on it. The NuMe logo everyone likes stays exactly as is (you'll see it on the ad funnel).
7. **Malpractice** — yes, Sean, please run it by Steve: what malpractice typically costs in this discipline, and whether our credential checks (NPI, license, exclusion-list) lower the platform's premium. Providers still bring their own at launch.
8. **Marketing email** — I would recommend **marketing@nume-health.com** rather than use info@ — keeps ad-platform accounts and mail separate, shareable access. Eventually we may want to migrate off of gmail to save cost. I'll talk to the marketing group and legitscript to see if changes later create issues.

Thanks — the credential packet was exactly what we needed.

Dallin

---

*Internal notes (not part of the email):*
- *Funnel is demo:true — flip + endpoint after the forms-endpoint decision; SMS consent auto-injects on the phone field.*
- *Sara's NPI 1184462368 checksum-validates; confirm NPPES entry matches "Sara Jenna Dewitt" during enrollment.*
- *Portal demo hand-copied to nume staging bucket; must be vendored into workshift-io before DNS cutover (board item).*
- *Aug 8 target assumes Kramer's DNS decision lands this week; MX records untouched per cutover plan.*
