import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface Slide {
  id: number;
  title: string;
  image: string;
}

@Injectable()
export class SliderService {
  private readonly filePath = path.join(__dirname, '../../src/data/homeSlider.json');

  getAll(): Slide[] {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  saveAll(slides: Slide[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(slides, null, 2));
  }

  add(slide: Partial<Slide>) {
    const slides = this.getAll();
    const newSlide: Slide = {
      id: slides.length ? Math.max(...slides.map(s => s.id)) + 1 : 1,
      title: slide.title || 'Новий слайд',
      image: slide.image || '',
    };
    slides.push(newSlide);
    this.saveAll(slides);
    return newSlide;
  }

  update(id: number, data: Partial<Slide>) {
    const slides = this.getAll();
    const index = slides.findIndex(s => s.id === id);
    if (index === -1) return null;
    slides[index] = { ...slides[index], ...data };
    this.saveAll(slides);
    return slides[index];
  }

  remove(id: number) {
    let slides = this.getAll();
    slides = slides.filter(s => s.id !== id);
    this.saveAll(slides);
    return true;
  }
}