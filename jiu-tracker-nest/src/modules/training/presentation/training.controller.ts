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
  @Get('training/:id')
  async getTrainingById(@Param('id') id: string) {
    try {
      const training = await this.trainingService.getTrainingById(id);
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
