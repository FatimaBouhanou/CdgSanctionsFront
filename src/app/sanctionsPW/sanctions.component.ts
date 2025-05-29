// src/app/sanctions/sanctions.component.ts
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Sanction } from '../models/sanctions.model';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sanctions',
  templateUrl: './sanctions.component.html',
  styleUrls: ['./sanctions.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SanctionsComponent implements OnInit {
  searchTerm: string = '';
  selectedEntityType: string = '';
  fullSanctions: Sanction[] = [];
  sanctions: Sanction[] = [];
  uniqueEntityTypes: string[] = [];
  paginatedSanctions: Sanction[] = [];

  loading: boolean = false;
  message: string = '';

  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  selectedEntity: Sanction | null = null;

  constructor(private sanctionService: ApiService) {}

  ngOnInit(): void {
    this.searchSanctions();
  }

  onSearchTermChange(): void {
    this.page = 1;
    this.searchSanctions();
  }

  onEntityTypeChange(): void {
    this.page = 1;
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
      this.searchSanctions();
    }
  }

  searchSanctions(): void {
    this.loading = true;
    this.message = '';

    const trimmed = this.searchTerm.trim();
    const apiCall = trimmed
      ? this.sanctionService.searchSanctions(trimmed, this.page - 1, this.pageSize)
      : this.sanctionService.getAllSanctions();

    apiCall
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
       next: (data: any) => {
  if (Array.isArray(data)) {
    this.fullSanctions = data;
    this.totalPages = Math.ceil(this.fullSanctions.length / this.pageSize);
  } else if (Array.isArray(data?.data)) {
    this.fullSanctions = data.data;
    this.totalPages = data.pagination?.totalPages ?? 1;
  } else {
    this.fullSanctions = [];
    this.totalPages = 0;
  }

  this.extractEntityTypes();
  this.applyFilters();
},

        error: (err) => {
          console.error('API error:', err);
          this.message = 'Error fetching sanctions.';
          this.fullSanctions = [];
          this.totalPages = 0;
          this.extractEntityTypes();
          this.applyFilters();
        }
      });
  }

 private extractEntityTypes(): void {
  console.log('Full sanctions:', this.fullSanctions);
  const types = this.fullSanctions.map(s => s.type);
  console.log('Extracted types:', types);
  this.uniqueEntityTypes = [...new Set(types)].filter(Boolean);
  console.log('Unique entity types:', this.uniqueEntityTypes);
}

trackByType(index: number, item: string): string {
  return item;
}

  private applyFilters(): void {
  this.sanctions = this.selectedEntityType
    ? this.fullSanctions.filter(s => s.type === this.selectedEntityType)
    : this.fullSanctions;

  console.log('Filtered sanctions:', this.sanctions);
  this.updatePaginatedSanctions();
}


  updatePaginatedSanctions(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedSanctions = this.sanctions.slice(startIndex, endIndex);
  }

  openDetailsModal(sanction: Sanction): void {
    this.selectedEntity = sanction;
  }

  closeModal(): void {
    this.selectedEntity = null;
  }
}
