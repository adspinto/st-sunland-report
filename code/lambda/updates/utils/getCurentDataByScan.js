import AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();

export const getCurentDataByScan = async (guildId) => {
  try {
    const params = {
      TableName: guildId,
    };
    const response = await docClient.scan(params).promise();
    return response.Items;
  } catch (error) {
    console.log("error", error);
  }
};
