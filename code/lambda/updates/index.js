import { CreateWeeklyBackup } from "./CreateWeeklyBackup";
import { UpdateWeeklyReport } from "./UpdateWeeklyReport";
export const handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
  };
  const handlers = {
    CreateWeeklyBackup,
    UpdateWeeklyReport,
  };
  try {
    const handle = event.lambdaHandler;

    return handlers[handle]();
  } catch (error) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "Could not perform the operation, try again.",
      error: JSON.stringify(error),
    });
  }
};
