import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';

import { routes } from './app.routes';
import { TokenInterceptor } from './services/token.interceptor';

// ⚠️ REMPLACER PAR VOTRE CLIENT ID GOOGLE
const GOOGLE_CLIENT_ID = '1084484709982-5lbit9reh6e1nmuij5vituo571pp3i6t.apps.googleusercontent.com';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(GOOGLE_CLIENT_ID, {
              scopes: 'openid profile email',
            }),
          },
        ],
        onError: (err: any) => {
          console.error('Social Login Error:', err);
        },
      } as SocialAuthServiceConfig,
    },
    importProvidersFrom(SocialLoginModule),
  ],
};
