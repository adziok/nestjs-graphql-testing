import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UpdateUserObjectInput, UserObject, UserObjectInput } from './dtos';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('isWorking')
  isWorking(): boolean {
    return true;
  }

  @Post()
  createUser(@Body('input') userDto: UserObjectInput): string {
    return this.appService.createUser(userDto);
  }

  @Put(':userId')
  updateUser(
    @Param('userId') userId: string,
    @Body('input') userDto: UpdateUserObjectInput,
  ): string {
    return this.appService.updateUser(userId, userDto);
  }

  @Delete(':userId')
  deleteUser(@Param('userId') userId: string): string {
    return this.appService.deleteUser(userId);
  }

  @Get()
  listUsers(): UserObject[] {
    return this.appService.listUsers();
  }
}
