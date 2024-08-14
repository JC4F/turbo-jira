import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .required()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  SENTRY_DSN: Joi.string().required(),
});
