import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {ApiService} from "../../apiService";

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {
  postId: any;
  post: any;
  recommendedPosts: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.postId = params['id'];
    });
    if(this.postId){
      this.getPostById(this.postId);
    }
  }

  getPostById(id: any){
    // this.apiService.getPostById(id).subscribe((res: any)=>{
    //   this.post = res;
    //   console.log("this.post",this.post);
    // });
    this.apiService.getPostById(id).subscribe({
      next: (res: any)=>{
        this.post = res;
        console.log("this.post",this.post);
      }, complete: () =>{
        this.getRecommendedPosts(id);
      }
    })
  }

  redirectTo(id: any){
    this.router.navigate(['/view-post',id]);
  }

  getRecommendedPosts(id: any){
    this.apiService.getRecommendedPosts(id).subscribe({
      next: (res: any)=>{
        this.recommendedPosts = res;
        console.log("this.recommendedPosts",this.recommendedPosts);
      }
    })
  }

  onBack(){
    this.location.back();
  }

}
