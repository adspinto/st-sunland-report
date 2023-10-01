import AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();

const parseDynamoItemsGET = (res, tableName) => {
  const items = res.map((member) => {
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

const valuesToStoreMultiple = (key, value, previousValue) => {
  const multiple = [
    "bounty",
    "gld",
    "invst",
    "level",
    "prest",
    "ascendUpg",
    "collection",
    "help",
    "bounty_monday",
    "invst_monday",
  ];
  const shouldMultiple = multiple.includes(key);
  if (!shouldMultiple) {
    return value;
  }

  const parsePrevious =
    typeof previousValue === "string"
      ? JSON.parse(previousValue)
      : previousValue;

  return previousValue
    ? JSON.stringify([...parsePrevious, value])
    : JSON.stringify([value]);
};

const parseAssign = (previous, current, key) => {
  console.log(key);
  try {
    const parsedUpdatedAt = JSON.parse(previous);
    return JSON.stringify([...parsedUpdatedAt, current]);
  } catch (error) {
    console.log("error parseAssign", error);
    return JSON.stringify([current]);
  }
};

const parseDynamoItem = (item, find = {}, findSmarty = {}) => {
  const obj = {};
  Object.keys(item).forEach((key) => {
    const value = item[key];
    const previousValue = find?.[key];

    const parsedMultipleValue = valuesToStoreMultiple(
      key,
      value,
      previousValue
    );
    const assigned = {
      [key]: parsedMultipleValue,
    };

    if (key == "playerId") {
      assigned.playerId = item[key];
    }

    if (key == "name") {
      assigned.playerName = item[key];
      assigned.name = item[key];
    }

    try {
      const currentInvst = JSON.parse(item["invst"]);
      if (key == "invst") {
        console.log("it ran in invst so far")
        if (previousValue) {
          const previousInvst = JSON.parse(previousValue);
          const diff = currentInvst - previousInvst[previousValue.length - 1];
          assigned.invst_sofar = parseAssign(previousValue, diff, key);
        }
      } else {
        console.log("it ran in else")
        const diff = findSmarty["invst"] - currentInvst;
        assigned.invst_sofar = JSON.stringify([diff]);
      }
    } catch (error) {
      console.log("error while calc invst_sofar", error);
    }

    if (key == "updatedAt") {
      assigned.updatedAt = parseAssign(
        previousValue,
        Math.floor(Date.now() / 1000),
        key
      );
    }

    Object.assign(obj, assigned);
  });
  return {
    PutRequest: {
      Item: obj,
    },
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

const getCurrentDataByScan = async (guildId) => {
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

const batchWrite = async (
  currentData,
  tableName,
  previousData = [],
  smartyRes
) => {
  const data = currentData.map((item) => {
    try {
      const find = previousData.find((pItem) => pItem._id === item._id);
      const findSmarty = smartyRes.find((sItem) => sItem._id === item._id);
      return parseDynamoItem(item, find, findSmarty);
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
  // at 'requestItems' failed to satisfy constraint: Map value must satisfy constraint: [Member must have length less than or equal to 25, Member must have length greater than or equal to 1]\\\",\\\"code\\\":\\\"ValidationException\\\",\\\"[__type]\\\":\\\"See error.__type for details.\\\",\\\"time\\\":\\\"2023-09-30T20:59:39.185Z\\\",\\\"requestId\\\":\\\"Q88O46SC3LR0F3NFO149VKJGRJVV4KQNSO5AEMVJF66Q9ASUAAJG\\\",\\\"statusCode\\\":400,\\\"retryable\\\":false,\\\"retryDelay\\\":41.473477672272644}\"}"
  //This error hapens when we have more than 25 to batch
  // console.log("JSON string", JSON.stringify(params));
  await docClient.batchWrite(params).promise();
};

export const handler = async (event) => {
  const apiUrl = process.env.SMARTY_API_URL;
  const guildId = event.queryStringParameters.guildId;
  const gId = event.queryStringParameters.gId;
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
    const apiRes = await fetch(`${apiUrl}/info/city/${gId || guildId}`);
    const res = await apiRes.json();
    console.log("GET current Data", res);
    const currentData = await getCurrentDataByScan(guildId);
    console.log("GET Previous Data");
    const previousData = await getPreviousData(currentData, tableName);
    console.log("start batch write", previousData);
    const data = res.data.members || [];
    await batchWrite(currentData, tableName, previousData, data);
    console.log("batch write finished");
    response.body = JSON.stringify({ message: "Write completed!" });
  } catch (error) {
    console.log("error whole", error);
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "Could not perform the operation, try again.",
      error: JSON.stringify(error),
    });
  }
  return response;
};
