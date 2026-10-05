# How pages on this site are written

This site is **public**, and documents **closed-source software sold under licence**. Its
readers — businesses using OMNI, developers integrating with it, FireFlo's operators —
do not have the source and must never need it.

## What must never appear

- Any claim of an open-source, GPL or "free software" licence.
- Links to source repositories, issue trackers or discussion forums.
- Support routed anywhere except **support@fireflo.au**.
- Wording implying a reader can clone, fork, build or freely obtain the software.
- Internal source paths, module or package names (`fireflo_*`, `omni/…`, `.py`, `.tsx`),
  class or function names, test names, migration names, or internal hostnames and
  ports. **State the behaviour, not the file that implements it.**
- Provider internals: a provider's ids, FireFlo's gateway addresses, credentials.

## Pages

- Frontmatter is only `title` and `description` (one sentence, what the page answers).
- MDX with Mintlify components: `<Note>`, `<Tip>`, `<Warning>`, `<Steps>`/`<Step>`,
  `<Card>`/`<CardGroup>`, `<Tabs>`/`<Tab>`, `<AccordionGroup>`/`<Accordion>`,
  `<CodeGroup>`, and `<Frame caption="…"><img src="/images/….png" alt="…" /></Frame>` for
  screenshots (absolute paths, names from `scripts/screens.mjs`).
- Plain words, short sentences. Say what a screen answers and how to use it, who may
  (the role or permission), and what the plan must include.
- Facts come from the product's behaviour as it is today. Never invent a feature,
  field, limit or screen; if unsure, leave it out.
- The product is "FireFlo OMNI" (then "OMNI"). Modules are **channels** (SMS, WhatsApp,
  RCS, Voice), **batteries** (AI Agents, Calendar, Catalogue, Customer data, Pipelines,
  Tickets) and the **OMNI API**. Voice is FireFlo's voice service; call it Voice.
- API reference pages: the `title` is the method and path exactly as published
  (`POST /v1/messages`); the check script pairs pages with the published operations by it.
