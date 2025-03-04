import { Controller, Post, Body } from '@nestjs/common';
import { TtkCollectorService } from '../services/ttk-collector.service';
import { TiktokEvent } from '@app/common/types/event';

@Controller('ttk-collector')
export class TtkCollectorController {
  constructor(private readonly ttkCollectorService: TtkCollectorService) {}

  @Post('test')
  async testCollector(@Body() eventData: TiktokEvent) {
    await this.ttkCollectorService.testStoreEvent(eventData);
    return { message: 'Test event stored successfully' };
  }
}