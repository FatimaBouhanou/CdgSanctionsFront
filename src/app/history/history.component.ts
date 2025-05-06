import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service'; // make sure the path is correct

interface History {
  id: number;
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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getHistories();
  }

 //GET ALL CATEGORIES
 getHistories():void{
  this.apiService.getAllHistory().subscribe({
    next:(res:any) =>{
      if (res.status === 200) {
        this.histories = res.categories;
      }
    },
    error:(error) =>{
      this.showMessage(error?.error?.message || error?.message || "Unable to get all categories" + error)
    }
  })
}

showMessage(message:string){
  this.message = message;
  setTimeout(() =>{
    this.message = ''
  }, 4000)
}
}
