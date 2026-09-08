import { GetManyQuery, GetManyQueryType } from '#common/dto/request/get-many-query.js';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { UserDto } from '../dto/response/user.dto.js';
import { ApiGetManyResponse, GetManyReply } from '#common/dto/response/get-many-reply.js';
import { UserService } from '../services/user.service.js';
import { UserCreateDto } from '../dto/request/user-create.dto.js';
import { UserUpdateDto } from '../dto/request/user-update.dto.js';

@ApiTags('Users')
@Controller('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve a paginated list of users' })
  @ApiExtraModels(UserDto)
  @ApiGetManyResponse(UserDto)
  userGetMany(@Query() query: GetManyQuery): Promise<GetManyReply<UserDto>> {
    return this.userService.userGetMany(query as GetManyQueryType<'User'>);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Retrieve a single user by ID' })
  @ApiOkResponse({ description: 'Successfully retrieved user', type: UserDto })
  userGetById(@Param('userId', ParseIntPipe) id: number): Promise<UserDto> {
    return this.userService.userGetById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ description: 'User successfully created', type: Number })
  userCreate(@Body() payload: UserCreateDto): Promise<number> {
    return this.userService.userCreate(payload);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Partially update an existing user' })
  @ApiOkResponse({ description: 'User successfully updated' })
  userUpdate(@Param('userId', ParseIntPipe) id: number, @Body() payload: UserUpdateDto): Promise<void> {
    return this.userService.userUpdate(id, payload);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiNoContentResponse({ description: 'User successfully deleted' })
  userDelete(@Param('userId', ParseIntPipe) id: number, @Body() payload: UserUpdateDto): Promise<void> {
    return this.userService.userDelete(id, payload);
  }
}
