import { Controller, UseGuards } from '@nestjs/common';
import { ApiKeyAuthGuard } from 'src/auth/guards/api-key.guard';

@Controller('api')
@UseGuards(ApiKeyAuthGuard)
export class ApiController {}
