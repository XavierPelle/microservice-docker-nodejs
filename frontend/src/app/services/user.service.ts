import { Injectable, signal, computed } from '@angular/core';

interface UserInfo {
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userInfo = signal<UserInfo | null>(null);

  fullName = computed(() => {
    const user = this.userInfo();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });

  setUserInfo(info: UserInfo): void {
    this.userInfo.set(info);
    localStorage.setItem('userInfo', JSON.stringify(info));
  }

  getUserInfo() {
    return this.userInfo;
  }

  clearUserInfo(): void {
    this.userInfo.set(null);
    localStorage.removeItem('userInfo');
  }

  initUserInfo(): void {
    const storedInfo = localStorage.getItem('userInfo');
    if (storedInfo) {
      this.userInfo.set(JSON.parse(storedInfo));
    }
  }
}
