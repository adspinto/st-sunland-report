import AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();

const parseDynamoItem = (item) => {
  const obj = {};
  Object.keys(item).forEach((key) => {
    Object.assign(obj, {
      [key]: { S: item[key].toString() },
    });
  });
  return obj;
};

export const handler = async (event) => {
  const apiUrl = process.env.SMARTY_API_URL;
  const guildId = event.queryStringParameters.guildId;
  const response = {
    statusCode: 200,
    body: JSON.stringify(apiUrl),
  };
  try {
    const apiRes = await fetch(`${apiUrl}/info/city/${guildId}`);
    const res = await apiRes.json();

    const data = res.data.members.map((item) => parseDynamoItem(item));
    const params = {
      RequestItems: {
        [process.env.TABLE_NAME]: {
          Keys: data,
          ProjectionExpression: "KEY_NAME, ATTRIBUTE",
        },
      },
    };

    await docClient.batchWrite(params).promise();
    response.body = JSON.stringify(res);
  } catch (error) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "Could not perform the operation, try again.",
      error: error,
    });
  }
  return response;
};
