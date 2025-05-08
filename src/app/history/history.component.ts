import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

interface History {
  id: number;
  fileName: string;
  importDate: string;
  fileSize: number;
  numberOfLines: number;
  fileType: string;
  title: string;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  histories: History[] = [];
  historyName: string = '';  
  message: string = '';
  isEditing: boolean = false;
  editingHistoryId: string | null = null;
  loading: boolean = true;
  selectedFileType: string = ''; 

  constructor(private apiService: ApiService) {}

  // Array to hold the original histories for filtering
  originalHistories: any[] = []; 
  uniqueFileTypes: string[] = [];  // Array to hold unique file types
  

  // Method to handle file type selection
  ngOnInit() {
    this.apiService.getAllHistory().subscribe(data => {
      this.histories = data;
      this.originalHistories = data;

      // Extract unique file types from the data
      this.uniqueFileTypes = Array.from(new Set(data.map((history: any) => history.fileType)));
      this.loading = false;
    });
  }


  //get all histories
  getHistories(): void {
    this.apiService.getAllHistory().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.histories = res.categories;
        } else {
          this.histories = res; // fallback in case backend sends array directly
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message || error?.message || 'Unable to get all import histories'
        );
      }
    });
  }
  
  //show message
  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }

  //search history
  searchHistory() {
    const term = this.historyName.toLowerCase().trim();
    const fileType = this.selectedFileType.toLowerCase().trim();

    if (!term && !fileType) {
      // If both search term and file type are empty, show all histories
      this.histories = [...this.originalHistories];
    } else {
      // Filter the histories based on both the search term and file type
      this.histories = this.originalHistories.filter(history => 
        (term ? history.fileName.toLowerCase().includes(term) : true) &&
        (fileType ? history.fileType.toLowerCase().includes(fileType) : true)
      );
    }
  }
  
  
}
