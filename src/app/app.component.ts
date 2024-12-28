import { NgForOf, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

interface Task {
  description: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgIf, NgForOf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TodoList';
  taskDescription: string = '';
  tasks: Task[] = [];
  error: string = '';
  isEditing: boolean = false;
  editingIndex: number | null = null;

  ngOnInit() {
    this.loadTasks();
  }

  saveTask() {
    if (this.taskDescription.trim() === '') {
      this.error = 'Task cannot be empty';
    } else {
      this.tasks.push({ description: this.taskDescription, completed: false });
      this.saveTasksToLocalStorage();
      this.taskDescription = '';
      this.error = '';
    }
  }

  editTask(index: number) {
    if (this.tasks[index].completed) {
      this.error = 'Completed tasks cannot be edited';
      return;
    }
    this.isEditing = true;
    this.editingIndex = index;
    this.taskDescription = this.tasks[index].description;
  }

  updateTask() {
    if (this.taskDescription.trim() === '') {
      this.error = 'Task cannot be empty';
    } else if (this.editingIndex !== null) {
      this.tasks[this.editingIndex].description = this.taskDescription;
      this.saveTasksToLocalStorage();
      this.taskDescription = '';
      this.error = '';
      this.isEditing = false;
      this.editingIndex = null;
    }
  }

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
    this.saveTasksToLocalStorage();
    if (this.isEditing && this.editingIndex === index) {
      this.isEditing = false;
      this.taskDescription = '';
      this.editingIndex = null;
    }
  }
  toggleCompletion(index: number) {
    this.tasks[index].completed = true;
    this.saveTasksToLocalStorage();
    console.log(localStorage);
    
  }

  saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }
}
