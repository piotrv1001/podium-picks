import { Directive, ElementRef, AfterViewInit, HostListener } from '@angular/core';

@Directive({
  selector: '[truncateText]'
})
export class TruncateTextDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.truncateText();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.truncateText();
  }

  private truncateText(): void {
    const element: HTMLElement = this.elementRef.nativeElement;
    const containerWidth: number = element.offsetWidth;
    const textContent: string = element.innerText.trim();
    const originalText = textContent;

    element.innerText = '';

    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.overflow = 'hidden';
    wrapper.style.whiteSpace = 'nowrap';
    wrapper.style.textOverflow = 'ellipsis';

    element.appendChild(wrapper);
    wrapper.innerText = originalText;

    let truncatedText = originalText;
    while (wrapper.scrollWidth > containerWidth) {
      truncatedText = truncatedText.slice(0, -1);
      wrapper.innerText = truncatedText + '...';
    }
  }
}
