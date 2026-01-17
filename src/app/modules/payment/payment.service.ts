import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) { }

  async createPayment(userId: string, createPaymentDto: CreatePaymentDto) {
    return this.prisma.payment.create({
      data: {
        userId,
        courseId: createPaymentDto.courseId,
        bookId: createPaymentDto.bookId,
        amount: createPaymentDto.amount,
        currency: createPaymentDto.currency,
        provider: createPaymentDto.provider,
        refCode: createPaymentDto.refCode,
        status: 'pending', // Initial status
      },
    });
  }

  async handlePaymentSuccess(paymentId: string, transactionId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status === 'completed') {
      return { message: 'Payment already processed', payment };
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'completed',
        transactionId,
      },
    });

    // Send Commission Webhook
    let refCode = updatedPayment.refCode;

    if (!refCode) {
      // Fallback to user's refCode
      const user = await this.prisma.user.findUnique({
        where: { id: updatedPayment.userId },
        select: { refCode: true },
      });
      refCode = user?.refCode ?? null;
    }

    if (refCode) {
      try {
        const webhookPayload = {
          refCode: refCode,
          saleAmount: updatedPayment.amount,
          productId: updatedPayment.courseId ? `course_${updatedPayment.courseId}` : `book_${updatedPayment.bookId}`,
          saleId: updatedPayment.id,
          moduleTitle: 'E-Learning Purchase', // You might want to fetch the actual title
        };

        // We use firstValueFrom to convert the Observable to a Promise
        await firstValueFrom(
          this.httpService.post('http://esperanza.et/api/distribute-commission', webhookPayload)
        );
        console.log('Commission webhook sent successfully');
      } catch (error) {
        console.error('Failed to send commission webhook:', error.message);
        // We do NOT throw here to avoid rolling back the payment completion
      }
    }

    if (updatedPayment.courseId) {
      // Check if already enrolled
      const existingEnrollment = await this.prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: updatedPayment.userId,
            courseId: updatedPayment.courseId,
          },
        },
      });

      if (!existingEnrollment) {
        // Enroll user in course
        await this.prisma.enrollment.create({
          data: {
            userId: updatedPayment.userId,
            courseId: updatedPayment.courseId,
          },
        });
      }
    } else if (updatedPayment.bookId) {
      // Check if already purchased
      const existingPurchase = await this.prisma.bookPurchase.findUnique({
        where: {
          userId_bookId: {
            userId: updatedPayment.userId,
            bookId: updatedPayment.bookId,
          },
        },
      });

      if (!existingPurchase) {
        // Add book to user's library
        await this.prisma.bookPurchase.create({
          data: {
            userId: updatedPayment.userId,
            bookId: updatedPayment.bookId,
          },
        });
      }
    }

    return updatedPayment;
  }



  async handleChapaWebhook(payload: any) {

    const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || '';
    const CHAPA_API_URL = 'https://api.chapa.co/v1/transaction/initialize';



    const { amount, email,currency, phone_number,first_name, last_name, tx_ref, slug } = payload;
    
    console.log('Chapa webhook payload:', payload);

    try{

      
    const payloadData:any  = {
      amount: amount.toString(),
      currency: currency,
      email: email,
      first_name,
      last_name,
      tx_ref,
      callback_url: `https://globalpathway.esperanza.et/api/payment/chapa/callback`,
      return_url: `https://globalpathway.esperanza.et/checkout/success?slug=${slug}`,
      customization: {
          title: 'Enrollment',
          description: 'Payment for course access',
      },

    };
    if(phone_number){
      payloadData.phone_number = phone_number;
    }

    console.log('Prepared Chapa payload data:', payloadData);


    const response = await axios.post(CHAPA_API_URL, payloadData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
      },
    });

    console.log('Chapa API response:', response.data);
    
    const data =  response.data;
     if(data.status === 'success'){
        return {
          checkout_url: data.data.checkout_url,
          message: 'Chapa payment initiated successfully',
        };
     } else {
      return {
        error: 'Failed to initiate Chapa payment',
        details: data,
      };
     }

  }
  catch(error){
    console.error('Error handling Chapa webhook:', error.message);
  return   { error:error };
  }
}



  }
