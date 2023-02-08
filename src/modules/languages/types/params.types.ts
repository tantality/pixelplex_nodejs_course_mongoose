import { ObjectId } from 'mongoose';

type WithLanguageId = { languageId: ObjectId };

export type GetOneLanguageParams = WithLanguageId;
export type UpdateLanguageParams = WithLanguageId;
export type DeleteLanguageParams = WithLanguageId;
