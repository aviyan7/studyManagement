import { Component, HostListener, Inject } from '@angular/core';
import {ViewportScroller} from "@angular/common";

@Component({
  selector: 'app-scrolltotop',
  templateUrl: './scrolltotop.component.html',
  styleUrls: ['./scrolltotop.component.css']
})
export class ScrolltotopComponent {
  constructor(private viewportScroller: ViewportScroller) {
  }
  // showScrollButton = false;
  //
  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   const scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  //   this.showScrollButton = scrollHeight > 250;
  // }
  //
  // scrollToTop() {
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // }

  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
