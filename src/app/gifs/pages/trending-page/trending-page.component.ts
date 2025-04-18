import { AfterViewInit, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { GifListComponent } from "../../components/gif-list/gif-list.component";
import { GifService } from '../../services/gif-service.service';
import { ScrollStateService } from 'src/app/shared/services/scroll-state.service';


@Component({
  // imports: [GifListComponent],
  selector: 'page-trending',
  templateUrl: './trending-page.component.html',
  styleUrl: './trending-page.component.css'
})
export default class TrendingPageComponent implements AfterViewInit {


  scrollDiv = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  gifService = inject(GifService);
  scrollStateService = inject(ScrollStateService);
  // images = signal<string[]>(imageUrls);

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDiv()?.nativeElement;
    if (!scrollDiv) return;
    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
  }
  onScroll($event: Event) {
    const scrollDiv = this.scrollDiv()?.nativeElement;
    if (!scrollDiv) return;
    const scrollTop = scrollDiv.scrollTop;
    const scrollHeight = scrollDiv.scrollHeight;
    const clientHight = scrollDiv.clientHeight;
    const isAtBottom = scrollTop + clientHight + 300 >= scrollHeight;
    this.scrollStateService.trendingScrollState.set(scrollTop);
    if (isAtBottom) {
      this.gifService.loadTrendingGifs();
    }
  }
}
