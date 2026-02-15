# Deploying nume-health.com on LiteSpeed / cPanel

If you get **404 Not Found**, the server is not seeing your files in the folder it uses as the web root. Use this checklist.

---

## 1. Confirm the document root

- In **cPanel** go to **Domains** → select **nume-health.com** → check **Document Root**.
- Note the full path (e.g. `public_html/nume-health.com` or `home/username/nume-health.com`).

---

## 2. Put the site in that folder

The **document root folder** must contain these **directly** (no extra `public` subfolder in the URL):

- `index.html`
- `index.php`
- `.htaccess`
- `assets/` (folder)
- `inc/` (folder)
- All other `.html` files (assessment.html, shop.html, etc.)

**Ways to get that:**

- **Option A:** Set document root to the **`public`** folder of your repo.  
  So if the repo is at `/home/user/nume-health.com/`, set document root to `/home/user/nume-health.com/public`.  
  Then the server’s “web root” is `public/`, and `index.html` is at the root.

- **Option B:** Keep document root as it is (e.g. `public_html/nume-health.com`), and upload/copy **only the contents** of the repo’s `public/` folder into that folder.  
  So `index.html`, `index.php`, `.htaccess`, `assets/`, `inc/`, and all `.html` files sit **inside** the document root, not in a subfolder called `public`.

---

## 3. Test these URLs

1. **https://nume-health.com/index.html**  
   - If this works: the file is in the right place; the problem is default index (DirectoryIndex). The `.htaccess` and `index.php` we added should help after you deploy them.
2. **https://nume-health.com/index.php**  
   - If this works: the server prefers `index.php`; the new `index.php` will serve the homepage.
3. **https://nume-health.com/**  
   - Should show the homepage once (1) or (2) works and `.htaccess` / `index.php` are in the document root.

If **both** index.html and index.php return 404, the document root does **not** contain those files — fix step 2 (path or upload).

---

## 4. After changing files

- Commit and push from your repo, then pull or sync on the server so the document root (repo root) has the latest `index.html`, `index.php`, `.htaccess`, and `assets/`.

---

## 5. If it still 404s

- In cPanel **File Manager**, open the **document root** folder and confirm you see `index.html`, `index.php`, and `assets/` there.
- If you use Git on the server, pull the latest and ensure the document root is the `public` directory (Option A above) or that you copy `public/*` into the domain’s document root (Option B).
