import { Injectable } from '@angular/core';

@Injectable()
export class PhotoService {
  getData() {
    return [
      {
        itemImageSrc: '../assets/images/renewable 1.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1s.jpg',
        alt: 'Description for Image 1',
        title: 'Title 1'
      },
      {
        itemImageSrc: '../assets/images/renewable 2.jpeg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2s.jpg',
        alt: 'Description for Image 2',
        title: 'Title 2'
      },
      {
        itemImageSrc: '../assets/images/renewable 2.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria3s.jpg',
        alt: 'Description for Image 3',
        title: 'Title 3'
      },
      {
        itemImageSrc: '../assets/images/renewable 3.jpeg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria4s.jpg',
        alt: 'Description for Image 4',
        title: 'Title 4'
      },
      {
        itemImageSrc: '../assets/images/renewable 3.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria5s.jpg',
        alt: 'Description for Image 5',
        title: 'Title 5'
      }
    ];
  }

  getImages() {
    return Promise.resolve(this.getData());
  }
};
