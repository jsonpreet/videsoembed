import { useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { DEFAULT_SEO } from '@utils/constants';
import { DefaultSeo } from 'next-seo';
import '@styles/globals.scss'
import '@vidstack/player/hydrate.js';
import { LivepeerConfig } from '@livepeer/react';
import { livepeerClient, playerTheme } from '@utils/getLivePeer';

function MyApp({ Component, pageProps }) {
  const [supabase] = useState(() => createBrowserSupabaseClient())
  return (
    <>
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={pageProps.initialSession}
      >
        <DefaultSeo {...DEFAULT_SEO}/>
        <LivepeerConfig client={livepeerClient()} theme={playerTheme}>
          <Component {...pageProps} />
        </LivepeerConfig>
      </SessionContextProvider>
    </>
  )
}

export default MyApp
