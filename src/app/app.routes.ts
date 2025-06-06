import { Routes } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { SanctionsComponent } from './sanctionsPW/sanctions.component';
import { SecuritiesComponent } from './sanctions-s/sanctions-s.component';




export const routes: Routes = [
    { path: 'history', component: HistoryComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'home', component: HomeComponent },
    { path: 'sanctions', component: SanctionsComponent },
      
{
  path: 'sanctions/peps',
  component: SanctionsComponent
},
{
 path: 'sanctions/securities',
  component: SecuritiesComponent
},


    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, 
    { path: '**', redirectTo: '/dashboard' } 
];
