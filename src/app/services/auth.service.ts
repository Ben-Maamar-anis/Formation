import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import { map, catchError, tap, finalize, switchMap } from 'rxjs/operators';
import { AuthUser } from '../models/auth';
import { GoogleAuthService, AuthResponse } from './google-auth.service';

// ============================================
// DONNÉES MOCK POUR LE DÉVELOPPEMENT
// ============================================

// Utilisateurs mock
const MOCK_USERS: { [email: string]: AuthUser } = {
  "test@example.com": {
    id: 1,
    name: "Anis Ben Brahim",
    email: "test@example.com",
    role: "admin",
    picture: "https://ui-avatars.com/api/?name=Anis"
  },
  "user@example.com": {
    id: 2,
    name: "Utilisateur Test", 
    email: "user@example.com",
    role: "user",
    picture: "https://ui-avatars.com/api/?name=User"
  },
  "admin@example.com": {
    id: 3,
    name: "Administrateur",
    email: "admin@example.com", 
    role: "admin",
    picture: "https://ui-avatars.com/api/?name=Admin"
  }
};

// Mot de passe universel pour tous les users mock
const MOCK_PASSWORD = "password123";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // ⚠️ REMPLACER PAR L'URL DE VOTRE API BACKEND
  private apiUrl = 'http://localhost:5200/api/auth';

  private currentUser: AuthUser | null = null;
  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  public user$ = this.userSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private googleAuthService: GoogleAuthService
  ) {
    this.loadUserFromLocalStorage();
  }

   /**
   * 🎭 MOCK: Simule une authentification locale
   */
  public login(email: string, password: string): Observable<AuthResponse> {
    this.isLoadingSubject.next(true);
    this.errorSubject.next(null);

    return timer(1000).pipe(  // Simule un délai réseau de 1s
      switchMap(() => {
        // Vérifier les credentials mock
        if (password !== MOCK_PASSWORD) {
          return throwError(() => new Error('Mot de passe incorrect'));
        }

        if (!MOCK_USERS[email]) {
          return throwError(() => new Error('Utilisateur non trouvé'));
        }

        const user = MOCK_USERS[email];
        const response: AuthResponse = {
          accessToken: `mock-jwt-${user.id}-${Date.now()}`,
          refreshToken: `mock-refresh-${user.id}-${Date.now()}`,
          user: user,
          expiresIn: 900 // 15 minutes
        };

        this.handleAuthenticationSuccess(response);
        return of(response);
      }),
      catchError((error) => {
        const errorMessage = error.message || 'Erreur lors de la connexion';
        this.errorSubject.next(errorMessage);
        console.error('🎭 Mock login error:', error);
        return throwError(() => error);
      }),
      tap(() => this.isLoadingSubject.next(false))
    );
  }

  // public loginWithGoogle(): Observable<AuthResponse> {
  //   return this.googleAuthService.loginWithGoogle().pipe(
  //     tap((response) => {
  //       this.handleAuthenticationSuccess(response);
  //     }),
  //     catchError((error) => {
  //       console.error('Erreur login Google:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }

  public loginWithGoogle(): Observable<AuthResponse> {
  return this.googleAuthService.validateToken().pipe(
    tap((response) => {
      this.handleAuthenticationSuccess(response);
    }),
    catchError((error) => {
      console.error('Erreur login Google:', error);
      return throwError(() => error);
    })
  );
}

  private handleAuthenticationSuccess(response: AuthResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }

    this.currentUser = response.user;
    this.userSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);

    localStorage.setItem('currentUser', JSON.stringify(response.user));

    console.log(`Utilisateur connecté: ${response.user.email}`);
  }

  public logout(): void {
    this.isLoadingSubject.next(true);

    if (this.googleAuthService.isGoogleAuthenticated()) {
      this.googleAuthService
        .signOut()
        .pipe(
          finalize(() => {
            this.completeLogout();
          })
        )
        .subscribe();
    } else {
      this.completeLogout();
    }
  }

  private completeLogout(): void {
    this.currentUser = null;
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('googleUser');

    console.log('Utilisateur déconnecté');
    this.isLoadingSubject.next(false);
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  public getUser(): Observable<AuthUser | null> {
    return this.user$;
  }

  public register(
    email: string,
    password: string,
    name: string
  ): Observable<AuthResponse> {
    this.isLoadingSubject.next(true);
    this.errorSubject.next(null);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .post<AuthResponse>(
        `${this.apiUrl}/register`,
        { email, password, name },
        { headers }
      )
      .pipe(
        tap((response) => {
          this.handleAuthenticationSuccess(response);
        }),
        catchError((error) => {
          const errorMessage =
            error.error?.message || "Erreur lors de l'inscription";
          this.errorSubject.next(errorMessage);
          console.error('Erreur register:', error);
          return throwError(() => error);
        }),
        finalize(() => {
          this.isLoadingSubject.next(false);
        })
      );
  }

  public refreshToken(refreshToken: string): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .post<AuthResponse>(
        `${this.apiUrl}/refresh-token`,
        { refreshToken },
        { headers }
      )
      .pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken);
          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }
        }),
        catchError((error) => {
          console.error('Erreur refresh token:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  private loadUserFromLocalStorage(): void {
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        this.userSubject.next(this.currentUser);
        this.isAuthenticatedSubject.next(true);
        console.log(`Utilisateur restauré: ${this.currentUser?.email}`);
      } catch (error) {
        console.error('Erreur lecture localStorage:', error);
        this.logout();
      }
    }
  }

  public getCurrentError(): string | null {
    return this.errorSubject.value;
  }

  public clearError(): void {
    this.errorSubject.next(null);
  }
}
