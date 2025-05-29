import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from './service/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CdgSanctionsFront';
  isSidebarClosed = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  toggleSidebar() {
  this.isSidebarClosed = !this.isSidebarClosed;

  // Optional: force resize to help table reflow
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
    this.cdr.detectChanges();
  }, 300); // match transition duration
}
showRechercheSubmenu = false;

toggleRechercheSubmenu() {
  this.showRechercheSubmenu = !this.showRechercheSubmenu;
}

}
