import AWS from "aws-sdk";
const s3 = new AWS.S3();

const listObjects = async (guildId) => {
  const data = {
    Bucket: "reports-st",
    Delimiter: "/",
    Prefix: `${guildId}/`,
  };

  return s3.listObjects(data).promise();
};

const getObject = (key) => {
  const data = {
    Bucket: "reports-st",
    Key: key,
  };
  return s3.getObject(data).promise();

}
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
    const list = await listObjects(guildId);
    const objects = await Promise.all(list.Contents.filter((fItem) => fItem.Size).map((item) => getObject(item.Key)));
    response.body = JSON.stringify(objects);
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
