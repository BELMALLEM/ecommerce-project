import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { SessionRoutingModule } from './session-routing.module';
import { LoginComponent } from './components/login/login.component';



@NgModule({
  declarations: [
    LoginComponent,
    MembersPageComponent,
    OrderHistoryComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true}
  ],
  imports: [
    CommonModule,
    SessionRoutingModule,
    AuthModule.forRoot({
      domain: environment.oidc.domain,
      clientId: environment.oidc.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: environment.oidc.audience
      },
      // The AuthHttpInterceptor configuration
      httpInterceptor: {
        allowedList: [
          // Attach access tokens to any calls that start with '/api/'
          '/api/*'
        ],
      },
    }),
  ],
  exports: [
    LoginComponent
  ]
})
export class SessionModule { }
