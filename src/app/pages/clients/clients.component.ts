import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientCardComponent } from '../../components/client-card/client-card.component';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportButtonComponent } from "../../components/export-button/export-button.component";
import { ReportGeneratorComponent } from "../../components/report-generator/report-generator.component";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ExportButtonComponent, ReportGeneratorComponent]
})
export class ClientsComponent implements OnInit, OnDestroy {
 
  clients: Client[] = [];
  filteredClients: Client[] = [];
  paginatedClients: Client[] = [];  // ← NOUVEAU
  searchTerm: string = '';
  selectedStatus: string = 'all';
  
  // ===== PROPRIÉTÉS DE PAGINATION =====
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 5;
    // ===== PROPRIÉTÉS DE FILTRAGE AVANCÉ =====
  minRevenue: number | null = null;
  maxRevenue: number | null = null;
  selectedPriority: string = 'all';
  filteredCount: number = 0;
  hasActiveFilters: boolean = false;
  filteredStats: any = {
    total: 0,
    revenue: 0,
    highPriority: 0,
    clients: 0,
    prospects: 0
  };


  private destroy = new Subject<void>();

  constructor(private clientService: ClientService, private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    // S'abonner aux clients complets (pour search/filter)
    this.clientService.clients$
      .pipe(takeUntil(this.destroy))
      .subscribe((clients) => {
        this.clients = clients;
        this.filteredClients = clients;
      });

    // S'abonner aux clients paginés (pour affichage)
    this.clientService.paginatedClients$
      .pipe(takeUntil(this.destroy))
      .subscribe((clients) => {
        this.paginatedClients = clients;
      });

    // S'abonner au numéro de page courant
    this.clientService.currentPage$
      .pipe(takeUntil(this.destroy))
      .subscribe((page) => {
        this.currentPage = page;
      });

    // S'abonner au nombre total de pages
    this.clientService.totalPages$
      .pipe(takeUntil(this.destroy))
      .subscribe((pages) => {
        this.totalPages = pages;
      });
  }

  search($event: Event) {
    if (!this.searchTerm.trim()) {
      this.filteredClients = this.clients;
      return;
    }

    this.clientService
      .searchClients(this.searchTerm)
      .subscribe((results) => {
        this.filteredClients = results;
      });
  }


filter(): void {
  const criteria = {
    searchTerm: this.searchTerm,
    status: this.selectedStatus !== 'all' ? this.selectedStatus : undefined,
    priority: this.selectedPriority !== 'all' ? this.selectedPriority : undefined,
    minRevenue: this.minRevenue ?? undefined,
    maxRevenue: this.maxRevenue ?? undefined
  };

  this.clientService.filterClients(criteria).subscribe((results) => {
    this.filteredClients = results;
    this.filteredCount = results.length;
    this.filteredStats = this.clientService.getFilteredStats(results);
    this.updateActiveFiltersStatus();
    
    // ⭐ LA CLÉ: Vérifier s'il y a des résultats
    if (this.filteredCount === 0) {
      this.paginatedClients = [];  // ← VIDER LE TABLEAU
      this.currentPage = 0;
      this.totalPages = 0;
      console.log('❌ Aucun résultat');
    } else {
      this.currentPage = 1;
      this.totalPages = Math.ceil(this.filteredCount / this.pageSize);
      this.displayFilteredPage(1);
      console.log(`✅ ${this.filteredCount} résultats`);
    }
  });
}


  /**
   * Met à jour la pagination des résultats filtrés
   */
  private updateFilteredPagination(): void {
    const totalPages = Math.ceil(this.filteredCount / this.pageSize);
    this.totalPages = totalPages;
    this.displayFilteredPage(1);
  }

  /**
   * Affiche une page des résultats filtrés
   */
  private displayFilteredPage(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages) {
      console.warn(`Page ${pageNumber} invalide`);
      return;
    }

    const startIndex = (pageNumber - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedClients = this.filteredClients.slice(startIndex, endIndex);
    this.currentPage = pageNumber;
    console.log(`Affichage page filtrée ${pageNumber}/${this.totalPages} (${this.paginatedClients.length} clients)`);
  }

  /**
   * Vérifie si des filtres sont actifs
   */
  private updateActiveFiltersStatus(): void {
    this.hasActiveFilters =
      !!this.searchTerm ||
      this.selectedStatus !== 'all' ||
      this.selectedPriority !== 'all' ||
      this.minRevenue !== null ||
      this.maxRevenue !== null;
  }

  /**
   * Efface tous les filtres
   */
  // clearAllFilters(): void {
  //   this.searchTerm = '';
  //   this.selectedStatus = 'all';
  //   this.selectedPriority = 'all';
  //   this.minRevenue = null;
  //   this.maxRevenue = null;
  //   this.filteredClients = this.clients;
  //   this.filteredCount = this.clients.length;
  //   this.hasActiveFilters = false;
    
  //   this.currentPage = 1;
  //   this.totalPages = Math.ceil(this.clients.length / this.pageSize);
  //   this.paginatedClients = this.clients.slice(0, this.pageSize);
    
  //   this.clientService.clearAllFilters();
  //   console.log('Tous les filtres ont été réinitialisés');
  // }
  /**
   * Efface tous les filtres et réinitialise la pagination
   */
  clearAllFilters(): void {
    // Réinitialiser tous les filtres
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.selectedPriority = 'all';
    this.minRevenue = null;
    this.maxRevenue = null;
    
    // Réinitialiser les flags
    this.filteredClients = [...this.clients];
    this.filteredCount = this.clients.length;
    this.hasActiveFilters = false;
    this.filteredStats = {
      total: 0,
      revenue: 0,
      highPriority: 0,
      clients: 0,
      prospects: 0
    };
    
    // Réinitialiser la pagination
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.clients.length / this.pageSize);
    this.paginatedClients = this.clients.slice(0, this.pageSize);
    
    this.clientService.clearAllFilters();
    console.log('✅ Tous les filtres réinitialisés');
    console.log(`Affichage: Page 1/${this.totalPages} (${this.paginatedClients.length} clients)`);
  }

  /**
   * Applique le filtre automatiquement
   */
  onFilterChange(): void {
    this.filter();
  }
    /**
   * Va à la page suivante des résultats filtrés
   */
  goNextFilteredPage(): void {
    if (this.currentPage < this.totalPages) {
      this.displayFilteredPage(this.currentPage + 1);
    }
  }

  /**
   * Va à la page précédente des résultats filtrés
   */
  goPreviousFilteredPage(): void {
    if (this.currentPage > 1) {
      this.displayFilteredPage(this.currentPage - 1);
    }
  }

  /**
   * Saute à une page spécifique des résultats filtrés
   */
  goToFilteredPage(pageNumber: number): void {
    this.displayFilteredPage(pageNumber);
  }



  onClientDeleted($event: number) {
    throw new Error('Method not implemented.');
  }

  onClientEdited($event: Client) {
    this.router.navigate(['/clients/'+$event.id+'/edit']);
  }

  onClientSelected($event: Client) {
    this.router.navigate(['/clients/'+$event.id]);
  }

  deleteClient(id: number): void {
    this.clientService.deleteClient(id);
  }

  // ===== MÉTHODES DE PAGINATION =====

  /**
   * Va à la page suivante
   */
  goNextPage(): void {
    this.clientService.nextPage();
  }

  /**
   * Va à la page précédente
   */
  goPreviousPage(): void {
    this.clientService.previousPage();
  }

  /**
   * Saute à une page spécifique
   * @param pageNumber Le numéro de page
   */
  goToPage(pageNumber: number): void {
    this.clientService.goToPage(pageNumber);
  }

  /**
   * Retourne un tableau avec les numéros de pages [1, 2, 3, ...]
   * Utile pour générer les boutons de pagination
   */
  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
    /**
   * Retourne les numéros de pages basés sur les résultats (filtrés ou non)
   */
  getFilteredPageNumbers(): number[] {
    const pages = this.hasActiveFilters ? this.totalPages : this.totalPages;
    return Array.from({ length: pages }, (_, i) => i + 1);
  }

  /**
   * Obtient le nombre de pages correct (filtré ou non)
   */
  getTotalPages(): number {
    if (this.hasActiveFilters) {
      return Math.ceil(this.filteredCount / this.pageSize);
    }
    return Math.ceil(this.clients.length / this.pageSize);
  }

  /**
   * Obtient le nombre d'éléments affichés
   */
  getDisplayCount(): number {
    if (this.hasActiveFilters) {
      return this.paginatedClients.length;
    }
    return this.paginatedClients.length;
  }


  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
