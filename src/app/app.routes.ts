import { Routes } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { SanctionsComponent } from './sanctions/sanctions.component';



export const routes: Routes = [
    { path: 'history', component: HistoryComponent },
    { path: 'dashboard', component: DashboardComponent }, // Add dashboard route
    { path: 'home', component: HomeComponent }, // Add dashboard route
    { path: 'sanctions', component: SanctionsComponent },
      


    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirect to dashboard if no route is matched
    { path: '**', redirectTo: '/dashboard' } // Catch-all for undefined routes (404 page)
];
