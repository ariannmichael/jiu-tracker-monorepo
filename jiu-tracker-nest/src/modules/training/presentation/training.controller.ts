import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TrainingService } from '../application/training.service';
import { CreateTrainingDto } from '../application/dto/create-training.dto';
import { UpdateTrainingDto } from '../application/dto/update-training.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('api')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('training')
  async createTraining(@Body() dto: CreateTrainingDto) {
    try {
      const training = await this.trainingService.createTraining(dto);
      return { training };
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('trainings')
  async getAllTrainings() {
    try {
      const trainings = await this.trainingService.getAllTrainings();
      return { trainings };
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('trainings/user/:userId')
  async getTrainingListByUserId(
    @Param('userId') userId: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    const { trainings, total } =
      await this.trainingService.getTrainingsByUserId(userId, limit, offset);
    return { trainings, total };
  }

  @UseGuards(JwtAuthGuard)
  @Put('training/:id')
  async updateTraining(
    @Param('id') id: string,
    @Body() dto: UpdateTrainingDto,
  ) {
    try {
      const training = await this.trainingService.updateTraining(id, dto);
      return { training };
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('training/:id')
  async deleteTraining(@Param('id') id: string) {
    try {
      await this.trainingService.deleteTraining(id);
      return { message: 'Training deleted successfully' };
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
