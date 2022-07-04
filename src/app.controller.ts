import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserObject, UserObjectInput } from './types.dto';
import { AppService } from './app.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('isWorking')
  isWorking(): boolean {
    return true;
  }

  @Post()
  @ApiBody({ type: UserObjectInput })
  createUser(@Body('input') userDto: UserObjectInput): string {
    return this.appService.createUser(userDto);
  }

  @Put(':userId')
  @ApiBody({ type: UserObjectInput })
  updateUser(
    @Param('userId') userId: string,
    @Body('input') userDto: UserObjectInput,
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
