import { ObjectId, Types } from 'mongoose';

export const changeTypeOfObjectFieldsFromObjectIdToTypesObjectId = (object: Record<string, ObjectId>): Record<string, Types.ObjectId> => {
  const updatedObject: Record<string, Types.ObjectId> = {};
  const fieldNames = Object.keys(object);

  fieldNames.forEach((name) => {
    updatedObject[name] = changeTypeFromObjectIdToTypesObjectId(object[name]);
  });

  return updatedObject;
};

export const changeTypeOfArrayFromObjectIdToTypesObjectId = (arr: ObjectId[]): Types.ObjectId[] => {
  const updatedArr: Types.ObjectId[] = [];

  arr.forEach((item) => {
    updatedArr.push(changeTypeFromObjectIdToTypesObjectId(item));
  });

  return updatedArr;
};

export const changeTypeFromObjectIdToTypesObjectId = (item: ObjectId): Types.ObjectId => {
  return new Types.ObjectId(item.toString());
};
