'use client';

import { useEffect } from 'react';
import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import Passwordless from 'supertokens-web-js/recipe/passwordless';

let isInitialized = false;

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || 'http://localhost:8000';

export function SuperTokensProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      SuperTokens.init({
        appInfo: {
          apiDomain,
          apiBasePath: '/api/v1/auth',
          appName: 'Social Frontend',
        },
        recipeList: [Session.init(), Passwordless.init()],
      });
      isInitialized = true;
    }
  }, []);

  return <>{children}</>;
}
