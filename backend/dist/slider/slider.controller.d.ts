import { SliderService, Slide } from './slider.service';
export declare class SliderController {
    private readonly sliderService;
    constructor(sliderService: SliderService);
    getAll(): Slide[];
    add(body: Partial<Slide>, file: Express.Multer.File): Slide;
    update(id: string, body: Partial<Slide>, file: Express.Multer.File): Slide | null;
    remove(id: string): boolean;
}
