import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createPayment(userId: string, createPaymentDto: CreatePaymentDto) {
    return this.prisma.payment.create({
      data: {
        userId,
        courseId: createPaymentDto.courseId,
        bookId: createPaymentDto.bookId,
        amount: createPaymentDto.amount,
        currency: createPaymentDto.currency,
        provider: createPaymentDto.provider,
        status: 'pending', // Initial status
      },
    });
  }

  async handlePaymentSuccess(paymentId: string, transactionId: string) {
    const payment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'completed',
        transactionId,
      },
    });

    if (payment.courseId) {
      // Enroll user in course
      await this.prisma.enrollment.create({
        data: {
          userId: payment.userId,
          courseId: payment.courseId,
        },
      });
    } else if (payment.bookId) {
      // Add book to user's library
      await this.prisma.bookPurchase.create({
        data: {
          userId: payment.userId,
          bookId: payment.bookId,
        },
      });
    }

    return payment;
  }
}
