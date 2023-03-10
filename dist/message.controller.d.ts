import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    findAll(paginationQuery: any): Promise<(import("./entities/messajes.entity").Messages & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findOne(id: string): Promise<import("./entities/messajes.entity").Messages & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getOpenAI(question: string): Promise<any>;
    create(createMessageDto: CreateMessageDto): import("./entities/messajes.entity").Messages & {
        _id: import("mongoose").Types.ObjectId;
    };
}
