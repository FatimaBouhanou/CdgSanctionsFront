import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

interface SanctionedEntity {
  id: string;
  schema: string;
  name: string;
  aliases: string;
  birth_date: string;
  countries: string;
  addresses: string;
  identifiers: string;
  sanctions: string;
  phones: string;
  emails: string;
  dataset: string;
  first_seen: string;
  last_seen: string;
  last_change: string;
}

@Component({
  selector: 'app-sanctions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sanctions.component.html',
  styleUrls: ['./sanctions.component.scss']
})
export class SanctionsComponent implements OnInit {
  histories: SanctionedEntity[] = [];
  originalHistories: SanctionedEntity[] = [];
  searchTerm: string = ''; // Search term
  selectedSanction: string = '';
  uniqueSanctions: string[] = [];
  message: string = '';
  loading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // Load all sanctions when component initializes
    this.searchSanctions();
  }

  searchSanctions() {
    this.loading = true;
    this.apiService.getSanctionsByName(this.searchTerm).subscribe(data => {
      this.histories = data;
      this.originalHistories = data;
      this.uniqueSanctions = Array.from(new Set(data.map((e: any) => e.sanctions)));
      this.loading = false;
    });
  }

  showMessage(msg: string) {
    this.message = msg;
    setTimeout(() => this.message = '', 4000);
  }

  get paginatedHistories(): SanctionedEntity[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.histories.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.histories.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
