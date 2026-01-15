import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  exportToCSV(data: any[], filename: string): void {
    const headers = ['Nom', 'Email', 'Téléphone', 'Entreprise', 'Statut', 'Priorité', 'Revenu'];
    
    let csv = headers.join(',') + '\n';
    data.forEach(row => {
      const values = [
        row.name,
        row.email,
        row.phone,
        row.company,
        row.status,
        row.priority,
        row.revenue
      ];
      const escapedValues = values.map(v => {
        const str = String(v || '');
        return str.includes(',') ? `"${str}"` : str;
      });
      csv += escapedValues.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    this.downloadFile(blob, filename);
  }

  exportToJSON(data: any[], filename: string): void {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    this.downloadFile(blob, filename);
  }

  private downloadFile(blob: Blob, filename: string): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
