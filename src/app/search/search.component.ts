import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../apiService";
import {NgxSpinnerService} from "ngx-spinner";
import {NgToastService} from "ng-angular-popup";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {SearchResultComponent} from "../search-result/search-result.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchKeyword: string | undefined;
  searchResults: any[] = [];
  searchItem: string = 'Search Post by Name or Group, or Author';

  constructor(private http: HttpClient,
              private apiService: ApiService,
              private spinner: NgxSpinnerService,
              private toastr: NgToastService,
              private router: Router,
              private modalService: NgbModal) { }

  search() {
    if (!this.searchKeyword) {
      return;
    }
    this.spinner.show();
    this.apiService.searchPost(this.searchKeyword).subscribe(res => {
      console.log('search',res);
      this.spinner.hide();
      this.toastr.success({detail: 'Success', summary: 'Search Completed Successfully.', duration: 2000});
      this.searchKeyword = '';
      this.router.navigate(['/search-result']);
      const option: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        animation: true,
        size: 'xxl'
      };
      const modal = this.modalService.open(SearchResultComponent, option);
      modal.componentInstance.response = res;
    }, error => {
      this.spinner.hide();
      console.log(error);
      this.toastr.error({detail: 'Error', summary: 'Failed to complete Search', duration: 2000})
    });
  }

  ngOnInit(): void {
  }

}
