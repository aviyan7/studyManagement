import {FormBuilder, FormGroup} from "@angular/forms";
import {ApiService} from "../../apiService";
import {NgToastService} from "ng-angular-popup";
import {LocalStorageUtil} from "../../localStorageUtil";
import {Component, EventEmitter, Output, OnInit} from '@angular/core';
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Location} from "@angular/common";
import {UntypedFormBuilder, Validators} from "@angular/forms";
// import {ImageCompressorService} from "../../../feature_module/services/image-compressor.service";
// import {FileUploadService} from "../../../feature_module/services/file-upload.service";


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  postForm: FormGroup = new FormGroup<any>({});
  isSubmitted: boolean = false;
  subGroup: Array<any> = new Array<any>();
  eligibleSubGroups: Array<any> = new Array<any>();
  user: any;

  constructor(private formBuilder: FormBuilder,
              private  apiService: ApiService,
              private toastr: NgToastService) { }

  ngOnInit(): void {
    this.buildForm();
    this.getAllSubGroup();
    this.user = LocalStorageUtil.getStorage().id;
  }

  getAllSubGroup(){
    this.apiService.getAllSubGroups().subscribe({
      next: (response: any)=>{
        this.subGroup = response;
        console.log("rs",response);
      },
      complete: ()=>{
        this.subGroup.forEach((f: any)=>{
          f?.users?.forEach((g: any)=>{
            if(g?.id == this.user){
              this.eligibleSubGroups.push(f);
            }
          })
        })
      }
    })
  }

  buildForm() {
    this.postForm = this.formBuilder.group({
      postName: [undefined, Validators.required],
      description: [undefined, Validators.required],
      subGroup: [undefined, Validators.required]
    });
  }

  submit() {
    this.isSubmitted = true;
    if (this.postForm.invalid) {
      return;
    } else {
      const post =
        {
          postName: this.postForm?.get('postName')?.value,
          description: this.postForm?.get('description')?.value,
          subGroupId: this.postForm?.get('subGroup')?.value
        }
      console.log(post);
      this.apiService.post(post).subscribe(res => {
        console.log(res);
        this.toastr.success({detail: 'Success', summary: 'Post Created Successfully.', duration: 2000});
        this.postForm.get('postName')?.patchValue(null);
        this.postForm.get('description')?.patchValue(null);
        this.isSubmitted = false;
      }, error => {
        console.log(error);
        this.toastr.error({detail: 'Error', summary: 'Failed to create Post', duration: 2000})
      });

    }
  }

  getImages(data: any){
    // this.postRequestModel.images = data;
    // console.log("k xa",this.postRequestModel.images);
  }

}
