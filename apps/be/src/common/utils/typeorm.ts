import { FindOneOptions } from 'typeorm';
import { BadUserInputError, EntityNotFoundError } from '@/common/errors';
import { generateErrors } from '@/common/utils/validations';
import { Issue } from '@/issue/entities/issue.entity';
import { Comment } from '@/comment/entities/comment.entity';
import { Project } from '@/project/entities/project.entity';
import { User } from '@/user/entities/user.entity';

type EntityConstructor =
  | typeof Project
  | typeof User
  | typeof Issue
  | typeof Comment;
type EntityInstance = Project | User | Issue | Comment;

const entities: { [key: string]: EntityConstructor } = {
  Comment,
  Issue,
  Project,
  User,
};

export const findEntityOrThrow = async <T extends EntityConstructor>(
  Constructor: T,
  id: number | string,
  options?: FindOneOptions,
): Promise<InstanceType<T>> => {
  const instance = await Constructor.findOne({ where: { id }, ...options });
  if (!instance) {
    throw new EntityNotFoundError(Constructor.name);
  }
  return instance;
};

export const validateAndSaveEntity = async <T extends EntityInstance>(
  instance: T,
): Promise<T> => {
  const Constructor = entities[instance.constructor.name];

  if ('validations' in Constructor) {
    const errorFields = generateErrors(instance, Constructor.validations);

    if (Object.keys(errorFields).length > 0) {
      throw new BadUserInputError({ fields: errorFields });
    }
  }
  return instance.save() as Promise<T>;
};

export const createEntity = async <T extends EntityConstructor>(
  Constructor: T,
  input: Partial<InstanceType<T>>,
): Promise<InstanceType<T>> => {
  // @ts-ignore
  const instance = Constructor.create(input);
  return validateAndSaveEntity(instance as InstanceType<T>);
};

export const updateEntity = async <T extends EntityConstructor>(
  Constructor: T,
  id: number | string,
  input: Partial<InstanceType<T>>,
): Promise<InstanceType<T>> => {
  const instance = await findEntityOrThrow(Constructor, id);
  Object.assign(instance, input);
  return validateAndSaveEntity(instance);
};

export const deleteEntity = async <T extends EntityConstructor>(
  Constructor: T,
  id: number | string,
): Promise<InstanceType<T>> => {
  const instance = await findEntityOrThrow(Constructor, id);
  await instance.remove();
  return instance;
};
