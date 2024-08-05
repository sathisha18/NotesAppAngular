import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserserviceService } from '../userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit  {

  notesData: any[] = [];
  searchTerm: string = '';
  @ViewChild('content')
  content!: ElementRef;
  constructor(private router : Router,private service: UserserviceService) {

   }

  ngOnInit(): void {
   this.getNotes();
  }
//Get Users method
  getNotes() {
    this.service.getNotes().subscribe(res => {
      this.notesData = res.data
      console.log("Userdata", this.notesData);
    })
  }
 // Getter to filter notes based on search term
 get filteredNotes() {
  if (!this.searchTerm.trim()) {
    return this.notesData;
  }
  return this.notesData.filter((note:any) =>
    note.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
    note.category.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}
 //Edit data 
  editnotes(data: any) {
    this.router.navigate(
      ['/notesform'],
      {
        queryParams: { data: btoa(JSON.stringify(data)) }
      }
    );
  }

  // Delete Data
  confirmDelete(id: any) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'Do you want to delete this note?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deletenotes(id);
      }
    });
  }

  deletenotes(id: any) {
    this.service.deleteNotes(id).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your note has been deleted.',
          confirmButtonText: 'OK'
        });
        this.getNotes();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
  homedir() {
    this.router.navigate(["/home"]);
  }
}

