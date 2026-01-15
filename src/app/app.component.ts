
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ClientService } from './services/client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AppComponent implements OnInit {
  currentUser: any;
  title = 'semaine2 ClientFlow CRM';
  
  constructor(private authService: AuthService, private clientService: ClientService, private router: Router,) {}
  
  ngOnInit() {
    console.log('AppComponent initialisé');
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });

    //  this.clientService.getClients().subscribe(clients => {
    //   console.log('Clients:', clients); // Doit afficher 4 clients
    // });
  //    this.clientService.addClient({
  //   name: 'Nouveau Client',
  //   email: 'nouveau@test.com',
  //   phone: '33 4 12 34 56 78',
  //   revenue: 50000,
  //   status: 'prospect',
  //   priority: 'moyenne',
  //   company: 'Nouveau',
  //   notes: 'Test',
  //   lastInteraction: new Date()
  // });
  // // Test 3 : Statistiques
  // this.clientService.stats$.subscribe(stats => {
  //   console.log('Stats:', stats); // Doit afficher totalClients: 5
  // });
  
  // // Test 4 : Rechercher
  // this.clientService.searchClients('Acme').subscribe(results => {
  //   console.log('Résultats recherche:', results);
  // });

  // this.authService.login('test@example.com', 'password');
  // this.authService.user$.subscribe(user => {
  //   console.log('User:', user); // Doit afficher AuthUser
  // });

  // // Test 2 : Vérifier authentification
  // console.log(this.authService.isAuthenticated()); // true
  // // Test 3 : Logout
  // this.authService.logout();
  // console.log(this.authService.isAuthenticated()); // false
  }
  
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
