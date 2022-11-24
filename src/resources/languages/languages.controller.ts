/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Response } from 'express';
import {
  CreateLanguageRequest,
  DeleteLanguageRequest,
  GetLanguagesRequest,
  GetOneLanguageRequest,
  UpdateLanguageRequest,
} from './types/request.types';
import { LanguagesService } from './languages.service';

export class LanguagesController {
  static getLanguages = async (req: GetLanguagesRequest, res: Response, next: NextFunction): Promise<void> => {
    const languages = await LanguagesService.findAll(req);
    res.status(200).json(languages);
  };

  static getOneLanguage = async (req: GetOneLanguageRequest, res: Response, next: NextFunction): Promise<void> => {
    const language = await LanguagesService.findById(req);
    res.status(200).json(language);
  };

  static createLanguage = async (req: CreateLanguageRequest, res: Response, next: NextFunction): Promise<void> => {
    const createdLanguage = await LanguagesService.create(req);
    res.status(201).json(createdLanguage);
  };

  static updateLanguage = async (req: UpdateLanguageRequest, res: Response, next: NextFunction): Promise<void> => {
    const updatedLanguage = await LanguagesService.update(req);
    res.status(200).json(updatedLanguage);
  };

  static deleteLanguage = async (req: DeleteLanguageRequest, res: Response, next: NextFunction): Promise<void> => {
    const languageId = await LanguagesService.delete(req);
    res.status(200).json({ id: languageId });
  };
}
