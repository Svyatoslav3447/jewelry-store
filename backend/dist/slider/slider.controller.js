"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderController = void 0;
const common_1 = require("@nestjs/common");
const slider_service_1 = require("./slider.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs = __importStar(require("fs"));
let SliderController = class SliderController {
    sliderService;
    constructor(sliderService) {
        this.sliderService = sliderService;
    }
    getAll() {
        return this.sliderService.getAll();
    }
    add(body, file) {
        if (!file) {
            throw new Error('Потрібно завантажити фото слайду');
        }
        const newSlide = this.sliderService.add({ title: body.title });
        const ext = (0, path_1.extname)(file.originalname);
        const oldPath = `./public/images/slider/${file.filename}`;
        const newFilename = `slider${newSlide.id}${ext}`;
        const newPath = `./public/images/slider/${newFilename}`;
        fs.renameSync(oldPath, newPath);
        newSlide.image = `/images/slider/${newFilename}`;
        this.sliderService.update(newSlide.id, newSlide);
        return newSlide;
    }
    update(id, body, file) {
        if (file) {
            body.image = `/images/slider/slider${id}${(0, path_1.extname)(file.originalname)}`;
        }
        return this.sliderService.update(+id, body);
    }
    remove(id) {
        const slide = this.sliderService.getAll().find(s => s.id === +id);
        if (slide?.image) {
            const filePath = `./public${slide.image}`;
            if (fs.existsSync(filePath))
                fs.unlinkSync(filePath);
        }
        return this.sliderService.remove(+id);
    }
};
exports.SliderController = SliderController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], SliderController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.diskStorage)({
            destination: './public/images/slider',
            filename: (_, file, cb) => {
                cb(null, 'temp' + (0, path_1.extname)(file.originalname));
            },
        }),
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SliderController.prototype, "add", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.diskStorage)({
            destination: './public/images/slider',
            filename: (req, file, cb) => {
                const id = req.params.id;
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `slider${id}${ext}`);
            }
        })
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], SliderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SliderController.prototype, "remove", null);
exports.SliderController = SliderController = __decorate([
    (0, common_1.Controller)('slider'),
    __metadata("design:paramtypes", [slider_service_1.SliderService])
], SliderController);
//# sourceMappingURL=slider.controller.js.map