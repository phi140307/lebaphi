'use client';

import { useEffect } from 'react';

export default function ChatwootLoader() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as any).chatwootSDK) return;

    const BASE_URL = 'https://app.swich.one';
    const script = document.createElement('script');
    script.src = `${BASE_URL}/packs/js/sdk.js`;
    script.async = true;
    script.onload = () => {
      try {
        (window as any).chatwootSDK?.run?.({
          websiteToken: 'apNL6oKrkERgKknDoQQkFSmf',
          baseUrl: BASE_URL,
        });
      } catch (err) {
        console.error('Chatwoot init error', err);
      }
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
