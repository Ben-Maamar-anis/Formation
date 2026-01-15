import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ClientDetailComponent implements OnInit, OnDestroy {
  
  client: Client | null = null;
  clientId: number | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  private destroy = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    // S'abonner à route.params
    this.route.params
      .pipe(takeUntil(this.destroy))
      .subscribe(params => {
        // Extraire ID et convertir en nombre
        const id = +params['id'];
        this.clientId = id;
        this.loadClient(id);
      });

    // S'abonner à clientService.clients$ pour mises à jour temps réel
    this.clientService.clients$
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        if (this.clientId) {
          this.loadClient(this.clientId);
        }
      });
  }

  private loadClient(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Rechercher le client par ID dans le service
    const foundClient = this.clientService.getClientById(id);
    
    if (foundClient) {
      this.client = foundClient;
      this.isLoading = false;
    } else {
      this.errorMessage = 'Client non trouvé';
      this.isLoading = false;
    }
  }

  onEdit(): void {
    if (this.clientId) {
      this.router.navigate(['/clients', this.clientId, 'edit']);
    }
  }

  onDelete(): void {
    if (!this.clientId) return;

    // Confirmation avant suppression
    const confirmed = confirm(
      `Êtes-vous sûr de vouloir supprimer ${this.client?.name} ?`
    );

    if (confirmed) {
      this.clientService.deleteClient(this.clientId);
      // Redirection après 500ms pour laisser le temps à la suppression
      setTimeout(() => {
        this.router.navigate(['/clients']);
      }, 500);
    }
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
