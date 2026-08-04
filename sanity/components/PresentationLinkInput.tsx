import {useState} from "react"
import {useFormValue} from "sanity"

const SITE_URL = "https://glassivdeco.com"

export function PresentationLinkInput() {
  const slug = useFormValue(["slug", "current"]) as string | undefined
  const [copied, setCopied] = useState(false)
  const presentationUrl = slug
    ? `${SITE_URL}/prezentacja-${encodeURIComponent(slug)}.html`
    : ""

  const copyLink = async () => {
    if (!presentationUrl) return
    await navigator.clipboard.writeText(presentationUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  if (!presentationUrl) {
    return (
      <div
        style={{
          border: "1px solid var(--card-border-color)",
          borderRadius: 6,
          padding: 16,
          color: "var(--card-muted-fg-color)",
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        Uzupełnij nazwę klienta i wygeneruj adres prezentacji. Gotowy link pojawi
        się tutaj.
      </div>
    )
  }

  return (
    <div
      style={{
        border: "1px solid var(--card-border-color)",
        borderRadius: 6,
        padding: 16,
      }}
    >
      <div
        style={{
          color: "var(--card-muted-fg-color)",
          fontSize: 12,
          marginBottom: 10,
        }}
      >
        Po kliknięciu Publish prezentacja będzie dostępna pod adresem:
      </div>
      <a
        href={presentationUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          color: "var(--card-link-color)",
          display: "block",
          fontSize: 14,
          fontWeight: 600,
          overflowWrap: "anywhere",
          textDecoration: "underline",
        }}
      >
        {presentationUrl}
      </a>
      <div style={{display: "flex", gap: 8, marginTop: 14}}>
        <button
          type="button"
          onClick={copyLink}
          style={{
            background: "var(--button-primary-bg-color)",
            border: 0,
            borderRadius: 4,
            color: "var(--button-primary-fg-color)",
            cursor: "pointer",
            font: "inherit",
            fontSize: 13,
            fontWeight: 600,
            padding: "8px 12px",
          }}
        >
          {copied ? "Skopiowano" : "Kopiuj link"}
        </button>
        <a
          href={presentationUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            border: "1px solid var(--card-border-color)",
            borderRadius: 4,
            color: "inherit",
            fontSize: 13,
            fontWeight: 600,
            padding: "8px 12px",
            textDecoration: "none",
          }}
        >
          Otwórz prezentację
        </a>
      </div>
    </div>
  )
}
