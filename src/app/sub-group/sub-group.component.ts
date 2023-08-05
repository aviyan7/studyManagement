import {Component, HostListener, OnInit} from '@angular/core';
import {ApiService} from "../../apiService";
import {NgToastService} from "ng-angular-popup";
import {LocalStorageUtil} from "../../localStorageUtil";

@Component({
  selector: 'app-sub-group',
  templateUrl: './sub-group.component.html',
  styleUrls: ['./sub-group.component.css']
})
export class SubGroupComponent implements OnInit {
  subGroups: any;
  hasPressed: boolean = false;
  isNotCollapsed: Array<boolean> = Array<boolean>();

  constructor(
    private apiService: ApiService,
    private toastr: NgToastService
  ) { }

  ngOnInit(): void {
    this.getAllSubGroups();
  }
  getAllSubGroups(){
    // this.apiService.getAllSubGroups().subscribe((res: any) => {
    //   this.subGroups = res;
    // }, error => {
    //   console.log(error);
    // });
    this.apiService.getAllSubGroups().subscribe({
      next: (response: any)=>{
        console.log("response",response);
        this.subGroups = response;
      },
      complete: () => {
        this.subGroups.forEach((f: any)=>{
          f?.users?.forEach((g: any)=>{
            if(g?.id == LocalStorageUtil.getStorage().id){
              f.canJoinGroup = false;
            }
            else if(!g?.id){
              f.canJoinGroup = false;
            }
            else {
                f.canJoinGroup = true;
            }
          })
        })
      }
    })
  }

  showScrollButton = true;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > 250;
  }

  scrollToTop() {
    (function smoothscroll() {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }
    })();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight ) {
      // this.currentPage++;
      // this.getAllPosts();
      this.getAllSubGroups();
      console.log("shhalhal");
    }
  }

  collapse(i: number, event: Event) {
    event.stopPropagation();
    if (!this.isNotCollapsed[i]) {
      this.isNotCollapsed[i] = true;
    } else {
      this.isNotCollapsed[i] = false;
    }
  }

  onJoinSubGroup(id: any){
    this.apiService.joinsubGroup(id).subscribe({
      next: (response: any)=>{
        this.toastr.success({summary: 'Success', detail: 'Group Joined Successfully', duration: 2000})
      }
    })
  }

}
