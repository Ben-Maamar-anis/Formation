import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { 
  GoogleSigninButtonModule,
  SocialAuthService 
} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,GoogleSigninButtonModule  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;
  isLoadingGoogle: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.subscribeToAuthState();
    this.subscribeToGoogleAuth();
  }

  private subscribeToAuthState(): void {
    this.authService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => {
        this.isSubmitting = isLoading;
        this.isLoadingGoogle = isLoading;
      });

    this.authService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        this.errorMessage = error || '';
      });
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService
      .login(email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Login réussi', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Erreur login:', error);
          this.errorMessage =
            error.error?.message || 'Email ou mot de passe incorrect';
        },
      });
  }

  onGoogleSignIn(): void {
    this.isLoadingGoogle = true;
    this.errorMessage = '';

    this.authService
      .loginWithGoogle()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Login Google réussi', response);
          this.isLoadingGoogle = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Erreur login Google:', error);
          this.isLoadingGoogle = false;
          this.errorMessage =
            error?.error?.message || 'Erreur lors de la connexion avec Google';
        },
      });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);

    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return `${fieldName} est requis`;
    }

    if (field.errors['email']) {
      return 'Format email invalide';
    }

    if (field.errors['minlength']) {
      return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    }

    return 'Erreur de validation';
  }
  private subscribeToGoogleAuth(): void {
    this.socialAuthService.authState
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          console.log('Google user:', user);
          // Envoyer au backend pour validation
          this.authService.loginWithGoogle().subscribe({
            next: () => {
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              console.error('Erreur validation Google:', error);
              this.errorMessage = 'Erreur lors de la connexion avec Google';
            }
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
