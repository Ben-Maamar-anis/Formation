import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ClientFormComponent implements OnInit, OnDestroy {
  
  clientForm!: FormGroup;
  isEditMode: boolean = false;
  clientId: number | null = null;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  private destroy = new Subject<void>();

  // Options
  statusOptions = ['client', 'prospect', 'inactive'];
  priorityOptions = ['haute', 'moyenne', 'basse'];
  categoryOptions = ['tech', 'service', 'produit', 'autre'];

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    
    // Vérifier si mode édition (route params)
    this.route.params
      .pipe(takeUntil(this.destroy))
      .subscribe(params => {
        const id = +params['id'];
        
        if (id && id > 0) {
          this.isEditMode = true;
          this.clientId = id;
          this.loadClientForEdit(id);
        }
      });
  }

  private initializeForm(): void {
    const today = new Date().toISOString().split('T');
    
    this.clientForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phone: ['', [
        Validators.required
      ]],
      company: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      status: ['client', [Validators.required]],
      priority: ['moyenne', [Validators.required]],
      revenue: [0, [
        Validators.required,
        Validators.min(0)
      ]],
      lastInteraction: [today, [Validators.required]],
      notes: ['']
    });
  }

  private loadClientForEdit(id: number): void {
    const client = this.clientService.getClientById(id);
    
    if (!client) {
      this.errorMessage = 'Client non trouvé';
      return;
    }

    // Pré-remplir le formulaire
    this.clientForm.patchValue({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      status: client.status,
      priority: client.priority,
      revenue: client.revenue,
      lastInteraction: client.lastInteraction,
      notes: client.notes
    });
  }

  onSubmit(): void {
    if (!this.clientForm.valid) {
      this.errorMessage = 'Veuillez corriger les erreurs du formulaire';
      console.log(this.clientForm.value)
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.clientForm.value;

    try {
      if (this.isEditMode && this.clientId) {
        // Mode édition
        const updatedClient: Client = {
          id: this.clientId,
          ...formData
        };
        this.clientService.updateClient(this.clientId, updatedClient);
        this.successMessage = `${formData.name} a été mis à jour avec succès ✅`;
      } else {
        // Mode création
        this.clientService.addClient(formData);
        this.successMessage = `${formData.name} a été ajouté avec succès ✅`;
      }

      // Redirection après 1.5s
      setTimeout(() => {
        this.router.navigate(['/clients']);
      }, 1500);
    } catch (error) {
      this.errorMessage = 'Erreur lors de la sauvegarde';
      this.isSubmitting = false;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.clientForm.get(fieldName);
    
    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return `${this.formatFieldName(fieldName)} est requis`;
    }
    if (field.errors['minlength']) {
      return `${this.formatFieldName(fieldName)} doit faire au moins ${field.errors['minlength'].requiredLength} caractères`;
    }
    if (field.errors['email']) {
      return 'Format email invalide';
    }
    if (field.errors['pattern']) {
      return `${this.formatFieldName(fieldName)} format invalide`;
    }
    if (field.errors['min']) {
      return `${this.formatFieldName(fieldName)} doit être positif`;
    }

    return 'Champ invalide';
  }

  private formatFieldName(name: string): string {
    const names: { [key: string]: string } = {
      name: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      company: 'Entreprise',
      revenue: 'Revenu',
      contractAmount: 'Montant du contrat',
      startDate: 'Date de début',
      lastInteraction: 'Dernière interaction'
    };
    return names[name] || name;
  }

  onCancel(): void {
    this.router.navigate(['/clients']);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
