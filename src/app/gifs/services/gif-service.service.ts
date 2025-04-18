import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { GifMapper } from '../mappers/gif.mapper';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';
import type { Gif } from '../interfaces/gif.interface';
import type { GiphyResponse } from '../interfaces/giphy.interface';



const LoadHistoryFromLocalStorage = () => {
  const history = localStorage.getItem('history');
  return history ? JSON.parse(history) : {};
};

@Injectable({
  providedIn: 'root'
})
export class GifService {

  private http = inject(HttpClient);

  searchHistory = signal<Record<string, Gif[]>>(LoadHistoryFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));
  trendingGif = signal<Gif[]>([]);
  trendingPage = signal(0);

  trendingGifGroup = computed<Gif[][]>(() => {
    const groups = [];

    for (let i = 0; i < this.trendingGif().length; i += 3) {
      groups.push(this.trendingGif().slice(i, i + 3));
    }
    return groups;
  });

  trendingGifLoading = signal(false);

  saveHistoryOnLocalStorage = effect(() => {
    localStorage.setItem('history', JSON.stringify(this.searchHistory()));
  });

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    if (this.trendingGifLoading()) return;

    this.trendingGifLoading = signal(true);


    this.http.get<GiphyResponse>(`${environment.urlBase}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        offset: this.trendingPage() * 20,
        rating: 'g',
      }
    }).subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItemsToGIfArray(resp.data);
      this.trendingGif.update(v => [...v, ...gifs]);
      this.trendingPage.update(v => v + 1);
      this.trendingGifLoading.set(false);
    });
  }

  searchGif(query: string) {
    return this.http.get<GiphyResponse>(`${environment.urlBase}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        offset: 0,
        rating: 'g',
        q: query,
      }
    }).pipe(
      map(({ data }) => data),
      map((items) => GifMapper.mapGiphyItemsToGIfArray(items)),
      tap((gifs) => {
        this.searchHistory.update((history) => ({
          ...history,
          [query.toLocaleLowerCase()]: gifs,
        }));

      })
    );
  }


  getGifsHistory(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }

}
