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
  allEntityTypes: string[] = []; // All known types
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

    apiCall.pipe(finalize(() => (this.loading = false))).subscribe({
      next: (data: any) => {
        if (trimmed) {
          this.fullSanctions = data?.content ?? [];
          this.sanctions = this.fullSanctions;
          this.totalPages = data?.totalPages ?? 1;
          this.updatePaginatedSanctions();
        } else {
          this.fullSanctions = data;
          this.extractAllEntityTypes(); // ✅ update all types from full data
          this.applyFilters();
        }
      },
      error: (err) => {
        console.error('API error:', err);
        this.message = 'Error fetching sanctions.';
        this.fullSanctions = [];
        this.totalPages = 1;
        this.extractAllEntityTypes(); // Still try to extract types if error
        this.updatePaginatedSanctions();
      }
    });
  }

  private extractAllEntityTypes(): void {
    const types = this.fullSanctions.map(s => s.type);
    this.allEntityTypes = [...new Set(types)].filter(Boolean);
  }

  trackByType(index: number, item: string): string {
    return item;
  }

  private applyFilters(): void {
    this.sanctions = this.selectedEntityType
      ? this.fullSanctions.filter(s => s.type === this.selectedEntityType)
      : this.fullSanctions;

    this.totalPages = Math.ceil(this.sanctions.length / this.pageSize);
    if (this.totalPages === 0) this.totalPages = 1;
    if (this.page > this.totalPages) this.page = 1;

    this.updatePaginatedSanctions();
  }

  updatePaginatedSanctions(): void {
    if (this.searchTerm.trim()) {
      this.paginatedSanctions = this.sanctions; // already backend paginated
    } else {
      const startIndex = (this.page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedSanctions = this.sanctions.slice(startIndex, endIndex);
    }
  }

  openDetailsModal(sanction: Sanction): void {
    this.selectedEntity = sanction;
  }

  closeModal(): void {
    this.selectedEntity = null;
  }
}
