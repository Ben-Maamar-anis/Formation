import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Client } from '../../models/client';

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ClientCardComponent {
  
  @Input() client!: Client;
  @Output() clientSelected = new EventEmitter<Client>();
  @Output() clientEdited = new EventEmitter<Client>();
  @Output() clientDeleted = new EventEmitter<number>();

  onSelect(): void {
    this.clientSelected.emit(this.client);
  }

  onEdit(): void {
    this.clientEdited.emit(this.client);
  }

  onDelete(): void {
    if (confirm(`Êtes-vous sûr de supprimer ${this.client.name}?`)) {
      this.clientDeleted.emit(this.client.id);
    }
  }
}
