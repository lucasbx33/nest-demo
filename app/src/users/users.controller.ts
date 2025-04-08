import { Controller, Get, Post, Body, Put, Param, Delete, HttpException, ConflictException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserEntity } from './users.entity';
import { AuthGuard } from '@/lib/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() // POST '/users'
  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({type:CreateUserDto})
  @ApiResponse({ status: 201, description: 'Returns the created user', type: UserEntity})
  async create(@Body() user: CreateUserDto) {
    try {
      return await this.usersService.create(user);
    } catch (error) {
      if(error.driverError?.code === "23505"){
        throw new ConflictException()
      }
    }
  }

  @Get('/') // GET '/users'
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id') // GET '/users/:id'
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Returns a user' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put(':id') // PUT '/users/:id'
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'Returns the updated user' })
  async update(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ) {
    return this.usersService.update(id, user);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

}
