import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class FlashcardService {
  constructor(private prisma: PrismaService) {}

  async createDeck(userId: string, createDeckDto: CreateDeckDto) {
    return this.prisma.flashcardDeck.create({
      data: {
        userId,
        title: createDeckDto.title,
      },
    });
  }

  async getDecks(userId: string) {
    return this.prisma.flashcardDeck.findMany({
      where: { userId },
      include: { cards: true },
    });
  }

  async deleteDeck(userId: string, deckId: string) {
    return this.prisma.flashcardDeck.deleteMany({
      where: { id: deckId, userId },
    });
  }

  async addCard(userId: string, deckId: string, createCardDto: CreateCardDto) {
    // Verify deck ownership
    const deck = await this.prisma.flashcardDeck.findFirst({
      where: { id: deckId, userId },
    });
    if (!deck) {
      throw new Error('Deck not found or access denied');
    }

    return this.prisma.flashcard.create({
      data: {
        deckId,
        front: createCardDto.front,
        back: createCardDto.back,
      },
    });
  }

  async deleteCard(userId: string, deckId: string, cardId: string) {
    // Verify deck ownership
    const deck = await this.prisma.flashcardDeck.findFirst({
      where: { id: deckId, userId },
    });
    if (!deck) {
      throw new Error('Deck not found or access denied');
    }

    return this.prisma.flashcard.delete({
      where: { id: cardId },
    });
  }
}
