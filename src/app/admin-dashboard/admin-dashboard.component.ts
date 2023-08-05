import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../apiService";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  articles: any;
  p: number = 1;
  totalGroupsCount: number = 0;
  totalUsersCount: number = 0;
  pendingUsersCount: number = 0;
  totalPostsCount: number = 0;
  totalPosts: any;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getArticles();
    this.getGroupsCount();
    this.getTotalPostsCount();
  }

  getArticles() {
    // this.apiService.getAllArticles().subscribe( res => {
    //   this.articles = res;
    //   console.log(res);
    // }, error => {
    //   console.log(error);
    // });
  }

  getGroupsCount() {
    this.getTotalUsersCount();
    this.apiService.getAllSubGroups().subscribe((res: any) => {
      this.totalGroupsCount = res.length;
    }, error => {
      console.log(error);
    });
  }

  getTotalPostsCount(){
    this.apiService.getTotalPosts().subscribe((res: any)=>{
      console.log("posts",res?.content);
      this.totalPosts = res?.content;
    }, error => {
      console.log(error);
    })
  }

  getTotalUsersCount() {
    this.apiService.getAllUsers().subscribe((res: any) => {
      this.totalUsersCount = res.length;
    }, error => {
      console.log(error);
    });
  }

  // getPendingUsersCount() {
  //   this.apiService.getApprovalPendingUsers().subscribe((res: any) => {
  //     this.pendingUsersCount = res.length;
  //   }, error => {
  //     console.log(error);
  //   });
  // }
}
