import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  allPosts: any;
 showAllComments: boolean = true;
 @Input() response: any;

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.allPosts = this.response;
    console.log("response",this.response);
  }

  close(){
    this.modalService.dismissAll();
  }

}
