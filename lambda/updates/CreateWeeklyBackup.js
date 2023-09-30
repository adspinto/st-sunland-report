import { getCurentDataByScan } from "./utils/getCurentDataByScan";
import { getPreviousData } from "./utils/getPreviousData";
import { batchWrite } from "./utils/batchWrite";
import { getResponseConfig } from "./utils";

export const CreateWeeklyBackup = async (event) => {
  const { response, guildId, tableName } = getResponseConfig(event);
  try {
    console.log("starting the request");
    console.log("GET current Data");
    const currentData = await getCurentDataByScan(guildId);
    console.log("GET Previous Data");
    const previousData = await getPreviousData(currentData, tableName);
    console.log("start batch write", previousData);
    await batchWrite(currentData, tableName, previousData);
    console.log("batch write finished");
    response.body = JSON.stringify({ message: "Write completed!" });
  } catch (error) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "Could not perform the operation, try again.",
      error: JSON.stringify(error),
    });
  }
  return response;
};
