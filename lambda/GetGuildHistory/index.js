import AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();

const multiple = [
  "bounty",
  "bounty_monday",
  "gld",
  "invst",
  "invst_monday",
  "level",
  "prest",
  "ascendUpg",
  "collection",
  "help",
  "updatedAt"
];

const query = async (guildId) => {
  const params = {
    TableName: `historico_${guildId}`,
  };
  const response = await docClient.scan(params).promise();

  return response.Items.map((item) => {
    const keys = Object.keys(item);
    const nextItem = item;
    keys.map((kItem) => {
      if (multiple.includes(kItem)) {
        nextItem[kItem] = JSON.parse(nextItem[kItem]);
      }
    });
    return nextItem;
  });
};

export const handler = async (event) => {
  const guildId = event.queryStringParameters.guildId;
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify(guildId),
  };
  try {
    const data = await query(guildId);
    response.body = JSON.stringify(data);
    return response;
  } catch (error) {
    console.log("error on guild history", JSON.stringify(error));
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "Could not perform the operation, try again.",
      error: error,
    });
  }
};
