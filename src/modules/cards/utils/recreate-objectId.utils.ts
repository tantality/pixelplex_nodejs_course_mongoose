import { ObjectId, Types } from 'mongoose';

export const recreateObjectWithObjectIdFields = (objectIdFields: Record<string, ObjectId>): Record<string, Types.ObjectId> => {
  const recreatedObjectWithObjectIdFields: Record<string, Types.ObjectId> = {};
  const fieldNames = Object.keys(objectIdFields);

  fieldNames.forEach((name) => {
    recreatedObjectWithObjectIdFields[name] = recreateObjectIdField(objectIdFields[name]);
  });

  return recreatedObjectWithObjectIdFields;
};

export const recreateObjectIdField = (field: ObjectId): Types.ObjectId => {
  return new Types.ObjectId(field.toString());
};
