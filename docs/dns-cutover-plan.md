# DNS cutover runbook — Route 53 (staged 2026-08-01)

**Everything is pre-staged. The only Namecheap action on cutover day is
changing the nameservers.** Stack: `dev-workshift-dns` (us-west-2), source
`api/resource/dns/dns-main.yaml`, deployed via `./deploy-dns-dev.sh`.

## What is already done

- **Route 53 hosted zones live** for both domains, records verified against
  Namecheap's authoritative servers record-by-record (MX, SPF, DKIM
  byte-identical at 411 chars each, DMARC, www, cpanel). The NS swap is a
  functional no-op: apex/www still point at cPanel (`199.188.200.144`) until
  the flip.
- **Beyond the mirror** (deliberate additions):
  - `_dmarc` upgraded to `p=none; rua=mailto:dmarc@<domain>; fo=1` — same
    non-enforcing policy, now with aggregate reports so deliverability is
    observable before ad campaigns. **Requires the `dmarc@` alias/group to
    exist in Google Workspace on both domains** (create before swap).
  - **CAA** locked to the CAs in use: amazon.com (ACM), sectigo/comodoca
    (cPanel AutoSSL), letsencrypt.org.
  - **`forms.<domain>` → cPanel** on both domains: the forms-bridge subdomain
    so PHP form handlers keep working after the sites move.
  - **ACM validation CNAMEs pre-staged** for both certificates.
- **ACM certs requested 2026-08-01** (us-east-1, apex + www):
  - nume: `arn:aws:acm:us-east-1:054743862825:certificate/0b19b862-a1ca-4594-8390-00e024c1307b`
  - mythic: `arn:aws:acm:us-east-1:054743862825:certificate/0fec1512-e887-41c2-8e96-1cef64a082ba`
  - DNS-validated certs time out after ~72h unvalidated. If status is
    `VALIDATION_TIMED_OUT` on cutover day, re-request — validation tokens are
    stable per domain+account, so the pre-staged CNAMEs still satisfy the new
    request: `aws acm request-certificate --region us-east-1 --domain-name
    <domain> --subject-alternative-names www.<domain> --validation-method DNS`
- **SEO layer staged on both v2 sites**: robots.txt, sitemap.xml (final-domain
  URLs), JSON-LD (Pharmacy with full NAP for mythic; MedicalOrganization for
  nume; auto-FAQPage on FAQ pages).

## Nameservers to paste at Namecheap (Domain → Nameservers → Custom DNS)

| Domain | Nameservers |
|---|---|
| nume-health.com | ns-1304.awsdns-35.org · ns-1553.awsdns-02.co.uk · ns-165.awsdns-20.com · ns-639.awsdns-15.net |
| mythic-rx.com | ns-839.awsdns-40.net · ns-284.awsdns-35.com · ns-2045.awsdns-63.co.uk · ns-1475.awsdns-56.org |

## Cutover day (target: Saturday evening, Aug 8)

1. **Before touching anything:** confirm `dmarc@` aliases exist; send/receive
   a test email on both domains (baseline).
2. **Swap nameservers** at Namecheap (table above). Both domains, or
   mythic first if staging it. Old NS keep answering for cached resolvers;
   answers are identical either way, so there is no cutover window risk.
3. **Watch the certs** (usually minutes after propagation):
   `aws acm describe-certificate --region us-east-1 --certificate-arn <arn>
   --query Certificate.Status` → wait for `ISSUED` on both.
4. **Attach certs to CloudFront:**
   `NUME_CERT_ARN=<arn> MYTHIC_CERT_ARN=<arn> ./deploy-sites-dev.sh`
5. **Flip the sites to CloudFront:** `SITE_TARGET=cloudfront ./deploy-dns-dev.sh`
   (300s TTLs are already set — takes effect in ~5 minutes).
6. **Verify:** apex + www load over HTTPS on both domains; forms submit;
   **send a test email in and out on both domains** (MX untouched, but prove
   it); `cpanel.<domain>` and `forms.<domain>` still reach the old host.
7. Leave cPanel hosting active for at least a week. Do not cancel on cutover day.

## Rollback

- Site-only problem: `SITE_TARGET=cpanel ./deploy-dns-dev.sh` (≈5 min).
- Anything worse: set Namecheap nameservers back to
  `dns1/dns2.namecheaphosting.com` — the old zone still exists untouched.

## Post-cutover (SEO + marketing verifications — add TXTs to Route 53 via CFN)

1. **Google Search Console**: verify both domains (DNS TXT), submit both
   sitemaps.
2. **Google Business Profile** for Mythic Rx (Millcreek NAP matches the
   licensure page + JSON-LD exactly — keep it that way).
3. **Ad platform domain verifications** as accounts are created: Meta
   (`facebook-domain-verification=`), TikTok, Microsoft — each is one TXT
   record added to `dns-main.yaml` + `./deploy-dns-dev.sh`.
4. **SPF tightening** once the PHP forms bridge is retired:
   `v=spf1 include:_spf.google.com ~all` (drop `+a +mx`).
5. **DMARC ratchet** after ~30 days of clean rua reports: `p=quarantine`,
   later `p=reject` — deliverability insurance before heavy ad sending.
6. Raise site-record TTLs to 3600 once stable.

## Decommissioned plan

The earlier Namecheap-ALIAS approach (edit records in the Namecheap dashboard)
is superseded by this Route 53 migration — DNS consolidates into AWS/CFN like
everything else. The forms-blocker analysis from that plan still applies and
is solved by the `forms.<domain>` bridge records.
