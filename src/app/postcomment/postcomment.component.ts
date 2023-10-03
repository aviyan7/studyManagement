import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-postcomment',
  templateUrl: './postcomment.component.html',
  styleUrls: ['./postcomment.component.css']
})
export class PostcommentComponent implements OnInit {

  commentReviewForm: UntypedFormGroup = new UntypedFormGroup({});

  submitted: boolean = false;

  @Output() responseEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.commentReviewForm = this.formBuilder.group({
      comment: [undefined, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(1500)])]
    })
  }

  get form(): { [key: string]: AbstractControl } {
    return this.commentReviewForm.controls;
  }

  onCancel() {
    this.modalService.dismissAll();
  }

  onClickPostComment() {
    this.submitted = true;
    if (this.commentReviewForm.valid) {
      this.responseEmitter.emit(this.form['comment'].value);
    }
  }

}
