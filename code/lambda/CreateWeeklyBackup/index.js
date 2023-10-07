import AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const uploadToS3 = async (obj, guildId) => {
  var buf = Buffer.from(JSON.stringify(obj));
  const filename = `${guildId}/${Math.floor(Date.now())}.json`;
  const data = {
    Bucket: "reports-st",
    Key: filename,
    Body: buf,
    ContentEncoding: "base64",
    ContentType: "application/json"
  };

  return s3.upload(data).promise();
};



const parseDynamoItem = (item) => {
  const obj = {};
  Object.keys(item).forEach((key) => {
    const value = item[key];

    const assigned = {
      [key]: value,
    };

    if (key == "playerId") {
      assigned.playerId = item[key];
    }

    if (key == "name") {
      assigned.playerName = item[key];
      assigned.name = item[key];
    }

    if (key == "updatedAt") {
      assigned.updatedAt = Math.floor(Date.now());
    }

    Object.assign(obj, assigned);
  });
  return obj;
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
  guildId
) => {
  const data = currentData.map((item) => {
    try {
  
      return parseDynamoItem(item);
    } catch (error) {
      console.log("error while trying to backup", error);
      return parseDynamoItem(item);
    }
  });

  // const params = {
  //   RequestItems: {
  //     [tableName]: data,
  //   },
  // };
  // at 'requestItems' failed to satisfy constraint: Map value must satisfy constraint: [Member must have length less than or equal to 25, Member must have length greater than or equal to 1]\\\",\\\"code\\\":\\\"ValidationException\\\",\\\"[__type]\\\":\\\"See error.__type for details.\\\",\\\"time\\\":\\\"2023-09-30T20:59:39.185Z\\\",\\\"requestId\\\":\\\"Q88O46SC3LR0F3NFO149VKJGRJVV4KQNSO5AEMVJF66Q9ASUAAJG\\\",\\\"statusCode\\\":400,\\\"retryable\\\":false,\\\"retryDelay\\\":41.473477672272644}\"}"
  //This error hapens when we have more than 25 to batch
  // console.log("JSON string", JSON.stringify(params));
  // await docClient.batchWrite(params).promise();

  await uploadToS3(data, guildId);
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
    // console.log("starting the request");
    // const apiRes = await fetch(`${apiUrl}/info/city/${gId || guildId}`);
    // const res = await apiRes.json();
    // console.log("GET current Data", res);
    const currentData = await getCurrentDataByScan(guildId);
    console.log("start batch write");
    // const data = res.data.members || [];
    await batchWrite(currentData, guildId);
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
