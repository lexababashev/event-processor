import { Controller, Post, Body } from '@nestjs/common';
import { FsCollectorService } from '../services/fs-collector.service';
import { FacebookEvent } from '@app/common/types/event';

@Controller('fs-collector')
export class FsCollectorController {
  constructor(private readonly fsCollectorService: FsCollectorService) {}

  /**
   * POST route for testing the fs-collector from Postman.
   * Send a JSON body matching your Event interface.
   */
  @Post('test')
  async testCollector(@Body() eventData: FacebookEvent) {
    await this.fsCollectorService.testStoreEvent(eventData);
    return { message: 'Test event stored successfully' };
  }
}
