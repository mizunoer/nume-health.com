# Deploying on LiteSpeed / cPanel

If you get **404 Not Found**, the server document root is not pointing at the correct **site folder**.

---

## 1. Confirm the document root

In **cPanel** → **Domains** → select the domain → check **Document Root**.

| Domain | Document root should be |
|---|---|
| nume-health.com | `.../Numi/sites/nume-health.com` |
| mythic-rx.com | `.../Numi/sites/mythic-rx.com` |

The folder must contain `index.html`, `index.php`, `.htaccess`, `assets/`, and `inc/` **directly** — not nested under another subfolder.

---

## 2. Put the site in that folder

After `git pull`, the domain's document root folder should contain:

- `index.html`, `index.php`, `.htaccess`
- `assets/`, `inc/`, `api/` (Nume)
- All `.html` pages for that site

**Do not** point the domain at the repo root (`Numi/`). Site files live under `sites/<domain>/`.

---

## 3. Test these URLs (Nume example)

1. **https://nume-health.com/index.html**
2. **https://nume-health.com/index.php**
3. **https://nume-health.com/**

If both index files 404, the document root path is wrong — fix step 1.

---

## 4. After changing files

Commit and push from your machine, then pull on the server so `sites/nume-health.com/` (or `sites/mythic-rx.com/`) has the latest files.

---

## 5. Migrating from the old layout

If your domain previously pointed at the **repo root**, update cPanel to `sites/nume-health.com/` and test. The old root-level `index.html` is gone; everything moved into `sites/`.
