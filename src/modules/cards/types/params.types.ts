import { ObjectId } from 'mongoose';

type WithCardId = { cardId: ObjectId };

export type UpdateCardParams = WithCardId;
export type DeleteCardParams = WithCardId;
