import {NextRequest, NextResponse} from "next/server"
import {
  createPresentationSession,
  normalizePresentationSlug,
  presentationCookieName,
  presentationPassword,
  presentationSessionSeconds,
  verifyPassword,
} from "@/lib/presentationAuth"

function presentationPath(slug: string) {
  return `/prezentacja-${slug}.html`
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] || character,
  )
}

function loginPage(slug: string, hasError: boolean, isConfigured: boolean) {
  const safeSlug = escapeHtml(slug)
  const clientLabel = escapeHtml(slug.replace(/-/g, " ").toLocaleUpperCase("pl"))
  const message = !isConfigured
    ? "Dostęp do prezentacji nie został jeszcze skonfigurowany."
    : hasError
      ? "Podane hasło jest nieprawidłowe."
      : "Wpisz hasło otrzymane od Glassiv Deco."

  return `<!doctype html>
<html lang="pl">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow, noarchive">
    <title>Prezentacja ${clientLabel} — Glassiv Deco</title>
    <style>
      :root { color-scheme: dark; font-family: Arial, Helvetica, sans-serif; }
      * { box-sizing: border-box; }
      body {
        min-height: 100vh; margin: 0; display: grid; place-items: center;
        padding: 24px; color: #f6f2e9;
        background:
          radial-gradient(circle at 80% 15%, rgba(173,132,62,.24), transparent 32rem),
          linear-gradient(145deg, #11100f, #201b16 58%, #0b0b0b);
      }
      main {
        width: min(100%, 430px); padding: 42px 38px; border: 1px solid rgba(203,171,111,.32);
        background: rgba(12,12,12,.78); box-shadow: 0 24px 80px rgba(0,0,0,.4);
        backdrop-filter: blur(16px);
      }
      img { width: 152px; height: auto; margin-bottom: 42px; }
      .eyebrow { color: #c9a96b; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; }
      h1 { margin: 12px 0 10px; font: 400 clamp(28px, 7vw, 42px)/1.05 Georgia, serif; }
      p { min-height: 42px; margin: 0 0 26px; color: #b9b5ad; font-size: 14px; line-height: 1.5; }
      label { display: block; margin-bottom: 8px; color: #d9d3c8; font-size: 12px; }
      input {
        width: 100%; border: 1px solid #4a4237; border-radius: 0; padding: 14px 15px;
        color: white; background: #171512; font: inherit; outline: none;
      }
      input:focus { border-color: #c9a96b; box-shadow: 0 0 0 2px rgba(201,169,107,.12); }
      button {
        width: 100%; margin-top: 14px; border: 1px solid #c9a96b; padding: 14px;
        color: #15120e; background: #c9a96b; font-weight: 700; letter-spacing: .08em;
        text-transform: uppercase; cursor: pointer;
      }
      button:hover { background: #ddc087; }
      .error { color: #efaaa0; }
    </style>
  </head>
  <body>
    <main>
      <img src="/logoglassivdeco-white.svg" alt="Glassiv Deco">
      <span class="eyebrow">Prezentacja handlowa</span>
      <h1>${clientLabel}</h1>
      <p${hasError || !isConfigured ? ' class="error"' : ""}>${message}</p>
      ${
        isConfigured
          ? `<form method="post" action="/api/presentation-auth">
        <input type="hidden" name="presentation" value="${safeSlug}">
        <label for="password">Hasło dostępu</label>
        <input id="password" name="password" type="password" required autocomplete="current-password" autofocus>
        <button type="submit">Otwórz prezentację</button>
      </form>`
          : ""
      }
    </main>
  </body>
</html>`
}

function htmlResponse(html: string, status = 200) {
  return new NextResponse(html, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Security-Policy":
        "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
      "Content-Type": "text/html; charset=utf-8",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    },
  })
}

export async function GET(request: NextRequest) {
  const slug = normalizePresentationSlug(
    request.nextUrl.searchParams.get("presentation") || "",
  )

  if (!slug) return new NextResponse("Nie znaleziono prezentacji.", {status: 404})

  const hasError = request.nextUrl.searchParams.get("error") === "1"
  return htmlResponse(loginPage(slug, hasError, Boolean(presentationPassword(slug))))
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const slug = normalizePresentationSlug(String(formData.get("presentation") || ""))
  const password = String(formData.get("password") || "")

  if (!slug) return new NextResponse("Nieprawidłowa prezentacja.", {status: 400})

  const loginUrl = new URL("/api/presentation-auth", request.url)
  loginUrl.searchParams.set("presentation", slug)

  if (!(await verifyPassword(slug, password))) {
    loginUrl.searchParams.set("error", "1")
    return NextResponse.redirect(loginUrl, 303)
  }

  const session = await createPresentationSession(slug)
  if (!session) {
    return htmlResponse(loginPage(slug, false, false), 503)
  }

  const response = NextResponse.redirect(
    new URL(presentationPath(slug), request.url),
    303,
  )
  response.cookies.set(presentationCookieName(slug), session, {
    httpOnly: true,
    maxAge: presentationSessionSeconds(),
    path: presentationPath(slug),
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
  response.headers.set("Cache-Control", "no-store")

  return response
}
