export const parseDynamoItemsGET = (res, tableName) => {
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

export const valuesToStoreMultiple = (key, value, previousValue) => {
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

export const parseDynamoItem = (item, find = {}) => {
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

    assigned.updatedAt = previousValue?.updatedAt
      ? JSON.stringify([previousValue.updatedAt, Math.floor(Date.now() / 1000)])
      : JSON.stringify([Math.floor(Date.now() / 1000)]);

    Object.assign(obj, assigned);
  });
  return {
    PutRequest: {
      Item: obj,
    },
  };
};

export const getResponseConfig = (event) => {
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

  return { response, guildId, apiUrl, tableName };
};
