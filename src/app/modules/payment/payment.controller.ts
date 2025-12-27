import { Controller, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth-module/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

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
}
