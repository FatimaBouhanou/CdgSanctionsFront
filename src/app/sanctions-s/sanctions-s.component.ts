// src/app/securities/securities.component.ts
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { SanctionS } from '../models/sanction-s.model';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-securities',
  templateUrl: './sanctions-s.component.html',
  styleUrls: ['./sanctions-s.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SecuritiesComponent implements OnInit {
  searchTerm: string = '';
  selectedEntityType: string = '';
  fullSecurities: SanctionS[] = [];
  securities: SanctionS[] = [];
  uniqueEntityTypes: string[] = [];
  paginatedSecurities: SanctionS[] = [];

  loading: boolean = false;
  message: string = '';

  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  selectedEntity: SanctionS | null = null;

  constructor(private securityService: ApiService) {}

  ngOnInit(): void {
    this.searchSecurities();
  }

  onSearchTermChange(): void {
    this.page = 1;
    this.searchSecurities();
  }

  onEntityTypeChange(): void {
    this.page = 1;
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
      this.searchSecurities();
    }
  }

  searchSecurities(): void {
    this.loading = true;
    this.message = '';

    const trimmed = this.searchTerm.trim();

    const apiCall = trimmed
      ? this.securityService.searchSecurities(trimmed, this.page - 1, this.pageSize)
      : this.securityService.getAllSecurities(); 

    apiCall.pipe(finalize(() => (this.loading = false))).subscribe({
      next: (data: any) => {
        if (trimmed) {
          // SEARCH MODE (backend paginated)
          this.fullSecurities = data?.content ?? [];
          this.securities = this.fullSecurities;
          this.totalPages = data?.totalPages ?? 1;
        } else {
          // NORMAL MODE (client paginated)
          this.fullSecurities = data;
          this.applyFilters(); // filters & pagination
          return;
        }

        this.selectedEntityType = '';
        this.extractEntityTypes();
        this.updatePaginatedSecurities();
      },
      error: (err) => {
        console.error('API error:', err);
        this.message = 'Error fetching securities.';
        this.fullSecurities = [];
        this.totalPages = 1;
        this.extractEntityTypes();
        this.updatePaginatedSecurities();
      }
    });
  }

  private extractEntityTypes(): void {
  if (!this.fullSecurities.length) return;

  console.log('Example security:', this.fullSecurities[0]);
  const types = this.fullSecurities.map(s => s.type); 
  this.uniqueEntityTypes = [...new Set(types)].filter(Boolean);
}


  trackByType(index: number, item: string): string {
    return item;
  }

  private applyFilters(): void {
    this.securities = this.selectedEntityType
      ? this.fullSecurities.filter(s => s.lei === this.selectedEntityType)
      : this.fullSecurities;

    console.log('Filtered securities:', this.securities);

    this.totalPages = Math.ceil(this.securities.length / this.pageSize);

    if (this.totalPages === 0) {
      this.totalPages = 1;
    }

    if (this.page > this.totalPages) {
      this.page = 1;
    }

    this.updatePaginatedSecurities();
  }

  updatePaginatedSecurities(): void {
    if (this.searchTerm.trim()) {
      this.paginatedSecurities = this.securities; // already paginated from backend
    } else {
      const startIndex = (this.page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedSecurities = this.securities.slice(startIndex, endIndex);
    }

    console.log(`Page ${this.page}: Showing securities`, this.paginatedSecurities);
  }

  openDetailsModal(security: SanctionS): void {
    this.selectedEntity = security;
  }

  closeModal(): void {
    this.selectedEntity = null;
  }
}
