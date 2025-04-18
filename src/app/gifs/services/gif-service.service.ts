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
  trendingGifLoading = signal(true);

  saveHistoryOnLocalStorage = effect(() => {
    localStorage.setItem('history', JSON.stringify(this.searchHistory()));
  });

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    this.http.get<GiphyResponse>(`${environment.urlBase}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        offset: 0,
        rating: 'g',
      }
    }).subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItemsToGIfArray(resp.data);
      this.trendingGif.set(gifs);
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
