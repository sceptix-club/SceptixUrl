import postgres from "postgres"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required")
}

export const sql = postgres(databaseUrl, {
  connect_timeout: 10,
  idle_timeout: 20,
  max: 1,
  prepare: false,
})

export type UrlRecord = {
  id: string
  long_url: string
  short_code: string
  custom_alias: string | null
  created_at: string
  click_count: number
  analytics_token: string | null
}

export type ClickRecord = {
  id: string
  created_at: string
  referrer: string | null
  user_agent: string | null
}

export async function findUrlByShortCode(shortCode: string) {
  const rows = await sql<UrlRecord[]>`
    SELECT id, long_url, short_code, custom_alias, created_at,
      click_count, analytics_token
    FROM urls
    WHERE short_code = ${shortCode}
    LIMIT 1
  `

  return rows[0] ?? null
}

export async function findUrlByAnalyticsToken(analyticsToken: string) {
  const rows = await sql<UrlRecord[]>`
    SELECT id, long_url, short_code, custom_alias, created_at,
      click_count, analytics_token
    FROM urls
    WHERE analytics_token = ${analyticsToken}
    LIMIT 1
  `

  return rows[0] ?? null
}

export async function findShortCode(shortCode: string) {
  const rows = await sql<{ short_code: string }[]>`
    SELECT short_code
    FROM urls
    WHERE short_code = ${shortCode}
    LIMIT 1
  `

  return rows[0] ?? null
}

export async function insertUrl(input: {
  longUrl: string
  shortCode: string
  customAlias: string | null
  analyticsToken: string | null
}) {
  const rows = await sql<UrlRecord[]>`
    INSERT INTO urls (long_url, short_code, custom_alias, click_count, analytics_token)
    VALUES (
      ${input.longUrl},
      ${input.shortCode},
      ${input.customAlias},
      0,
      ${input.analyticsToken}
    )
    RETURNING id, long_url, short_code, custom_alias, created_at,
      click_count, analytics_token
  `

  return rows[0]
}

export async function recordClick(input: {
  shortCode: string
  referrer: string | null
  userAgent: string | null
  ip: string | null
}) {
  await sql.begin(async (transaction) => {
    await transaction`
      INSERT INTO clicks (short_code, referrer, user_agent, ip)
      VALUES (
        ${input.shortCode},
        ${input.referrer},
        ${input.userAgent},
        ${input.ip}
      )
    `

    await transaction`
      UPDATE urls
      SET click_count = click_count + 1
      WHERE short_code = ${input.shortCode}
    `
  })
}

export async function findRecentClicks(shortCode: string) {
  return sql<ClickRecord[]>`
    SELECT id, created_at, referrer, user_agent
    FROM clicks
    WHERE short_code = ${shortCode}
    ORDER BY created_at DESC
    LIMIT 100
  `
}
