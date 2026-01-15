// models/client.ts

export interface Client {
  id: number;
  name: string;              // Nom de l'entreprise
  email: string;             // Email principal
  phone: string;             // Téléphone contact
  revenue: number;           // Chiffre d'affaires annuel
  status: 'prospect' | 'client' | 'inactive';
  priority: 'basse' | 'moyenne' | 'haute';
  company: string;           // Raison sociale
  notes: string;             // Notes internes
  lastInteraction: Date;     // Derniere interaction
}
