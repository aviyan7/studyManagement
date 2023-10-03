import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../apiService";
import {NgToastService} from "ng-angular-popup";
import {NgxSpinnerService} from "ngx-spinner";
import {LocalStorageUtil} from "../../localStorageUtil";

@Component({
  selector: 'app-create-subgroup',
  templateUrl: './create-subgroup.component.html',
  styleUrls: ['./create-subgroup.component.css']
})
export class CreateSubgroupComponent implements OnInit {

  subGroupForm: FormGroup = new FormGroup<any>({});
  isSubmitted: boolean = false;
  subGroup: Array<any> = new Array<any>();
  eligibleSubGroups: Array<any> = new Array<any>();
  user: any;

  constructor(private formBuilder: FormBuilder,
              private  apiService: ApiService,
              private toastr: NgToastService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.buildForm();
    this.user = LocalStorageUtil.getStorage().id;
  }

  buildForm() {
    this.subGroupForm = this.formBuilder.group({
      name: [undefined, Validators.required],
      description: [undefined, Validators.required],
      image: [undefined]
    });
  }

  submit() {
    this.isSubmitted = true;
    if (this.subGroupForm.invalid) {
      return;
    } else {
      this.spinner.show();
      const subGroup =
        {
          name: this.subGroupForm?.get('name')?.value,
          description: this.subGroupForm?.get('description')?.value,
          images: this.subGroupForm?.get('image')?.value
        }
      console.log(subGroup);
      this.apiService.createSubGroup(subGroup).subscribe(res => {
        console.log(res);
        this.spinner.hide();
        this.toastr.success({detail: 'Success', summary: 'Group Created Successfully.', duration: 2000});
        this.subGroupForm.get('name')?.patchValue(null);
        this.subGroupForm.get('description')?.patchValue(null);
        this.subGroupForm.get('image')?.patchValue(null);
        this.isSubmitted = false;
      }, error => {
        this.spinner.hide();
        console.log(error);
        this.toastr.error({detail: 'Error', summary: 'Failed to create Group', duration: 2000})
      });

    }
  }

  getImages(data: any){
    this.subGroupForm?.get('image')?.patchValue(data);
  }


}
