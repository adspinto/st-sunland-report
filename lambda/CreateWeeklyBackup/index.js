import AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();

const parseDynamoItemsGET = (res, tableName) => {
  const items = res.data.members.map((member) => {
    return {
      playerId: member._id,
      playerName: member.name,
    };
  });

  return {
    RequestItems: {
      [tableName]: {
        Keys: items,
      },
    },
    ConsistentRead: false,
  };
};

const valuesToStoreMultiple = () => [
  "bounty",
  "gld",
  "invst",
  "level",
  "prest",
  "ascendUpg",
  "collection",
  "help",
];

const parseDynamoItem = (item, find = {}) => {
  const obj = {};
  Object.keys(item).forEach((key) => {
    const value = item[key];
    const previousValue = find?.[key] || [];
    const assigned = {
      [key]: [...previousValue, value],
    };

    if (key == "_id") {
      assigned.playerId = item[key];
    }

    if (key == "name") {
      assigned.playerName = item[key];
    }

    assigned.updatedAt = previousValue?.updatedAt
      ? [previousValue.updatedAt, Math.floor(Date.now() / 1000)]
      : [Math.floor(Date.now() / 1000)];

    Object.assign(obj, assigned);
  });
  return {
    PutRequest: {
      Item: obj,
    },
  };
};

const getPreviousData = async (res, guildId) => {
  try {
    const params = parseDynamoItemsGET(res, guildId);
    const items = await docClient.batchGet(params).promise();
    return items.Responses[guildId];
  } catch (error) {
    console.log("error", error);
  }
};

const batchWrite = async (res, tableName, previousData = []) => {
  const data = res.data.members.map((item) => {
    try {
      const find = previousData.find((pItem) => pItem._id === item._id);
      return parseDynamoItem(item, find);
    } catch (error) {
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

export const handler = async (event) => {
  const apiUrl = process.env.SMARTY_API_URL;
  const guildId = event.queryStringParameters.guildId;
  const tableName = event.queryStringParameters.tableName;
  console.log("guildId", guildId);
  console.log("guildId", tableName);
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
    console.log("GET Previous Data");
    const previousData = await getPreviousData(apiRes, guildId);
    console.log("start batch write");
    await batchWrite(res, tableName, previousData);
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
