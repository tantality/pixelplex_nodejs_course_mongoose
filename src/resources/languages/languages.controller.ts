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
import { LanguageDTO } from './language.dto';
import {
  CreateLanguageResponse,
  DeleteLanguageResponse,
  GetLanguagesCommon,
  GetLanguagesResponse,
  GetOneLanguageResponse,
  UpdateLanguageResponse,
} from './types';

export class LanguagesController {
  static getLanguages = async (req: GetLanguagesRequest, res: GetLanguagesResponse, next: NextFunction): Promise<void> => {
    const languages = await LanguagesService.findAll(req);
    res.status(200).json(languages as GetLanguagesCommon);
  };

  static getOneLanguage = async (req: GetOneLanguageRequest, res: GetOneLanguageResponse, next: NextFunction): Promise<void> => {
    const language = await LanguagesService.findById(req);
    res.status(200).json(language as LanguageDTO);
  };

  static createLanguage = async (req: CreateLanguageRequest, res: CreateLanguageResponse, next: NextFunction): Promise<void> => {
    const createdLanguage = await LanguagesService.create(req);
    res.status(201).json(createdLanguage);
  };

  static updateLanguage = async (req: UpdateLanguageRequest, res: UpdateLanguageResponse, next: NextFunction): Promise<void> => {
    const updatedLanguage = await LanguagesService.update(req);
    res.status(200).json(updatedLanguage as LanguageDTO);
  };

  static deleteLanguage = async (req: DeleteLanguageRequest, res: DeleteLanguageResponse, next: NextFunction): Promise<void> => {
    const languageId = await LanguagesService.delete(req);
    res.status(200).json({ id: languageId as number });
  };
}
