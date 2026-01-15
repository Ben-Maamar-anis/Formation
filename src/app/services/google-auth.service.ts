import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError, tap, delay } from 'rxjs/operators';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { AuthUser } from '../models/auth';

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
  expiresIn?: number;
}

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private apiUrl = 'http://localhost:5200/api/auth';
  
  // ✅ MODE DÉVELOPPEMENT : true = simulation locale, false = appel backend réel
  private DEV_MODE = true;

  private googleUserSubject = new BehaviorSubject<SocialUser | null>(null);
  public googleUser$ = this.googleUserSubject.asObservable();

  constructor(
    private socialAuthService: SocialAuthService,
    private httpClient: HttpClient
  ) {
    this.initializeGoogleUser();
  }

  private initializeGoogleUser(): void {
    // S'abonner aux changements d'état d'authentification
    this.socialAuthService.authState.subscribe((user) => {
      this.googleUserSubject.next(user);
      if (user) {
        localStorage.setItem('googleUser', JSON.stringify(user));
      }
    });
  }

  public validateToken(): Observable<AuthResponse> {
    const user = this.googleUserSubject.value;
    
    if (!user || !user.idToken) {
      return throwError(() => new Error('Pas de token Google disponible'));
    }

    // ✅ MODE DEV : Simulation locale
    if (this.DEV_MODE) {
      return this.mockValidateToken(user);
    }

    // Mode production : Appel backend réel
    return this.validateTokenWithBackend(user.idToken);
  }

  // ✅ NOUVELLE MÉTHODE : Simulation de validation sans backend
  private mockValidateToken(user: SocialUser): Observable<AuthResponse> {
    console.log('🔧 MODE DEV: Simulation de validation Google (pas de backend)');
    
    // Créer un faux token JWT
    const fakeAccessToken = this.generateFakeJWT(user);
    const fakeRefreshToken = this.generateFakeJWT(user, true);

    // Créer la réponse simulée
    const mockResponse: AuthResponse = {
      accessToken: fakeAccessToken,
      refreshToken: fakeRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: 'user', // Vous pouvez changer en 'admin' si besoin
        picture: user.photoUrl,
      },
      expiresIn: 3600, // 1 heure
    };

    console.log('✅ Utilisateur Google simulé:', mockResponse);

    // Retourner la réponse avec un délai de 500ms pour simuler l'API
    return of(mockResponse).pipe(delay(500));
  }

  // ✅ NOUVELLE MÉTHODE : Générer un faux JWT (pour développement)
  private generateFakeJWT(user: SocialUser, isRefresh: boolean = false): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: 'user',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (isRefresh ? 604800 : 3600), // 7 jours ou 1h
    };
    
    const encodedPayload = btoa(JSON.stringify(payload));
    const fakeSignature = btoa('fake-signature-dev-only');
    
    return `${header}.${encodedPayload}.${fakeSignature}`;
  }

  // Méthode originale pour appel backend (utilisée en production)
  private validateTokenWithBackend(idToken: string): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .post<AuthResponse>(
        `${this.apiUrl}/google/validate`,
        { idToken },
        { headers }
      )
      .pipe(
        map((response) => {
          console.log('Authentification réussie:', response);
          return response;
        }),
        catchError((error) => {
          console.error('Erreur validation token:', error);
          return throwError(() => error);
        })
      );
  }

  public signOut(): Observable<void> {
    return new Observable((observer) => {
      this.socialAuthService
        .signOut()
        .then(() => {
          console.log('Déconnexion Google réussie');
          this.googleUserSubject.next(null);
          localStorage.removeItem('googleUser');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('currentUser');
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          console.error('Erreur déconnexion Google:', error);
          observer.error(error);
        });
    });
  }

  public isGoogleAuthenticated(): boolean {
    return this.googleUserSubject.value !== null;
  }

  // ✅ NOUVELLE MÉTHODE : Obtenir l'utilisateur Google courant
  public getCurrentGoogleUser(): SocialUser | null {
    return this.googleUserSubject.value;
  }

  // ✅ MÉTHODE UTILITAIRE : Basculer le mode (optionnel)
  public setDevMode(enabled: boolean): void {
    this.DEV_MODE = enabled;
    console.log(`Mode développement ${enabled ? 'activé' : 'désactivé'}`);
  }
}
