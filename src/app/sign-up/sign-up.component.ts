import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ApiService} from "../../apiService";
import {NgToastService} from "ng-angular-popup";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  isSubmitted: boolean = false;
  registerForm: FormGroup = new FormGroup<any>({});
  showOTP: boolean = false;
  oneTimePassword: any;
  constructor(private httpClient: HttpClient,
              private formBuilder: FormBuilder,
              private router: Router,
              private spinner: NgxSpinnerService,
              private apiService: ApiService,
              private toastService: NgToastService,
              private ngxToast: ToastrService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.registerForm = this.formBuilder.group({
      // name: [undefined, Validators.required],
      firstName: [undefined, Validators.required],
      lastName: [undefined, Validators.required],
      email: [undefined, [Validators.required, Validators.email]],
      password: [undefined, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [undefined, [Validators.required, Validators.minLength(8)]],
      address: [undefined, Validators.required],
      otp: [undefined]
    });
  }

  submit() {
    if(!this.showOTP){
      this.isSubmitted = true;
      if (this.registerForm.invalid) {
        return
      } else {
        this.spinner.show();
        const userDetails =
          {
            // name: this?.registerForm?.get('name')?.value,
            firstName: this?.registerForm?.get('firstName')?.value,
            lastName: this?.registerForm?.get('lastName')?.value,
            email: this?.registerForm?.get('email')?.value,
            password: this?.registerForm?.get('password')?.value,
            address: this?.registerForm?.get('address')?.value
          }
        this.apiService.register(userDetails).subscribe( res => {
          this.spinner.hide();
          this.showOTP = true;
          this.oneTimePassword = res;
          if(this.showOTP){
            this.registerForm.get('otp')?.setValidators(Validators.required);
          }
          console.log("res",res);
          // this.toastService.success({detail: 'Success', summary: 'User Registration Successful', duration: 2000});
          // this.ngxToast.info("User has to be approved by admin to log into the system.", "info");
          // this.router.navigate(['']);
        },  error => {
          console.log(error);
          this.toastService.error({detail: 'Error', summary: 'User Registration failed', duration: 2000});
        })
      }
    }
    else{
      if(this.registerForm.get('otp')?.value != this.oneTimePassword) {
        return
      }
      this.toastService.success({detail: 'Success', summary: 'User Registration Successful', duration: 2000});
      // this.ngxToast.info("User has to be approved by admin to log into the system.", "info");
      this.router.navigate(['']);
    }
  }

}
