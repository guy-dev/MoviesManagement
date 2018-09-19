import { Injectable } from '@angular/core';

@Injectable()
export class NavigationService {
  visible: boolean;

  constructor() {
  }

  public isAdmin(url : string):boolean {
    if (url.startsWith("/admin/") || url === "/admin") {
      return true;
    }
    return false;
  }
}
