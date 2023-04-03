import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  getUserId(): number | null {
    const userIdStr =  localStorage.getItem('id');
    return userIdStr ? parseInt(userIdStr) : null;
  }

  saveUserId(id: number): void {
    localStorage.setItem('id', id.toString());
  }
}
