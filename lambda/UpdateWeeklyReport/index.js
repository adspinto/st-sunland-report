import AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();

const getPreviousDataByScan = async (guildId) => {
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
    
    if(key === "invst") {
      assigned.invst_monday = value;  
    }
    
    if(key === "bounty") {
      assigned.bounty_monday = value;
    }
    
    assigned.updatedAt = Math.floor(Date.now() / 1000);

    Object.assign(obj, assigned);
  });

  const params = {
    PutRequest: {
      Item: obj,
    },
  };

  return params;
};

const batchWrite = async (res, guildId) => {
  const data = res.data.members.map((item) => {
    return parseDynamoItem(item);
  });
  const params = {
    RequestItems: {
      [guildId]: data,
    },
  };
  console.log(JSON.stringify(params))
  await docClient.batchWrite(params).promise();
};

const batchDelete = async (res, guildId, previousData) => {
  const ids = res.data.members.map((item) => item._id);
  const data = previousData
    .filter((pItem) => !ids.includes(pItem._id))
    .map((item) => {
      return {
        DeleteRequest: {
          Key: { playerId: item.playerId, playerName: item.playerName },
        },
      };
    });
  const params = {
    RequestItems: {
      [guildId]: data,
    },
  };

  if (data.length > 0) {
    await docClient.batchWrite(params).promise();
  }
};

const batchDelete = async (res, guildId, previousData) => {
  const ids = res.data.members.map((item) => item._id);
  const data = previousData
    .filter((pItem) => !ids.includes(pItem._id))
    .map((item) => {
      return {
        DeleteRequest: {
          Key: { playerId: item.playerId, playerName: item.playerName },
        },
      };
    });
  const params = {
    RequestItems: {
      [guildId]: data,
    },
  };

  if (data.length > 0) {
    await docClient.batchWrite(params).promise();
  }
};

export const handler = async (event) => {
  const apiUrl = process.env.SMARTY_API_URL;
  const guildId = event.queryStringParameters.guildId;
  const gId = event?.queryStringParameters?.gId;
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
    console.log("get previousData");
    const previousData = await getPreviousDataByScan(guildId);
    console.log("batch write start");
    await batchWrite(res, guildId);
    console.log("batch write finished");
    console.log("batch delete start");
    await batchDelete(res, guildId, previousData);
    console.log("batch delete finish");

    response.body = JSON.stringify({ message: "Write and delete completed!" });
  } catch (error) {
    console.log("error in the first catch", error);
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "Could not perform the operation, try again.",
      error: JSON.stringify(error),
    });
  }
  return response;
};
