import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { JwtAuthGuard } from '../auth-module/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('flashcards')
@ApiBearerAuth()
@Controller('flashcards')
@UseGuards(JwtAuthGuard)
export class FlashcardController {
  constructor(private readonly flashcardService: FlashcardService) {}

  @Post('decks')
  @ApiOperation({ summary: 'Create a new deck' })
  createDeck(@Request() req, @Body() createDeckDto: CreateDeckDto) {
    return this.flashcardService.createDeck(req.user.userId, createDeckDto);
  }

  @Get('decks')
  @ApiOperation({ summary: 'Get all decks' })
  getDecks(@Request() req) {
    return this.flashcardService.getDecks(req.user.userId);
  }

  @Delete('decks/:id')
  @ApiOperation({ summary: 'Delete a deck' })
  deleteDeck(@Request() req, @Param('id') id: string) {
    return this.flashcardService.deleteDeck(req.user.userId, id);
  }

  @Post('decks/:id/cards')
  @ApiOperation({ summary: 'Add a card to a deck' })
  addCard(@Request() req, @Param('id') deckId: string, @Body() createCardDto: CreateCardDto) {
    return this.flashcardService.addCard(req.user.userId, deckId, createCardDto);
  }

  @Delete('decks/:deckId/cards/:cardId')
  @ApiOperation({ summary: 'Delete a card' })
  deleteCard(@Request() req, @Param('deckId') deckId: string, @Param('cardId') cardId: string) {
    return this.flashcardService.deleteCard(req.user.userId, deckId, cardId);
  }
}
