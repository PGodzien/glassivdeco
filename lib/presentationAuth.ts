const COOKIE_PREFIX = "glassiv_presentation_"
const DEFAULT_SESSION_SECONDS = 60 * 60 * 12

function encodeHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

function getSessionSeconds() {
  const configured = Number(process.env.PRESENTATION_SESSION_SECONDS)

  return Number.isFinite(configured) && configured > 0
    ? Math.floor(configured)
    : DEFAULT_SESSION_SECONDS
}

function getPasswordMap() {
  const configured = process.env.PRESENTATION_PASSWORDS

  if (!configured) return {}

  try {
    const parsed = JSON.parse(configured) as unknown

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {}

    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    )
  } catch {
    return {}
  }
}

async function digest(value: string) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))
}

async function sign(value: string) {
  const secret = process.env.PRESENTATION_AUTH_SECRET

  if (!secret) return null

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    {hash: "SHA-256", name: "HMAC"},
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  )

  return encodeHex(signature)
}

export function normalizePresentationSlug(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("pl")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96)
}

export function presentationCookieName(slug: string) {
  return `${COOKIE_PREFIX}${normalizePresentationSlug(slug)}`
}

export function presentationSessionSeconds() {
  return getSessionSeconds()
}

export function presentationPassword(slug: string) {
  const normalizedSlug = normalizePresentationSlug(slug)
  const passwords = getPasswordMap()

  return passwords[normalizedSlug] || process.env.PRESENTATION_PASSWORD || null
}

export async function verifyPassword(slug: string, candidate: string) {
  const expected = presentationPassword(slug)

  if (!expected) return false

  const [candidateHash, expectedHash] = await Promise.all([
    digest(candidate),
    digest(expected),
  ])
  const candidateBytes = new Uint8Array(candidateHash)
  const expectedBytes = new Uint8Array(expectedHash)
  let difference = candidateBytes.length ^ expectedBytes.length

  for (let index = 0; index < candidateBytes.length; index += 1) {
    difference |= candidateBytes[index] ^ (expectedBytes[index] || 0)
  }

  return difference === 0
}

export async function createPresentationSession(slug: string) {
  return sign(`presentation:${normalizePresentationSlug(slug)}`)
}

export async function verifyPresentationSession(
  slug: string,
  session: string | undefined,
) {
  if (!session) return false

  const expected = await createPresentationSession(slug)

  if (!expected || expected.length !== session.length) return false

  let difference = 0
  for (let index = 0; index < expected.length; index += 1) {
    difference |= expected.charCodeAt(index) ^ session.charCodeAt(index)
  }

  return difference === 0
}
