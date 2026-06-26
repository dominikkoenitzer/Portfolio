# Contact API (VPS)

A tiny Node service that receives contact-form submissions from the portfolio
(hosted on Vercel) and emails them to you via an authenticated SMTP account.

**Nothing here affects the live site until the last step.** Until you set
`VITE_CONTACT_ENDPOINT` on the Vercel project, the form keeps using a `mailto:`
link. This folder is deployed to your VPS separately — it is not part of the
Vite build.

---

## Why HTTPS + a subdomain (the part that's easy to miss)

Your site lives at `https://dominikkoenitzer.ch`. Browsers refuse to let an
**https** page send data to a plain **http** address or a bare IP
(`http://12.34.56.78`) — it's called "mixed content" and it's silently blocked.

So the form needs to reach your VPS at a **secure web address**, e.g.
`https://api.dominikkoenitzer.ch`. To get one:

1. In your domain's DNS, add an **A record**: `api` → your VPS's IP address.
   (This makes `api.dominikkoenitzer.ch` point at the VPS.)
2. Run **Caddy** in front of the app (below) — it fetches a free HTTPS
   certificate for that subdomain automatically. Done.

If you don't have a domain on the VPS yet, that DNS A record is the one thing
you need first.

---

## 1. Install

```bash
# on the VPS, inside this folder
npm install
cp .env.example .env
nano .env          # fill in SMTP_* and MAIL_* (see comments in the file)
npm start          # quick test — should print "contact-api listening on :8080"
```

**SMTP credentials**: use your domain mailbox's SMTP settings, or a Gmail
**App Password** (Google account → Security → 2-Step Verification → App
passwords). This relays through a real mailbox so messages reach your inbox
instead of spam — do not try to send directly from the VPS IP.

## 2. Keep it running (systemd)

`/etc/systemd/system/contact-api.service`:

```ini
[Unit]
Description=Portfolio contact API
After=network.target

[Service]
WorkingDirectory=/path/to/server/contact-api
EnvironmentFile=/path/to/server/contact-api/.env
ExecStart=/usr/bin/node index.js
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now contact-api
```

## 3. HTTPS in front (Caddy — automatic certificates)

Install Caddy, then `/etc/caddy/Caddyfile`:

```caddy
api.dominikkoenitzer.ch {
    reverse_proxy localhost:8080
}
```

```bash
sudo systemctl reload caddy
```

Caddy now serves `https://api.dominikkoenitzer.ch/contact` with a valid
certificate, proxying to the Node app on port 8080.

Test it:

```bash
curl -X POST https://api.dominikkoenitzer.ch/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"t@example.com","message":"hello"}'
# -> {"ok":true}  (and an email arrives)
```

## 4. Point the site at it (this activates it)

In the Vercel project → Settings → Environment Variables, add:

```
VITE_CONTACT_ENDPOINT = https://api.dominikkoenitzer.ch/contact
```

Redeploy. The contact form now POSTs here; if the endpoint is ever unreachable
it automatically falls back to the `mailto:` link, so a lead is never lost.

For local testing, put the same line in `.env.local`.

---

## Env reference

See `.env.example`. `ALLOWED_ORIGIN` must exactly match your site's origin
(`https://dominikkoenitzer.ch`, no trailing slash) or the browser blocks the
request (CORS).
