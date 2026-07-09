import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SliderService, Slide } from './slider.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Controller('slider')
export class SliderController {
  constructor(private readonly sliderService: SliderService) {}

  @Get()
  getAll(): Slide[] {
    return this.sliderService.getAll();
  }

    // Додаємо слайд тільки з назвою
  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/images/slider',
      filename: (_, file, cb) => {
        // тимчасове ім'я, після збереження слайду перейменуємо
        cb(null, 'temp' + extname(file.originalname));
      },
    }),
  }))
  add(
    @Body() body: Partial<Slide>,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new Error('Потрібно завантажити фото слайду');
    }

    // спочатку створюємо слайд без фото
    const newSlide = this.sliderService.add({ title: body.title });

    // перейменовуємо файл у slider{id}.ext
    const ext = extname(file.originalname);
    const oldPath = `./public/images/slider/${file.filename}`;
    const newFilename = `slider${newSlide.id}${ext}`;
    const newPath = `./public/images/slider/${newFilename}`;

    fs.renameSync(oldPath, newPath);

    // оновлюємо шлях до фото у слайді
    newSlide.image = `/images/slider/${newFilename}`;
    this.sliderService.update(newSlide.id, newSlide);

    return newSlide;
  }

  // Оновлення слайду: фото або назва
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/images/slider', // всі фото тут
      filename: (req, file, cb) => {
        const id = req.params.id;
        const ext = extname(file.originalname);
        cb(null, `slider${id}${ext}`);
      }
    })
  }))
  update(
    @Param('id') id: string,
    @Body() body: Partial<Slide>,
    @UploadedFile() file: Express.Multer.File
  ) {
    // якщо завантажили нове фото
    if (file) {
      body.image = `/images/slider/slider${id}${extname(file.originalname)}`;
    }
    return this.sliderService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // видаляємо файл фото
    const slide = this.sliderService.getAll().find(s => s.id === +id);
    if (slide?.image) {
      const filePath = `./public${slide.image}`;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    return this.sliderService.remove(+id);
  }
}