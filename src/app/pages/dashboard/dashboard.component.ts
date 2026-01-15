import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientStats } from '../../models/ClientStats';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  stats: ClientStats | null = null;
  currentUser: any = null;
  private destroy = new Subject<void>();

  constructor(
    private clientService: ClientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer l'utilisateur courant
    this.authService.user$
      .pipe(takeUntil(this.destroy))
      .subscribe(user => {
        this.currentUser = user;
      });

    // Récupérer les statistiques
    this.clientService.stats$
      .pipe(takeUntil(this.destroy))
      .subscribe(stats => {
        this.stats = stats;
        console.log('Statistiques mises à jour:', stats);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
