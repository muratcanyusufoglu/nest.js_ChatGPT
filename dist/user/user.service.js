"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_entity_1 = require("./entities/user.entity");
let UserService = class UserService {
    constructor(userModule) {
        this.userModule = userModule;
    }
    findAll() {
        return this.userModule.find().exec();
    }
    async findOne(userId) {
        const user = await this.userModule
            .findOne({
            userId: userId,
        })
            .exec();
        if (!user) {
            throw new common_1.NotFoundException(`user #${userId} not found`);
        }
        return user;
    }
    async update(userId, updateUserDto) {
        const existingDalle = await this.userModule
            .findOneAndUpdate({ userId: userId }, { $set: updateUserDto }, { new: true })
            .exec();
        if (!existingDalle) {
            throw new common_1.NotFoundException(`Image ${userId} not found`);
        }
        return existingDalle;
    }
    create(createUserDto) {
        const image = new this.userModule(createUserDto);
        return image.save();
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map