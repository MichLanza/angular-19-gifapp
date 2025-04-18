import { Gif } from "../interfaces/gif.interface";
import { GiphyItem } from "../interfaces/giphy.interface";

export class GifMapper {

  static mapGiphyToGIf(giphyItem: GiphyItem): Gif {
    return {
      id: giphyItem.id,
      title: giphyItem.title,
      url: giphyItem.images.original.url,
    }
  }

  static mapGiphyItemsToGIfArray(items: GiphyItem[]): Gif[] {
    return items.map(this.mapGiphyToGIf);
  }

}
