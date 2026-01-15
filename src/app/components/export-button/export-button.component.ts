import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportService } from '../../services/export.service';


@Component({
  selector: 'app-export-button',
  templateUrl: './export-button.component.html',
  styleUrls: ['./export-button.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ExportButtonComponent {
  @Input() clients: any[] = [];
  @Input() filename: string = 'clients_export';
  
  isExporting = false;
  message = '';

  constructor(private exportService: ExportService) {}

  exportCSV(): void {
    if (!this.clients?.length) {
      this.message = 'Aucun client';
      return;
    }
    try {
      const date = new Date().toISOString().split('T');
      this.exportService.exportToCSV(this.clients, `${this.filename}_${date}.csv`);
      this.message = `✅ ${this.clients.length} clients exportés`;
    } catch (error) {
      this.message = '❌ Erreur export';
    }
    setTimeout(() => this.message = '', 3000);
  }

  exportJSON(): void {
    if (!this.clients?.length) {
      this.message = 'Aucun client';
      return;
    }
    try {
      const date = new Date().toISOString().split('T');
      this.exportService.exportToJSON(this.clients, `${this.filename}_${date}.json`);
      this.message = `✅ JSON exporté`;
    } catch (error) {
      this.message = '❌ Erreur export';
    }
    setTimeout(() => this.message = '', 3000);
  }
}
