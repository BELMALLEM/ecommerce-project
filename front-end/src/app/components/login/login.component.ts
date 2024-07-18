import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isCollapsed: boolean = true;
  isAuthenticated: boolean = false;
  user: User | null | undefined;

  storage: Storage = sessionStorage;

  constructor(public auth: AuthService,
    @Inject(DOCUMENT) private doc: Document) { }

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe(data => this.isAuthenticated = data);
    this.auth.user$.subscribe(data => {
      this.user = data;
      if(this.isAuthenticated) this.setUserEmailToStorage();
    });
  }
  
  login() {
    this.auth.loginWithRedirect();

    this.setUserEmailToStorage();
  }

  logout() {
    this.auth.logout({logoutParams: {returnTo: this.doc.location.origin}});
    this.storage.clear();
  }

  setUserEmailToStorage(){
    this.storage.setItem('userEmail', JSON.stringify(this.user.email));
  }

}
