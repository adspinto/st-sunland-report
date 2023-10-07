import AWS from "aws-sdk";
import { parseDynamoItemsGET } from "./";

const docClient = new AWS.DynamoDB.DocumentClient();

export const getPreviousData = async (res, tableName) => {
    try {
      const params = parseDynamoItemsGET(res, tableName);
      const items = await docClient.batchGet(params).promise();
      return items.Responses[tableName];
    } catch (error) {
      console.log("error", error);
    }
  };