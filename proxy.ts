import {NextRequest, NextResponse} from "next/server"

const PRESENTATION_PATH = /^\/prezentacja-([a-z0-9-]+)\.html$/

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname === "/prezentacja-handlowa.html") {
    return new NextResponse("Nie znaleziono prezentacji.", {
      status: 404,
      headers: {"Cache-Control": "no-store"},
    })
  }

  const match = pathname.match(PRESENTATION_PATH)
  if (!match) return NextResponse.next()

  const slug = match[1]

  const presentationUrl = request.nextUrl.clone()
  presentationUrl.pathname = "/prezentacja-handlowa.html"
  presentationUrl.search = ""
  presentationUrl.searchParams.set("presentation", slug)

  const response = NextResponse.rewrite(presentationUrl)
  response.headers.set("Cache-Control", "private, no-store")
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive")
  return response
}

export const config = {
  matcher: ["/prezentacja-handlowa.html", "/prezentacja-:slug.html"],
}
