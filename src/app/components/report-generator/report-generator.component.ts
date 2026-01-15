import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-report-generator',
  templateUrl: './report-generator.component.html',
  styleUrls: ['./report-generator.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ReportGeneratorComponent {
  @Input() clients: any[] = [];
  
  message = '';
  isGenerating = false;

  constructor(private reportService: ReportService) {}

  generateReport(): void {
    if (!this.clients?.length) {
      this.message = '❌ Aucun client à exporter';
      setTimeout(() => this.message = '', 3000);
      return;
    }
    
    this.isGenerating = true;
    this.message = '⏳ Génération du rapport...';
    
    setTimeout(() => {
      try {
        console.log("pdf");
        this.reportService.generateClientReport(this.clients);
        this.message = '✅ Rapport généré et téléchargé';
      } catch (error) {
        console.error('Erreur génération rapport', error);
        this.message = '❌ Erreur lors de la génération';
      }
      this.isGenerating = false;
      setTimeout(() => this.message = '', 4000);
    }, 500);
  }
}
