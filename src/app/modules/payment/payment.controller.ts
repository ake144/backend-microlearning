import { Controller, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth-module/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate payment' })
  create(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(req.user.userId, createPaymentDto);
  }

  @Post(':id/success')
  @ApiOperation({ summary: 'Handle payment success (webhook mock)' })
  success(@Param('id') id: string, @Body('transactionId') transactionId: string) {
    return this.paymentService.handlePaymentSuccess(id, transactionId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle generic payment webhook' })
  async handleWebhook(@Body() payload: any) {
    // This is a generic handler. In a real scenario, you'd verify signatures
    // and extract the payment ID and status based on the provider.
    // For now, we assume the payload contains paymentId and status.
    console.log('Received webhook payload:', payload);

    // Example payload structure adaptation
    const paymentId = payload.paymentId || payload.data?.object?.metadata?.paymentId;
    const status = payload.status || payload.type;
    const transactionId = payload.transactionId || payload.data?.object?.id;

    if (status === 'success' || status === 'payment.succeeded' || status === 'completed') {
      return this.paymentService.handlePaymentSuccess(paymentId, transactionId);
    }

    return { received: true };
  }
}
