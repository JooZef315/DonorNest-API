import { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';

export const createPrismaErrorMessage = (
  error: PrismaClientKnownRequestError,
) => {
  const errMsg = {
    error: error.name,
    code: error.code ? error.code : null,
    message: error.message.split('\n').pop(),
  };

  return errMsg;
};
