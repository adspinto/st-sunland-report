import AWS from "aws-sdk";
const s3 = new AWS.S3();

const uploadWeeklyToS3 = async (obj, guildId) => {
  var buf = Buffer.from(JSON.stringify(obj));
  const filename = `${guildId}/weekly/${Date.now()}.json`;
  const data = {
    Bucket: "reports-st",
    Key: filename,
    Body: buf,
    ContentEncoding: "base64",
    ContentType: "application/json"
  };

  return s3.upload(data).promise();
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
    const apiRes = await fetch(`${apiUrl}/info/city/${gId || guildId}`);
    console.log("getting smarty data");
    const res = await apiRes.json();
    if(apiRes.ok){
      await uploadWeeklyToS3(res, guildId);
    }
    response.body = JSON.stringify({ message: "Write and delete completed!" });
    return response
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
