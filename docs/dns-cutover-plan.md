# DNS cutover plan — nume-health.com + mythic-rx.com

**Status: staged, not applied.** Nothing in here has been changed. This is the
record-by-record plan for moving both sites from Namecheap cPanel hosting to
AWS (S3 + CloudFront), plus the blockers that must clear first.

Verified live on 2026-07-30.

## Where DNS actually lives

Worth stating up front, because it differs from the assumption that these are
"hosted at Squarespace and forwarded to Namecheap": **authoritative DNS for
both domains is Namecheap**, and both sites are served today from Namecheap's
cPanel shared hosting. Squarespace is not in the serving path for either
domain. All record edits below happen in the **Namecheap dashboard**
(Domain List → Manage → Advanced DNS).

If a domain is still *registered* at Squarespace with nameservers delegated to
Namecheap, the registrar is irrelevant to this cutover — only the nameservers
matter, and those are Namecheap's.

## Current state (verified)

| Record | nume-health.com | mythic-rx.com |
|---|---|---|
| Nameservers | `dns1/dns2.namecheaphosting.com` | `dns1/dns2.namecheaphosting.com` |
| A (apex) | `199.188.200.144` | `199.188.200.144` |
| www | CNAME → apex | CNAME → apex |
| MX | Google Workspace (`aspmx.l.google.com`) | Google Workspace (`smtp.google.com`) |
| Live check | HTTP 200 from `199.188.200.144` | HTTP 200 from `199.188.200.144` |

Both apexes also return a stray `192.168.0.1` alongside the real IP. That is a
private address and cannot route from the internet — it should be deleted
regardless of whether the cutover proceeds. It is likely a leftover A record.

## Do not touch

- **MX records.** Both domains run Google Workspace email. Moving web hosting
  must not alter MX, and there is no reason to. Breaking these silently stops
  mail delivery, which is the single worst failure mode of this change.
- **TXT / SPF / DKIM / DMARC**, and any `_domainkey` or verification records.
  They belong to mail and site verification, not hosting.

Change **only** the records that point at the web server: the apex A and the
`www` CNAME.

## Blockers — none of this can proceed yet

1. **The sites stack is not deployed.** `dev-workshift-sites` does not exist in
   `us-west-2` (confirmed: `Stack with id dev-workshift-sites does not exist`).
   Until `./deploy-sites-dev.sh` runs, there are no CloudFront distributions to
   point DNS at.
2. **No ACM certificates.** CloudFront requires certs in **us-east-1**
   specifically. One per domain, covering both apex and `www`.
3. **The contact/feedback forms still need a backend.** The forms currently
   POST to PHP handlers on cPanel (`api/feedback.php`, `php/form_process.php`).
   Those do not exist on S3/CloudFront — static hosting cannot execute PHP. If
   DNS is cut over before this is solved, **every form on both sites breaks.**

   This is now a solved problem in principle: a Workshift workflow using the
   `action.postWebhook` node can call the existing PHP handlers, and this was
   verified end-to-end on 2026-07-30 (a workflow created a real ticket in the
   cPanel feedback store). Two viable options:
   - **Bridge**: keep the PHP handlers running on cPanel at a subdomain that
     stays pointed there, and have the AWS-hosted forms post to it.
   - **Replace**: build a real form endpoint in the API stack and repoint the
     forms at it before cutover.

   The bridge is the lower-risk path for cutover day and can be done first.

## Target records

Once the stack is deployed and certs are issued, per domain:

| Type | Host | Value | Notes |
|---|---|---|---|
| ALIAS (or CNAME) | `@` | `<dist>.cloudfront.net` | Namecheap supports `ALIAS` at the apex; a plain CNAME at apex is invalid DNS |
| CNAME | `www` | `<dist>.cloudfront.net` | Replaces the current CNAME-to-apex |
| CNAME | `_<acm-token>` | `<acm-value>.acm-validations.aws.` | One per domain, from ACM; required for cert issuance |
| — | `@` `192.168.0.1` | **delete** | Unroutable leftover |
| MX / TXT | — | **unchanged** | See "Do not touch" |

Namecheap's `ALIAS` record type is the apex equivalent of a Route 53 alias and
is what makes this work without moving nameservers to Route 53. If you would
rather consolidate DNS into Route 53 later, that is a separate migration and
not required here.

## Sequence

1. Deploy the sites stack (`./deploy-sites-dev.sh`) and confirm both sites load
   on their `*.cloudfront.net` domains.
2. Request ACM certs in **us-east-1** for each domain (apex + `www`), add the
   validation CNAMEs at Namecheap, wait for `ISSUED`.
3. Re-run the deploy with the cert ARNs so CloudFront serves the real domains:
   ```bash
   NUME_CERT_ARN=arn:aws:acm:us-east-1:... MYTHIC_CERT_ARN=arn:aws:acm:us-east-1:... ./deploy-sites-dev.sh
   ```
4. Resolve the forms blocker (bridge or replace) and verify a real submission
   against the CloudFront URL.
5. **Lower TTL to 300s at least 24h before cutover.** `mythic-rx.com` currently
   has a ~4 hour TTL, so without this step a rollback would take four hours to
   take effect. Do this early — it is the cheapest insurance in the plan.
6. Cut over one domain first (recommend `mythic-rx.com`, the lower-traffic of
   the two), watch it, then do the other.
7. Verify after propagation: both apex and `www` resolve to CloudFront, HTTPS
   is valid, forms submit successfully, **and send a test email in and out** to
   confirm MX was untouched.
8. Restore normal TTLs (3600s) once stable.

## Rollback

Set the apex A record back to `199.188.200.144` and `www` back to a CNAME at
the apex. With TTL at 300s this takes effect in about five minutes. Keep the
cPanel hosting active and unchanged until both domains have run on AWS for at
least a week — do not cancel it on cutover day.

## Open questions

- Should DNS move to Route 53 as part of this, or stay at Namecheap? Staying is
  less work and the `ALIAS` type makes it fully viable. Moving centralizes
  everything in AWS and enables real Route 53 alias records and health checks.
- Do any subdomains beyond `www` need to keep pointing at cPanel (webmail,
  cpanel, ftp, autodiscover)? Namecheap hosting usually creates several. They
  should be enumerated in the Namecheap dashboard before cutover — this plan
  only covers records visible from public DNS queries.
