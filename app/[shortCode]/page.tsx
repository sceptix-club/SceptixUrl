import { findUrlByShortCode, recordClick } from '@/lib/db'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import ClientRedirect from './client-redirect'

interface Props {
  params: { shortCode: string }
}

export default async function RedirectPage({ params }: Props) {
  const { shortCode } = await params

  try {
    const url = await findUrlByShortCode(shortCode)

    if (!url) {
      notFound()
    }

    // Get headers for click tracking
    const headersList = await headers()
    const referrer = headersList.get('referer') || null
    const userAgent = headersList.get('user-agent') || null
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || null

    await recordClick({ shortCode, referrer, userAgent, ip })

    // Try server-side redirect first
    redirect(url.long_url)
  } catch (error) {
    // If server redirect fails, try client-side redirect
    const url = await findUrlByShortCode(shortCode)
    
    if (url) {
      return <ClientRedirect url={url.long_url} />
    }
    
    notFound()
  }
}