import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Number } from 'mongoose';
import { CreateDalleDto } from './dto/create-dalle.dto';
import { Dalle } from './entities/dalle.entity';

import { Configuration, OpenAIApi } from 'openai';
import { UpdateDalleDto } from './dto/update-dalle.dto';
import { UserSchema } from 'src/user/entities/user.entity';
import { createWriteStream } from 'fs';
import { AxiosResponse } from 'axios';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class DalleService {
  httpService: any;
  constructor(
    @InjectModel(Dalle.name)
    private readonly dalleModel: Model<Dalle>,
  ) {}

  findAll() {
    return this.dalleModel.find().exec();
  }

  async findOne(id: string) {
    const message = await this.dalleModel
      .findOne({
        _id: id, // where id is your column name
      })
      .exec();
    if (!message) {
      //throw new HttpException(`message #${id} not found`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`message #${id} not found`);
    }
    return message;
  }

  async findFromUserId(userId: string) {
    const message = await this.dalleModel
      .find({
        userId: userId, // where id is your column name
      })
      .exec();
    if (!message) {
      //throw new HttpException(`message #${id} not found`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`message #${userId} not found`);
    }
    return message;
  }

  async findFromUserIds(userIds: string, paginationQuery: PaginationQueryDto) {
    console.log('userIdsss', userIds)
    const {limit,offset} = paginationQuery;
    //const dalleLast = [];
    //userIds.map(item => dalleLast.push(this.findFromUserId(item)));
     // console.log('userIds', userIds.join(''));
    //userIds.map(userIds=>console.log('item', userIds))
    //var manufacturerParam = userIds.split(",")
    let userss = userIds.split(',');


    const message = await this.dalleModel
      .find({
        userId: {$in:userss}, // where id is your column name
      })
      .sort({ _id: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
    if (!message) {
      //throw new HttpException(`message #${id} not found`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`message #${message} not found`);
    }
    return message;
  }

  async download(imageUrl: string) {

// Or with cookies
// var request = require('request').defaults({jar: true});


//await request.get('https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png')
//.on('error',function(err){
// console.log(err);
//})
//.on('response',function(response){
// if(response.statusCode == 200){
//  console.log("successfully retreived image from url")
/// }
//})
//.pipe(fs.createWriteStream('C:\Users\Administrator\Pictures' + 'filename'));

var fs = require('fs'),
    request = require('request');

var downloadItem = function(uri, filename, callback){
  request.head(uri, function(err, res, body){ 
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
const myArray = imageUrl.split('https://oaidalleapiprodscus.blob.core.windows.net/private/')
const myArray2 = myArray[1].split('/')
const myArray3 = myArray2[2].split('?')
await downloadItem(imageUrl, `C:/inetpub/wwwroot/photo/${myArray3[0]}`, function(){
  console.log('done', myArray3[0]);
  return myArray3[0];
});
//await request.get({url: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png', encoding: 'binary'}, function (err, response, body) {
  //fs.createWriteStream("C:\Users\Administrator\Pictures", body, {encoding: 'binary'}, function(err) {
    //if(err){
      //console.log(err);
      //return 'error';}  
    //else{
      //console.log("The file was saved!");
      //return 'saved'
    //}
  //}); 
//})
}

  async getOpenAI(prompt: string): Promise<any> {
    const key = process.env.GPT_API_KEY;
    const configuration = new Configuration({
      apiKey: key,
    });
    try {
      const openai = new OpenAIApi(configuration);

      const response = await openai.createImage(
        {
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        },
        {
          timeout: 10000,
          headers: {
            'Example-Header': 'example',
          },
        },
      );
      const image = response.data.data[0].url;
      const myArray = image.split('https://oaidalleapiprodscus.blob.core.windows.net/private/')
      const myArray2 = myArray[1].split('/')
      const myArray3 = myArray2[2].split('?')
      console.log('data',image, response);
      if(image) {
        const pngAdress = await this.download(image)
        console.log('pngAdress', pngAdress);
        const imageAdress=`http://37.148.213.28/photo/${myArray3[0]}`
        return imageAdress;
      }

    } catch (error) {
      console.log('ERROR getopenai answer', error);
      return error;
    }
  }

  async update(id:string, updateDalleDto: UpdateDalleDto){
      const existingDalle = await this.dalleModel
      .findOneAndUpdate({_id: id},  {$set: updateDalleDto}, {new:true})
      .exec();

      if(!existingDalle){
        throw new NotFoundException(`Image ${id} not found`)
      }
      return existingDalle;
    
  }

  create(createDalleDto: CreateDalleDto) {
    const image = new this.dalleModel(createDalleDto);
    return image.save();
  }
}

