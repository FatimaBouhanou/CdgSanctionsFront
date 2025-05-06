import { Routes } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [

    {path: 'history',component: HistoryComponent}
    //{ path: '**', redirectTo: 'history' }
];
