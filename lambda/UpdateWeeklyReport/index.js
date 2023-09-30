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

const getPreviousData = async (res, tableName) => {
  try {
    const params = parseDynamoItemsGET(res, tableName);
    const items = await docClient.batchGet(params).promise();
    return items.Responses[tableName];
  } catch (error) {
    console.log("error", error);
  }
};

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

const batchWrite = async (res, guildId, previousData) => {
  // const dataToDelete = previousData.filter()
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
  const gId = event.queryStringParameters.gId;
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
    const apiRes = await fetch(`${apiUrl}/info/city/${gId || guildId}`);
    console.log("getting smarty data");
    const res = await apiRes.json();

    const previousData = await getPreviousData(res, guildId);

    console.log("start batch write", previousData);
    // await batchWrite(res, guildId, previousData);
    // console.log("batch write finished");
    // response.body = JSON.stringify({ message: "Write completed!" });
  } catch (error) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "Could not perform the operation, try again.",
      error: JSON.stringify(error),
    });
  }
  return response;
};
