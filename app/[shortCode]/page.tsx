import { findUrlByShortCode, recordClick } from '@/lib/db'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

interface Props {
  params: { shortCode: string }
}

export default async function RedirectPage({ params }: Props) {
  const { shortCode } = await params

  const url = await findUrlByShortCode(shortCode)

  if (!url) {
    notFound()
  }

  const headersList = await headers()
  const referrer = headersList.get('referer') || null
  const userAgent = headersList.get('user-agent') || null
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || null

  await recordClick({ shortCode, referrer, userAgent, ip })
  redirect(url.long_url)
}