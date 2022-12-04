import { useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { DEFAULT_SEO } from '@utils/constants';
import { DefaultSeo } from 'next-seo';
import '@styles/globals.scss'
import '@vidstack/player/hydrate.js';

function MyApp({ Component, pageProps }) {
  const [supabase] = useState(() => createBrowserSupabaseClient())
  return (
    <>
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={pageProps.initialSession}
      >
        <DefaultSeo {...DEFAULT_SEO}/>
        <Component {...pageProps} />
      </SessionContextProvider>
    </>
  )
}

export default MyApp
