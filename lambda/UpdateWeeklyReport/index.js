import AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();

function isMonday() {
  return new Date().getDay() === 1;
}

const parseDynamoItem = (item) => {
  const obj = {};
  Object.keys(item).forEach((key) => {
    const value = item[key];

    const assigned = {
      [key]: value,
    };

    if (key == "_id") {
      assigned.playerId = item[key];
    }

    if (key == "name") {
      assigned.playerName = item[key];
    }

    assigned.updatedAt = Math.floor(Date.now() / 1000);

    Object.assign(obj, assigned);
  });
  return {
    PutRequest: {
      Item: obj,
    },
  };
};

const batchWrite = async (res, guildId) => {
  const shouldWrite = isMonday();
  console.log("shouldWrite", shouldWrite, new Date().getDay());

  const data = res.data.members.map((item) => parseDynamoItem(item));
  const params = {
    RequestItems: {
      [guildId]: data,
    },
  };

  await docClient.batchWrite(params).promise();
};

export const handler = async (event) => {
  const apiUrl = process.env.SMARTY_API_URL;
  const guildId = event.queryStringParameters.guildId;
  console.log("guildId", guildId);
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify(apiUrl),
  };
  try {
    console.log("starting the request");
    const apiRes = await fetch(`${apiUrl}/info/city/${guildId}`);
    console.log("getting smarty data");
    const res = await apiRes.json();
    console.log("start batch write");
    await batchWrite(res, guildId);
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
