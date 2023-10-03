import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {ApiService} from "../../apiService";
import {LocalStorageUtil} from "../../localStorageUtil";
import {NgToastService} from "ng-angular-popup";
import {NgxSpinnerService} from "ngx-spinner";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PostcommentComponent} from "../postcomment/postcomment.component";

export enum Vote {
  upvote = 'upvote',
  downvote = 'downvote'
}

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})

export class BodyComponent implements OnInit {

  articles: any;
  allPosts: Array<any> = new Array<any>();
  arr: Array<any> = new Array<any>();
  currentPage = 0;
  pageSize = 1;
  hasUpVoted: Array<boolean> = new Array<boolean>;
  hasDownVoted: Array<boolean> = new Array<boolean>;
  isAdmin: boolean = false;
  relatedArticles: any;
  loggedInUserId = LocalStorageUtil.getStorage().id;
  hasPressed: boolean = false;
  showAllComments: boolean = false;
  relatedArticleId: any;
  relatedArticleTitle!: string;
  isNotCollapsed: Array<boolean> = Array<boolean>();
  @Output() postTriggered: EventEmitter<any> = new EventEmitter<any>();

  constructor(private apiService: ApiService,
              private toastService: NgToastService,
              private spinner: NgxSpinnerService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    // this.getArticles();
    this.getAllPosts();
    this.isAdmin =  LocalStorageUtil.getStorage().is_admin ? true : false;
    console.log("this.is",this.isAdmin);
  }

  getAllPosts() {
    if(LocalStorageUtil.getStorage().is_admin){
      this.apiService.getTotalPosts().subscribe({
        next: (res: any) => {
          console.log("res",res);
          let a = Object.entries(res?.content);
          let b: Array<any> = new Array<any>();
          a?.forEach((f: any, i: any)=>{
            b.push(a[i][1]);
          })
          b?.forEach((g: any)=>this.allPosts.push(g));
        },
        error: (err: any) => {
          this.toastService.error({detail: 'Error', summary: 'Something went wrong and unable to get posts', duration: 2000});
        },
      });
    } else {
      this.apiService.getAllPosts(this.currentPage, this.pageSize).subscribe({
        next: (res: any) => {
          let a = Object.entries(res?.content);
          let b: Array<any> = new Array<any>();
          a?.forEach((f: any, i: any)=>{
            b.push(a[i][1]);
          })
          b?.forEach((g: any)=>this.allPosts.push(g));
          console.log("allpos",this.allPosts);
        },
        error: (err: any) => {
          this.toastService.error({detail: 'Error', summary: 'Something went wrong and unable to get posts', duration: 2000});
        },
      });
    }
  }

  getArticles() {
    this.apiService.getArticles().subscribe(res => {
      this.articles = res;
      console.log(this.articles);
      // @ts-ignore
      this.articles.forEach(v => {
        if (v.upvoted_by.includes(LocalStorageUtil.getStorage().id)) {
          this.hasUpVoted.push(true);
        } else {
          this.hasUpVoted.push(false);
        }
      });
      console.log('hasUpVoted:::', this.hasUpVoted);
      // @ts-ignore
      this.articles.forEach(v => {
        if (v.downvoted_by.includes(LocalStorageUtil.getStorage().id)) {
          this.hasDownVoted.push(true);
        } else {
          this.hasDownVoted.push(false);
        }
      });
      console.log('hasDownVoted:::', this.hasDownVoted);
    }, (error) => {
      console.log(error);
      this.toastService.error({detail: 'Error', summary: 'could not update vote', duration: 2000});
      })
  }

  upVote(id: number, event: Event) {
    event.stopPropagation();
    this.apiService.updateVote(id, { vote_type: Vote.upvote }).subscribe(res => {
      this.hasUpVoted = new Array<boolean>;
      this.hasDownVoted = new Array<boolean>;
      this.getArticles();
      // this.getRelatedArticles(this.relatedArticleId, this.relatedArticleTitle);
      // this.toastService.success({detail: 'Success', summary: 'voted', duration: 2000});
    }, error => {
      console.log(error);
      this.toastService.error({detail: 'Error', summary: 'could not update vote', duration: 2000});
    });
  }

  downVote(id: number, event: Event) {
    event.stopPropagation();
    this.apiService.updateVote(id, {vote_type: Vote.downvote}).subscribe( res => {
      this.hasUpVoted = new Array<boolean>;
      this.hasDownVoted = new Array<boolean>;
      this.getArticles();
      // this.getRelatedArticles(this.relatedArticleId, this.relatedArticleTitle);
      // this.toastService.success({detail: 'Success', summary: 'voted', duration: 2000});
    }, error => {
      console.log(error);
      this.toastService.error({detail: 'Error', summary: 'could not update vote', duration: 2000});
    });
  }

  getRelatedArticles(id: number, title: string) {
    this.spinner.show();
    this.apiService.getRelatedArticles(id).subscribe(res => {
      this.spinner.hide();
      this.relatedArticles = res;
      this.hasPressed = true;
      this.relatedArticles.push(title);
      this.relatedArticleId = id;
      this.relatedArticleTitle = title;
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }

  close() {
    this.hasPressed = false;
    this.relatedArticleId = null;
  }



  collapse(i: number, event: Event) {
    event.stopPropagation();
    if (!this.isNotCollapsed[i]) {
      this.isNotCollapsed[i] = true;
    } else {
      this.isNotCollapsed[i] = false;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      this.currentPage++;
      this.getAllPosts();
    }
  }

  onWriteComment(post: any){
    const modalRef = this.modalService.open(PostcommentComponent);
    modalRef.componentInstance.responseEmitter.subscribe((response: any) => {
      if (response) {
        const comment =
          {
            text: response,
            postId:  post.id
          }
        // this.postActionRequestDetailsModel.text = response;
        // this.postActionRequestDetailsModel.postId = post.id;

        // post?.comments?.push(this.postActionRequestDetailsModel);
        this.apiService.postComment(comment).subscribe({
          next: (response: any)=>{
            this.allPosts = [];
            this.getAllPosts();
            this.toastService.success({summary: 'Success', detail: 'Comment Posted Successfully', duration: 2000})
            this.postTriggered.emit(post);
            // this.getUserPost();
            this.modalService.dismissAll();
          },
          error: (error: any) => {
            this.toastService.error({detail: 'Error', summary: 'Something went wrong and unable to post the comment', duration: 2000});
          },
        })

      } else {
        this.modalService.dismissAll();
      }
    });
  }
}
