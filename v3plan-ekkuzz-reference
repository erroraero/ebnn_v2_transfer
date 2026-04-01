# v3 · Spotify Realtime Widget — `ebnn.xyz/me`

> Implementation plan for a **server-side Spotify Now Playing widget** with realtime polling, OAuth token refresh, and a Digital Obsidian–styled frontend component.

---

## 1. Overview

| Layer | Technology |
|---|---|
| Auth & Token Store | Spotify OAuth 2.0 + Supabase (or KV on Cloudflare) |
| API Proxy / Backend | Next.js API Route (`/api/spotify/now-playing`) |
| Realtime Transport | Client-side polling (5s interval) or SSE |
| Frontend Widget | React component · Digital Obsidian aesthetic |
| Deployment | Coolify on Hetzner VPS (existing infra) |

---

## 2. Spotify OAuth Setup

### 2.1 App Registration

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Create app → set redirect URI:
   ```
   https://ebnn.xyz/api/spotify/callback
   ```
3. Grab `CLIENT_ID` and `CLIENT_SECRET`
4. Required scope: `user-read-currently-playing user-read-playback-state`

### 2.2 First-Time Auth Flow (one-time manual)

```
GET https://accounts.spotify.com/authorize
  ?client_id=CLIENT_ID
  &response_type=code
  &redirect_uri=https://ebnn.xyz/api/spotify/callback
  &scope=user-read-currently-playing%20user-read-playback-state
```

`/api/spotify/callback` handler exchanges `code` for `access_token` + `refresh_token`, then persists them.

---

## 3. Token Persistence Strategy

### Option A — Supabase (recommended, existing stack)

```sql
create table spotify_tokens (
  id          int primary key default 1,
  access_token  text,
  refresh_token text,
  expires_at    timestamptz
);
```

Single-row pattern (id = 1 always). On every API call:
- Check `expires_at < now()` → if stale, hit `/api/token` to refresh and UPDATE row.

### Option B — Coolify Environment Secrets (simpler, no DB)

Store `SPOTIFY_REFRESH_TOKEN` as an env var. Access token lives only in memory; refresh happens in-process on every cold start or expiry. Works fine for single-instance deploys.

---

## 4. Backend API Routes

### `GET /api/spotify/now-playing`

```ts
// pages/api/spotify/now-playing.ts  (or app/api/...)

import { getValidAccessToken } from '@/lib/spotify'

export async function GET() {
  const token = await getValidAccessToken()

  const res = await fetch(
    'https://api.spotify.com/v1/me/player/currently-playing',
    { headers: { Authorization: `Bearer ${token}` } }
  )

  if (res.status === 204 || res.status > 400) {
    return Response.json({ isPlaying: false })
  }

  const data = await res.json()

  return Response.json({
    isPlaying:    data.is_playing,
    title:        data.item?.name,
    artist:       data.item?.artists?.map((a: any) => a.name).join(', '),
    album:        data.item?.album?.name,
    albumArt:     data.item?.album?.images?.[0]?.url,
    songUrl:      data.item?.external_urls?.spotify,
    progressMs:   data.progress_ms,
    durationMs:   data.item?.duration_ms,
  })
}
```

### `lib/spotify.ts` — Token Refresh Helper

```ts
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

export async function getValidAccessToken(): Promise<string> {
  // 1. Load stored token + expiry (from Supabase or env)
  // 2. If not expired → return access_token
  // 3. Else → POST /api/token with refresh_token (Basic auth)
  // 4. Persist new access_token + new expires_at
  // 5. Return new access_token

  const params = new URLSearchParams({
    grant_type:    'refresh_token',
    refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
  })

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })

  const json = await res.json()
  // Persist json.access_token, json.expires_in (3600s)
  return json.access_token
}
```

---

## 5. Frontend Widget

### 5.1 Design Direction — Digital Obsidian

Matches the `avrxt.in` aesthetic:

| Token | Value |
|---|---|
| Background | `#0a0a0f` / glassmorphic `rgba(255,255,255,0.04)` |
| Border | `1px solid rgba(255,255,255,0.08)` |
| Accent (active) | `#1DB954` (Spotify green) |
| Accent (idle) | `#444` |
| Fonts | `DM Mono` (metadata) + `Syne` (track title) |
| Progress bar | thin, green, animated |

### 5.2 Component

```tsx
// components/SpotifyWidget.tsx
'use client'

import { useEffect, useState } from 'react'

type Track = {
  isPlaying: boolean
  title?: string
  artist?: string
  albumArt?: string
  songUrl?: string
  progressMs?: number
  durationMs?: number
}

const POLL_INTERVAL = 5000

export function SpotifyWidget() {
  const [track, setTrack] = useState<Track | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const fetchNowPlaying = async () => {
      const res = await fetch('/api/spotify/now-playing')
      const data: Track = await res.json()
      setTrack(data)
      setProgress(data.progressMs ?? 0)
    }

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  // Live progress tick between polls
  useEffect(() => {
    if (!track?.isPlaying) return
    const tick = setInterval(() => {
      setProgress(p => Math.min(p + 1000, track.durationMs ?? p))
    }, 1000)
    return () => clearInterval(tick)
  }, [track])

  if (!track) return null

  const pct = track.durationMs
    ? (progress / track.durationMs) * 100
    : 0

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }

  return (
    <a
      href={track.songUrl ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="spotify-widget"
    >
      {track.isPlaying ? (
        <>
          <img src={track.albumArt} alt={track.title} className="album-art" />
          <div className="meta">
            <span className="status">
              <span className="dot" /> NOW PLAYING
            </span>
            <p className="title">{track.title}</p>
            <p className="artist">{track.artist}</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="timestamps">
              <span>{fmt(progress)}</span>
              <span>{fmt(track.durationMs ?? 0)}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="idle">
          <span className="dot idle-dot" />
          <span>NOT PLAYING</span>
        </div>
      )}
    </a>
  )
}
```

### 5.3 Styles (CSS variables approach)

```css
.spotify-widget {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  backdrop-filter: blur(12px);
  text-decoration: none;
  transition: border-color 0.2s;
  max-width: 320px;
}

.spotify-widget:hover {
  border-color: rgba(29, 185, 84, 0.35);
}

.album-art {
  width: 52px;
  height: 52px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.meta { flex: 1; min-width: 0; }

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
  color: #1DB954;
  text-transform: uppercase;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1DB954;
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.75); }
}

.title {
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #f0f0f0;
  margin: 3px 0 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #777;
  margin: 0 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress-bar {
  height: 2px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #1DB954;
  border-radius: 2px;
  transition: width 1s linear;
}

.timestamps {
  display: flex;
  justify-content: space-between;
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  color: #555;
  margin-top: 4px;
}

.idle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #444;
  letter-spacing: 0.1em;
}

.idle-dot {
  background: #333;
  animation: none;
}
```

---

## 6. Environment Variables

```env
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=        # obtained during first-time OAuth flow
NEXT_PUBLIC_SITE_URL=https://ebnn.xyz
```

Add all to Coolify → Environment tab for the `ebnn.xyz` service.

---

## 7. SSE Alternative (Optional — True Realtime)

Instead of client polling, stream updates server-side:

```ts
// app/api/spotify/stream/route.ts
export async function GET() {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = async () => {
        const data = await getNowPlaying()
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }
      await send()
      const interval = setInterval(send, 5000)
      // cleanup via AbortSignal not shown for brevity
    }
  })
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    }
  })
}
```

Client swaps `setInterval(fetch...)` for `new EventSource('/api/spotify/stream')`.

> **Recommendation**: Polling (5s) is simpler and sufficient. Use SSE only if you want sub-5s latency or want to eliminate redundant fetch overhead.

---

## 8. `/me` Page Integration

```tsx
// app/me/page.tsx
import { SpotifyWidget } from '@/components/SpotifyWidget'

export default function MePage() {
  return (
    <main>
      {/* ... other /me content ... */}
      <section className="audio-terminal">
        <SpotifyWidget />
      </section>
    </main>
  )
}
```

---

## 9. Checklist

- [ ] Create Spotify app at developer.spotify.com, set redirect URI
- [ ] Run one-time OAuth flow, capture `refresh_token`
- [ ] Add env vars to Coolify (`CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN`)
- [ ] Implement `lib/spotify.ts` token refresh helper
- [ ] Add `/api/spotify/now-playing` route
- [ ] Add `/api/spotify/callback` route (one-time, can be removed after)
- [ ] Build `SpotifyWidget` component with Digital Obsidian styles
- [ ] Mount widget in `ebnn.xyz/me` page
- [ ] Test: playing state, paused/idle state, progress tick accuracy
- [ ] Test: token expiry recovery (simulate by clearing stored token)

---

## 10. Notes & Gotchas

- **Token refresh window**: Spotify `access_token` expires in **3600s**. Refresh proactively at `expires_at - 60s` to avoid a failed request mid-poll.
- **204 No Content**: Spotify returns 204 (not JSON) when nothing is playing. Always guard `res.status === 204`.
- **Private session**: If user has Private Session enabled in Spotify, the API returns 204 even while playing. Nothing you can do — show idle state.
- **Rate limits**: Polling at 5s = 720 req/hr. Spotify's unofficial limit is ~1000 req/hr per token; you're safe.
- **Album art CORS**: Spotify CDN images (`i.scdn.co`) are CORS-safe — use directly in `<img>`.
- **Resend/email**: If you ever embed album art in an email newsletter, inline the image as base64 — external CDN images often get blocked by mail clients.
