import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  generateClientReport(clients: any[]): void {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.text('ClientFlow CRM - Rapport Clients', 14, 20);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
    
    // Statistiques
    doc.setFontSize(12);
    doc.text('Résumé Statistiques', 14, 45);
    doc.setFontSize(10);
    
    const totalRevenue = clients.reduce((sum, c) => sum + (c.revenue || 0), 0);
    const avgRevenue = totalRevenue / (clients.length || 1);
    const clientCount = clients.filter(c => c.status === 'client').length;
    
    doc.text(`Total clients : ${clients.length}`, 14, 55);
    doc.text(`Clients actifs : ${clientCount}`, 14, 65);
    doc.text(`Revenu total : ${totalRevenue.toLocaleString('fr-FR')} €`, 14, 75);
    doc.text(`Revenu moyen : ${avgRevenue.toLocaleString('fr-FR')} €`, 14, 85);
    
    // Tableau
    const headers = ['Nom', 'Email', 'Téléphone', 'Revenu', 'Statut'];
    const rows = clients.map(c => [
      c.name || '-',
      c.email || '-',
      c.phone || '-',
      `${c.revenue || 0} €`,
      c.status || '-'
    ]);
    
 
    
    
    // Télécharger
    const date = new Date().toISOString().split('T');
    doc.save(`rapport_clients_${date}.pdf`);
  }
}
