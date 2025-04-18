import { Component, inject, signal } from '@angular/core';
import { GifListComponent } from "../../components/gif-list/gif-list.component";
import { GifService } from '../../services/gif-service.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  imports: [GifListComponent],
  selector: 'search-trending',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export default class SearchPageComponent {

  private gifService = inject(GifService);

  gifs = signal<Gif[]>([])

  onSearch(query: string) {

    if (!query) return;

    this.gifService.searchGif(query).subscribe(
      (resp) => {
        this.gifs.set(resp);
      });
  }

}
