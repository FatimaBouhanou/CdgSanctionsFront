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
  type: string;
}

@Component({
  selector: 'app-sanctions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sanctions.component.html',
  styleUrls: ['./sanctions.component.scss']
})
export class SanctionsComponent implements OnInit {
  sanctions: SanctionedEntity[] = [];
  originalSanctions: SanctionedEntity[] = [];
  searchTerm: string = ''; // Search term
  selectedSanction: string = '';
  uniqueSanctions: string[] = [];
  message: string = '';
  loading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  selectedFileType: string = ''; 

    uniqueFileTypes: string[] = [];  // Array to hold unique file types

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // Load all sanctions when component initializes
 
    this.searchSanctions();
   
  }

  //get all sanctions
/* getAllSanctions(): void {
  this.loading = true;
  this.apiService.getAllSanctions().subscribe({
    next: (res: any) => {
      const data = res.status === 200 ? res.categories : res;

      this.originalSanctions = data;
      this.sanctions = [...this.originalSanctions]; // show all initially

      // Populate dropdown
      this.uniqueFileTypes = Array.from(
        new Set(this.originalSanctions.map((s: any) => s.type))
      ).filter(type => type); // remove empty/null

      this.loading = false;
    },
    error: (error) => {
      this.showMessage(
        error?.error?.message || error?.message || 'Unable to get all sanction entities'
      );
      this.loading = false;
    }
  });
}*/


  //search sanctions
searchSanctions() {
  this.loading = true;
  this.apiService.getSanctionsByName(this.searchTerm).subscribe((data: SanctionedEntity[]) => {
    // Always update the original list
    this.originalSanctions = data;

    // Filter by selected file type if one is selected
    this.sanctions = data.filter((e) =>
      this.selectedFileType ? e.type === this.selectedFileType : true
    );

    // Update unique file types for dropdown
    this.uniqueFileTypes = Array.from(
      new Set(data.map((e) => e.type))
    ).filter(Boolean) as string[];

    this.loading = false;
  });
}



  //messages
  showMessage(msg: string) {
    this.message = msg;
    setTimeout(() => this.message = '', 4000);
  }

  //pagination -start
  get paginatedSanctions(): SanctionedEntity[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.sanctions.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.sanctions.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  //pagination -end


  //pop up
  selectedEntity: SanctionedEntity | null = null;

openDetailsModal(entity: SanctionedEntity) {
  this.selectedEntity = entity;
}

closeModal() {
  this.selectedEntity = null;
}

}
