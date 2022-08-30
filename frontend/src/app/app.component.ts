import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  registerForm: FormGroup;
  loginForm: FormGroup;

  readonly registerControls = {
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    dob: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    passwordConfirmation: new FormControl(null, [Validators.required])
  };

  readonly loginControls = {
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  };

  constructor() {
    this.registerForm = new FormGroup(this.registerControls);
    this.loginForm = new FormGroup(this.loginControls);
  }

  onLoginSubmit() {
    if (this.loginForm.invalid)
      return;
  }

  onRegisterSubmit() {
    if (this.registerForm.invalid)
      return;
  }
}
