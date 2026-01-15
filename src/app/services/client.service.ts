import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client } from '../models/client';
import { ClientStats } from '../models/ClientStats';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  /**
   * Récupère un client par son ID (synchrone)
   * @param clientId L'ID du client à récupérer
   * @returns Le client trouvé ou null
   */
  getClientById(clientId: number): Client | null {
    const client = this.clients.find(c => c.id === clientId);
    return client ?? null;
  }
  
  // Données initiales avec 19 CLIENTS
  private clients: Client[] = [
    {
      id: 1,
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '33 1 23 45 67 89',
      revenue: 150000,
      status: 'client',
      lastInteraction: new Date('2024-01-03'),
      priority: 'haute',
      company: 'Acme',
      notes: 'Client important pour le trimestre'
    },
    {
      id: 2,
      name: 'Tech Solutions Ltd',
      email: 'sales@techsol.com',
      phone: '33 1 98 76 54 32',
      revenue: 75000,
      status: 'prospect',
      lastInteraction: new Date('2024-01-02'),
      priority: 'moyenne',
      company: 'Tech Solutions',
      notes: 'En discussion pour contrat long terme'
    },
    {
      id: 3,
      name: 'Digital Innovations',
      email: 'hello@digitalinnovations.fr',
      phone: '33 2 45 67 89 01',
      revenue: 250000,
      status: 'client',
      lastInteraction: new Date('2024-01-05'),
      priority: 'haute',
      company: 'Digital Innovations',
      notes: 'Client premium, très actif'
    },
    {
      id: 4,
      name: 'StartUp Web Agency',
      email: 'contact@startupage.com',
      phone: '33 3 23 45 67 89',
      revenue: 35000,
      status: 'prospect',
      lastInteraction: new Date('2024-01-01'),
      priority: 'basse',
      company: 'StartUp Web Agency',
      notes: 'Premier contact effectué'
    },
    // ===== 15 NOUVEAUX CLIENTS AJOUTÉS =====
    {
      id: 5,
      name: 'Green Energy Solutions',
      email: 'contact@greenenergy.fr',
      phone: '33 4 56 78 90 12',
      revenue: 180000,
      status: 'client',
      lastInteraction: new Date('2024-01-08'),
      priority: 'haute',
      company: 'Green Energy',
      notes: 'Partenaire stratégique pour énergies renouvelables'
    },
    {
      id: 6,
      name: 'CloudBase Systems',
      email: 'sales@cloudbase.com',
      phone: '33 5 67 89 01 23',
      revenue: 320000,
      status: 'client',
      lastInteraction: new Date('2024-01-10'),
      priority: 'haute',
      company: 'CloudBase',
      notes: 'Grand client infrastructure cloud'
    },
    {
      id: 7,
      name: 'Marketing Pro',
      email: 'hello@marketingpro.fr',
      phone: '33 6 78 90 12 34',
      revenue: 95000,
      status: 'prospect',
      lastInteraction: new Date('2024-01-07'),
      priority: 'moyenne',
      company: 'Marketing Pro',
      notes: 'Projet marketing numérique en cours'
    },
    {
      id: 8,
      name: 'Logis Distribution',
      email: 'info@logisdist.com',
      phone: '33 7 89 01 23 45',
      revenue: 420000,
      status: 'client',
      lastInteraction: new Date('2024-01-12'),
      priority: 'haute',
      company: 'Logis Distribution',
      notes: 'Client très gros volume, secteur logistique'
    },
    {
      id: 9,
      name: 'FoodBrand International',
      email: 'contact@foodbrand.com',
      phone: '33 8 90 12 34 56',
      revenue: 280000,
      status: 'client',
      lastInteraction: new Date('2024-01-09'),
      priority: 'haute',
      company: 'FoodBrand',
      notes: 'Production alimentaire, export européen'
    },
    {
      id: 10,
      name: 'MediCare Plus',
      email: 'admin@medicareplus.fr',
      phone: '33 9 01 23 45 67',
      revenue: 145000,
      status: 'client',
      lastInteraction: new Date('2024-01-06'),
      priority: 'moyenne',
      company: 'MediCare Plus',
      notes: 'Secteur sanitaire, contrat annuel'
    },
    {
      id: 11,
      name: 'Digital Agency XYZ',
      email: 'contact@agencyxyz.com',
      phone: '33 2 11 22 33 44',
      revenue: 65000,
      status: 'prospect',
      lastInteraction: new Date('2024-01-04'),
      priority: 'basse',
      company: 'Agency XYZ',
      notes: 'Petit projet web à valider'
    },
    {
      id: 12,
      name: 'Finance Consulting Group',
      email: 'hello@financeconsult.fr',
      phone: '33 3 22 33 44 55',
      revenue: 189000,
      status: 'client',
      lastInteraction: new Date('2024-01-11'),
      priority: 'haute',
      company: 'Finance Consulting',
      notes: 'Conseil financier, relation de long terme'
    },
    {
      id: 13,
      name: 'EduTech Academy',
      email: 'partnerships@edutech.fr',
      phone: '33 4 33 44 55 66',
      revenue: 78000,
      status: 'prospect',
      lastInteraction: new Date('2024-01-05'),
      priority: 'moyenne',
      company: 'EduTech Academy',
      notes: 'Plateforme éducative en développement'
    },
    {
      id: 14,
      name: 'Automotive Innovations',
      email: 'contact@autoinnovate.com',
      phone: '33 5 44 55 66 77',
      revenue: 350000,
      status: 'client',
      lastInteraction: new Date('2024-01-13'),
      priority: 'haute',
      company: 'Automotive',
      notes: 'Secteur automobile, composants électroniques'
    },
    {
      id: 15,
      name: 'Real Estate Partners',
      email: 'sales@realestatepart.fr',
      phone: '33 6 55 66 77 88',
      revenue: 210000,
      status: 'client',
      lastInteraction: new Date('2024-01-10'),
      priority: 'moyenne',
      company: 'Real Estate Partners',
      notes: 'Immobilier commercial, portefeuille varié'
    },
    {
      id: 16,
      name: 'Software Factory',
      email: 'contact@softwarefactory.com',
      phone: '33 7 66 77 88 99',
      revenue: 125000,
      status: 'prospect',
      lastInteraction: new Date('2024-01-08'),
      priority: 'moyenne',
      company: 'Software Factory',
      notes: 'Développement personnalisé, sous-traitance'
    },
    {
      id: 17,
      name: 'Fashion Retail Hub',
      email: 'business@fashionhub.fr',
      phone: '33 8 77 88 99 00',
      revenue: 165000,
      status: 'client',
      lastInteraction: new Date('2024-01-12'),
      priority: 'moyenne',
      company: 'Fashion Hub',
      notes: 'E-commerce mode, expansion en cours'
    },
    {
      id: 18,
      name: 'Green Tech Innovations',
      email: 'info@greentech.com',
      phone: '33 9 88 99 00 11',
      revenue: 95000,
      status: 'prospect',
      lastInteraction: new Date('2024-01-07'),
      priority: 'basse',
      company: 'GreenTech',
      notes: 'Startup éco-responsable, phase amorçage'
    },
    {
      id: 19,
      name: 'Enterprise Solutions Corp',
      email: 'contact@enterprise-sol.com',
      phone: '33 1 00 11 22 33',
      revenue: 500000,
      status: 'client',
      lastInteraction: new Date('2024-01-14'),
      priority: 'haute',
      company: 'Enterprise Solutions',
      notes: 'Plus gros client, solution ERP globale'
    }
  ];

  private clientsSubject = new BehaviorSubject<Client[]>(this.getClientsData());
  public clients$ = this.clientsSubject.asObservable();
  
  private statsSubject = new BehaviorSubject<ClientStats>(this.calculateStats());
  public stats$ = this.statsSubject.asObservable();

  // ===== PROPRIÉTÉS DE PAGINATION =====
  private pageSize = 5;
  private currentPageSubject = new BehaviorSubject<number>(1);
  public currentPage$ = this.currentPageSubject.asObservable();

  private totalPagesSubject = new BehaviorSubject<number>(1);
  public totalPages$ = this.totalPagesSubject.asObservable();

  private paginatedClientsSubject = new BehaviorSubject<Client[]>([]);
  public paginatedClients$ = this.paginatedClientsSubject.asObservable();

  constructor() {
    this.updatePagination();
  }

  getClients(): Observable<Client[]> {
    return this.clients$;
  }

  private getClientsData(): Client[] {
    return JSON.parse(JSON.stringify(this.clients));
  }

  getClientById$(clientId: number): Observable<Client | null> {
    return this.clients$.pipe(
      map(clients => clients.find(c => c.id === clientId) ?? null)
    );
  }

  addClient(clientData: Omit<Client, 'id'>): void {
    const newId = this.clients.length > 0 
      ? Math.max(...this.clients.map(c => c.id)) + 1 
      : 1;
    
    const newClient: Client = { ...clientData, id: newId };
    this.clients.push(newClient);
    console.log(`Client ajouté: ${newClient.name} (ID: ${newId})`);
    this.emitChanges();
  }

  private emitChanges(): void {
    this.clientsSubject.next(this.getClientsData());
    this.statsSubject.next(this.calculateStats());
    this.updatePagination();
  }

  updateClient(id: number, updates: Partial<Client>): void {
    const index = this.clients.findIndex(c => c.id === id);
    
    if (index !== -1) {
      this.clients[index] = { ...this.clients[index], ...updates };
      console.log(`Client modifié: ${this.clients[index].name}`);
      this.emitChanges();
    } else {
      console.warn(`Client ID ${id} non trouvé`);
    }
  }

  deleteClient(id: number): void {
    const clientToDelete = this.clients.find(c => c.id === id);
    this.clients = this.clients.filter(c => c.id !== id);
    
    if (clientToDelete) {
      console.log(`Client supprimé: ${clientToDelete.name}`);
      this.emitChanges();
    }
  }

  // ===== MÉTHODES DE PAGINATION =====

  private updatePagination(): void {
    const totalClients = this.clients.length;
    const totalPages = Math.ceil(totalClients / this.pageSize);
    
    this.totalPagesSubject.next(totalPages);
    this.displayPage(this.currentPageSubject.value);
  }

  private displayPage(pageNumber: number): void {
    const totalPages = this.totalPagesSubject.value;
    if (pageNumber < 1 || pageNumber > totalPages) {
      console.warn(`Page ${pageNumber} invalide. Total pages: ${totalPages}`);
      return;
    }

    const startIndex = (pageNumber - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const pageClients = this.clients.slice(startIndex, endIndex);

    this.paginatedClientsSubject.next(pageClients);
    this.currentPageSubject.next(pageNumber);

    console.log(`Affichage page ${pageNumber}/${totalPages} (${pageClients.length} clients)`);
  }

  public goToPage(pageNumber: number): void {
    this.displayPage(pageNumber);
  }

  public nextPage(): void {
    const currentPage = this.currentPageSubject.value;
    const totalPages = this.totalPagesSubject.value;
    
    if (currentPage < totalPages) {
      this.goToPage(currentPage + 1);
    }
  }

  public previousPage(): void {
    const currentPage = this.currentPageSubject.value;
    
    if (currentPage > 1) {
      this.goToPage(currentPage - 1);
    }
  }

  public getPageSize(): number {
    return this.pageSize;
  }

  public setPageSize(newSize: number): void {
    if (newSize > 0) {
      this.pageSize = newSize;
      this.currentPageSubject.next(1);
      this.updatePagination();
      console.log(`Taille de page changée à ${newSize}`);
    }
  }

  searchClients(searchTerm: string): Observable<Client[]> {
    return new Observable(observer => {
      const lowerTerm = searchTerm.toLowerCase();
      const results = this.clients.filter(client =>
        client.name.toLowerCase().includes(lowerTerm) ||
        client.email.toLowerCase().includes(lowerTerm) ||
        client.company.toLowerCase().includes(lowerTerm) ||
        client.phone.includes(lowerTerm)
      );
      observer.next(results);
      observer.complete();
    });
  }

  getClientsByStatus(status: 'prospect' | 'client' | 'inactive'): Observable<Client[]> {
    return new Observable(observer => {
      const filtered = this.clients.filter(c => c.status === status);
      observer.next(filtered);
      observer.complete();
    });
  }

  private calculateStats(): ClientStats {
    const totalClients = this.clients.length;
    const activeClients = this.clients.filter(c => c.status === 'client').length;
    const prospectClients = this.clients.filter(c => c.status === 'prospect').length;
    const inactiveClients = this.clients.filter(c => c.status === 'inactive').length;
    
    const totalRevenue = this.clients
      .filter(c => c.status === 'client')
      .reduce((sum, c) => sum + c.revenue, 0);
    
    const averageRevenue = activeClients > 0 
      ? Math.round(totalRevenue / activeClients) 
      : 0;
    
    const highPriorityClients = this.clients.filter(c => c.priority === 'haute').length;
    
    return {
      totalClients,
      activeClients,
      prospectClients,
      inactiveClients,
      totalRevenue,
      averageRevenue,
      highPriorityClients
    };
  }
    /**
   * Filtre avancé avec plusieurs critères
   */
  filterClients(criteria: {
    searchTerm?: string;
    status?: string;
    priority?: string;
    minRevenue?: number;
    maxRevenue?: number;
  }): Observable<Client[]> {
    return new Observable(observer => {
      const filtered = this.clients.filter(client => {
        // Filtre recherche textuelle
        if (criteria.searchTerm) {
          const term = criteria.searchTerm.toLowerCase();
          const matchesSearch =
            client.name.toLowerCase().includes(term) ||
            client.email.toLowerCase().includes(term) ||
            client.company.toLowerCase().includes(term) ||
            client.phone.includes(term);
          if (!matchesSearch) return false;
        }

        // Filtre statut
        if (criteria.status && criteria.status !== 'all') {
          if (client.status !== criteria.status) return false;
        }

        // Filtre priorité
        if (criteria.priority && criteria.priority !== 'all') {
          if (client.priority !== criteria.priority) return false;
        }

        // Filtre revenue minimum
        if (criteria.minRevenue !== undefined) {
          if (client.revenue < criteria.minRevenue) return false;
        }

        // Filtre revenue maximum
        if (criteria.maxRevenue !== undefined) {
          if (client.revenue > criteria.maxRevenue) return false;
        }

        return true;
      });

      observer.next(filtered);
      observer.complete();
    });
  }

  /**
   * Obtient les statistiques des clients filtrés
   */
  getFilteredStats(clients: Client[]): any {
    return {
      total: clients.length,
      revenue: clients
        .filter(c => c.status === 'client')
        .reduce((sum, c) => sum + c.revenue, 0),
      highPriority: clients.filter(c => c.priority === 'haute').length,
      clients: clients.filter(c => c.status === 'client').length,
      prospects: clients.filter(c => c.status === 'prospect').length
    };
  }

  /**
   * Réinitialise les filtres
   */
  clearAllFilters(): void {
    this.currentPageSubject.next(1);
    this.updatePagination();
    console.log('Filtres réinitialisés');
  }

}
