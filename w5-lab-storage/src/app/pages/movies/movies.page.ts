import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class MoviesPage implements OnInit {
  movieName: string = '';
  releaseYear: string = '';
  movies: { name: string; year: string }[] = [];
  errorMessage: string = '';
  isModalOpen: boolean = false;
  editingMovie: { name: string; year: string } | null = null;
  editingMovieIndex: number | null = null;
  filterType: string = 'all';

  constructor(private storageService: StorageService) {}

  async ngOnInit() {
    await this.loadMovies();
  }

  async addMovie() {
    if (this.movieName && this.releaseYear) {
      const movie = { name: this.movieName, year: this.releaseYear };
      this.movies.push(movie);
      try {
        await this.storageService.set('movies', this.movies);
        this.movieName = '';
        this.releaseYear = '';
        this.errorMessage = '';
      } catch (error) {
        console.error('Error adding movie:', error);
        this.errorMessage = 'Error adding movie. Please try again.';
      }
    } else {
      this.errorMessage = 'Movie name and release year are required.';
    }
  }

  async loadMovies() {
    try {
      const storedMovies = await this.storageService.get('movies');
      if (storedMovies) {
        this.movies = storedMovies;
      }
      this.errorMessage = '';
    } catch (error) {
      console.error('Error loading movies:', error);
      this.errorMessage = 'Error loading movies. Please try again.';
    }
  }

  async deleteMovie(index: number) {
    this.movies.splice(index, 1);
    try {
      await this.storageService.set('movies', this.movies);
      this.errorMessage = '';
    } catch (error) {
      console.error('Error deleting movie:', error);
      this.errorMessage = 'Error deleting movie. Please try again.';
    }
  }

  openEditModal(index: number) {
    this.editingMovie = { ...this.movies[index] };
    this.editingMovieIndex = index;
    this.isModalOpen = true;
  }

  async saveEditedMovie() {
    if (this.editingMovie && this.editingMovieIndex !== null) {
      if (this.editingMovie.name && this.editingMovie.year) {
        this.movies[this.editingMovieIndex] = this.editingMovie;
        try {
          await this.storageService.set('movies', this.movies);
          this.errorMessage = '';
          this.isModalOpen = false;
        } catch (error) {
          console.error('Error saving edited movie:', error);
          this.errorMessage = 'Error saving changes. Please try again.';
        }
      } else {
        this.errorMessage = 'Movie name and release year are required.';
      }
    }
  }

  filteredMovies() {
    if (this.filterType === 'recent') {
      return this.movies.filter((movie) => parseInt(movie.year) >= 2000); // Example filter for "recent" movies
    }
    return this.movies;
  }
}
