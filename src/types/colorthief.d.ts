declare module 'colorthief' {
  export default class ColorThief {
    getColor(
      img: HTMLImageElement | string,
      quality?: number
    ): [number, number, number] | Promise<[number, number, number]>;

    getPalette(
      img: HTMLImageElement | string,
      colorCount?: number,
      quality?: number
    ): [number, number, number][] | Promise<[number, number, number][]>;
  }
}
