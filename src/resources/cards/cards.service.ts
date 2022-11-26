/* eslint-disable require-await */
import { logRequest } from '../../utils/log-request.utils';
import { CardDTO } from './card.dto';
import { Card } from './card.entity';
import { GetCardsRequest, GetCardsCommon, CreateCardRequest, UpdateCardRequest, DeleteCardRequest } from './types';
import { WordDTO } from './word.dto';
import { Word } from './word.entity';

export class CardsService {
  private static nativeWordDTO = new WordDTO({ id: 1, value: 'ef' });
  private static foreignWordDTO = new WordDTO(new Word(2, 1, 'hello', new Date(), new Date()));
  private static card = new Card(1, 1, 2, new Date(), new Date());
  private static cardDTO = new CardDTO(CardsService.card, [CardsService.nativeWordDTO], [CardsService.foreignWordDTO]);

  static findAll = async (req: GetCardsRequest): Promise<GetCardsCommon | null> => {
    logRequest(req);
    return {
      count: 30,
      cards: [CardsService.cardDTO],
    };
  };

  static create = async (req: CreateCardRequest): Promise<CardDTO> => {
    logRequest(req);
    return CardsService.cardDTO;
  };

  static update = async (req: UpdateCardRequest): Promise<CardDTO | null> => {
    logRequest(req);
    return CardsService.cardDTO;
  };

  static delete = async (req: DeleteCardRequest): Promise<number | null> => {
    logRequest(req);
    return 1;
  };
}
