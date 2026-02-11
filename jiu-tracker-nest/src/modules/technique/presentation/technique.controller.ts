import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Param,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { TechniqueService } from '../application/technique.service';
import { CreateTechniqueDto } from '../application/dto/create-technique.dto';
import { UpdateTechniqueDto } from '../application/dto/update-technique.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('api')
export class TechniqueController {
  constructor(private readonly techniqueService: TechniqueService) {}

  @UseGuards(JwtAuthGuard)
  @Post('technique')
  async createTechnique(@Body() dto: CreateTechniqueDto) {
    try {
      const technique = await this.techniqueService.createTechnique(dto);
      return { technique };
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('technique/:id')
  async updateTechnique(
    @Param('id') id: string,
    @Body() dto: UpdateTechniqueDto,
  ) {
    try {
      const technique = await this.techniqueService.updateTechnique(id, dto);
      return { technique };
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('technique/:id')
  async getTechniqueById(@Param('id') id: string) {
    try {
      const technique = await this.techniqueService.getTechniqueById(id);
      return { technique };
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('techniques')
  async getAllTechniques() {
    try {
      const techniques = await this.techniqueService.getAllTechniques();
      return { techniques };
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
