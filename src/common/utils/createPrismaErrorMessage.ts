import { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';

export const createPrismaErrorMessage = (
  error: PrismaClientKnownRequestError,
) => {
  const errMsg = error.message.split('\n').pop();
  return errMsg;
};
