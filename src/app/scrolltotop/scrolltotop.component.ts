import { Component, HostListener, Inject } from '@angular/core';

@Component({
  selector: 'app-scrolltotop',
  templateUrl: './scrolltotop.component.html',
  styleUrls: ['./scrolltotop.component.css']
})
export class ScrolltotopComponent {
  showScrollButton = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollButton = scrollHeight > 250;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
