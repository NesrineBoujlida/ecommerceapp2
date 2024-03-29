import { Component, OnInit } from '@angular/core';
import myAppConfig from '../../config/my-app-config';

import { OktaAuthService } from '@okta/okta-angular';
import OktaSignIn from '@okta/okta-signin-widget';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   oktaSignin:any;

  constructor(private oktaAuthService: OktaAuthService ) {

    this.oktaSignin = new OktaSignIn( {

     logo: 'assests/images/logo.png',
     baseUrl: myAppConfig.oidc.issuer.split('/oauth2') [0],
     clientId: myAppConfig.oidc.clientId,
     redirectUri: myAppConfig.oidc.redirectUri,
     authParams: {
       pkce: true,
       issuer: myAppConfig.oidc.issuer,
       scopes: myAppConfig.oidc.scopes

     }

    });
      }



  ngOnInit(): void {
    this.oktaSignin.remove();
    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'}, // this name should be same as div tag id in login.component.html
     (Response) => {
       if (Response.status === 'SUCCESS') {
         this.oktaAuthService.signInwithRedirect();
       }
     },
     (error) => {
       throw error;
     }
      );
  }

}
