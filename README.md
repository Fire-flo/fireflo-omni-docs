# FireFlo OMNI documentation

The published documentation site for FireFlo OMNI: one inbox, one set of contacts and one
API for SMS, WhatsApp, RCS and voice, with batteries for AI agents, calendars,
catalogues, customer data, pipelines and tickets. Built with [Mintlify](https://mintlify.com).

**FireFlo OMNI is commercial software.** This site is public and written for the people
who use it — businesses on the panel, developers on the API, and FireFlo's operators —
none of whom will have the source. Nothing here should assume they do. Read
[STYLE.md](STYLE.md) before writing a page.

## Running it locally

```bash
npx mintlify dev --port 3300
```

(3300, because the OMNI panel's own dev server uses 3200.)

Before every commit:

```bash
node scripts/check.mjs
npx mintlify broken-links
```

`check.mjs` fails when a published API operation has no page (or a page names one that
no longer exists), when a page carries anything from the "must not appear" list, or
when a page shows a screenshot that isn't there.

## How the site is made

| Part | From |
| :--- | :--- |
| Get started, Using OMNI, Channels, Batteries, For operators | The product's behaviour, read from the code and checked in the running panel |
| Developers and the hand-written API reference | The API's code, and requests run against a development API |
| API reference → Try it | `api-reference/openapi.json`, the API's published description, saved as JSON |
| Screenshots | `scripts/capture-screenshots.mjs`, on demo data |

**The code is authoritative for every fact.** Pages carry no provenance — the site is
public — so when something looks wrong, start from the product, then this repo's history.

### Refreshing the API description

With a development API running:

```bash
node scripts/refresh-openapi.mjs            # reads http://localhost:8200/v1/openapi.json
node scripts/check.mjs                       # then write a page for any new operation
```

### Recapturing screenshots

On a development panel and API, with the demo data loaded (`manage.py seed_dev` on the
API — development databases only):

```bash
npm install                                   # Playwright, for the capture script only
OMNI_API_DIR=../fireflo-omni node scripts/capture-screenshots.mjs
```

The script signs in by asking the API's `manage.py` for a short-lived session for each
demo user — no password is stored — and saves every screen in `scripts/screens.mjs` to
`images/`.

## What must not appear on the published site

- Any claim of an open-source or GPL licence.
- Links to source repositories, issue trackers or discussion forums.
- Support routed anywhere except **support@fireflo.au**.
- Wording implying a reader can clone, fork, build or freely obtain the software.
- Internal source paths, module, package, class or function names, migration or test
  names, internal hostnames and ports, and providers' internal ids. **State the
  behaviour, not the file that implements it.**
