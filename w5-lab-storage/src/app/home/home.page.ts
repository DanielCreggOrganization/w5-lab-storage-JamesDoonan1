// src/app/home/home.page.ts

import { StorageService } from '../services/storage.service';
import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonTextarea } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonTextarea, FormsModule, RouterLink],

})
export class HomePage {
  key: string = '';
  value: string = '';
  output: string = '';
  keys: string[] = [];
  length: number = 0;

  constructor(private storageService: StorageService) {}

  async setItem() {
    try {
      await this.storageService.set(this.key, this.value);
      this.output = `Set ${this.key}: ${this.value}`;
    } catch (error) {
      console.error('Error setting item', error);
      this.output = `Error setting item: ${error}`;
    }
  }

  async getItem() {
    try {
      const value = await this.storageService.get(this.key);
      this.output = `Get ${this.key}: ${value}`;
    } catch (error) {
      console.error('Error getting item', error);
      this.output = `Error getting item: ${error}`;
    }
  }

  async removeItem() {
    try {
      await this.storageService.remove(this.key);
      this.output = `Removed key "${this.key}"`;
    } catch (error) {
      console.error('Error removing item', error);
      this.output = `Error removing item: ${error}`;
    }
  }

  async clearStorage() {
    try {
      await this.storageService.clear();
      this.output = 'Cleared all items from storage';
    } catch (error) {
      console.error('Error clearing storage', error);
      this.output = `Error clearing storage: ${error}`;
    }
  }

  async getAllKeys() {
    try {
      this.keys = await this.storageService.keys();
      this.output = `Keys: ${this.keys.length > 0 ? this.keys.join(', ') : 'No keys found'}`;
    } catch (error) {
      console.error('Error getting keys', error);
      this.output = `Error getting keys: ${error}`;
    }
  }

  async getStorageLength() {
    try {
      this.length = await this.storageService.length();
      this.output = `Storage contains ${this.length} items.`;
    } catch (error) {
      console.error('Error getting storage length', error);
      this.output = `Error getting storage length: ${error}`;
    }
  }

  async iterateItems() {
    try {
      let result = '';
      await this.storageService.forEach((value, key, index) => {
        result += `Item ${index}: Key = ${key}, Value = ${value}\n`;
      });
      this.output = result || 'No items found in storage.';
    } catch (error) {
      console.error('Error iterating over items', error);
      this.output = `Error iterating over items: ${error}`;
    }
  }
}