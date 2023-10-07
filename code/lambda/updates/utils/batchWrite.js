import AWS from "aws-sdk";
import { parseDynamoItem } from "./";
const docClient = new AWS.DynamoDB.DocumentClient();
export const batchWrite = async (currentData, tableName, previousData = []) => {
  const data = currentData.map((item) => {
    try {
      const find = previousData.find((pItem) => pItem._id === item._id);
      return parseDynamoItem(item, find);
    } catch (error) {
      console.log("error while trying to backup", error);
      return parseDynamoItem(item);
    }
  });

  const params = {
    RequestItems: {
      [tableName]: data,
    },
  };

  await docClient.batchWrite(params).promise();
};
