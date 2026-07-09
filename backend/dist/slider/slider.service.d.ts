export interface Slide {
    id: number;
    title: string;
    image: string;
}
export declare class SliderService {
    private readonly filePath;
    getAll(): Slide[];
    saveAll(slides: Slide[]): void;
    add(slide: Partial<Slide>): Slide;
    update(id: number, data: Partial<Slide>): Slide | null;
    remove(id: number): boolean;
}
