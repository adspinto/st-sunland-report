import AWS from "aws-sdk";
const s3 = new AWS.S3();

const apiUrl = process.env.SMARTY_API_URL;

const getObject = async (key) => {
  const data = {
    Bucket: "reports-st",
    Key: key,
  };
  return s3.getObject(data).promise();
};

const listObjects = async (guildId) => {
  const data = {
    Bucket: "reports-st",
    Delimiter: "/",
    Prefix: `${guildId}/`,
  };

  return s3.listObjects(data).promise();
};

const uploadCacheToS3 = async (obj, guildId) => {
  var buf = Buffer.from(JSON.stringify(obj));
  const filename = `${guildId}/cache.json`;
  const data = {
    Bucket: "reports-st",
    Key: filename,
    Body: buf,
    ContentEncoding: "base64",
    ContentType: "application/json",
  };

  return s3.upload(data).promise();
};

const deriveResponse = async (current, next) => {
  const currentMembers = current;
  const nextMembers = next;
  return nextMembers.map((item) => {
    try {
      const find = currentMembers.find((value) => value._id === item._id);
      const state = {
        ...item,
        invst_monday: item.invst,
        bount_week: item.bounty,
      };
      if (find) {
        state.invst_monday = find.invst;
        state.bount_week = item.bounty - find.bounty;
      }

      return state;
    } catch (error) {
      console.log("error", error);
      return item;
    }
  });
};

const cacheData = async (apiUrl, guildId) => {
  const apiRes = await fetch(`${apiUrl}/info/city/${guildId}`);
  const res = await apiRes.json();
  await uploadCacheToS3(res, guildId);
  return res;
};

const parseMembers = async (membersList = []) => {
  return Promise.all(
    membersList.map(async (item, index) => {
      try {
        console.log(item);
        const nextIndex = index + 1;
        if (nextIndex < membersList.length) {
          const next = await deriveResponse(item, membersList[nextIndex]);
          return next;
        }
        return item;
      } catch (error) {
        return item;
      }
    })
  );
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
    body: JSON.stringify(apiUrl),
  };
  try {
    console.log("failed here");
    const weeklyList = await listObjects(`${guildId}/weekly`);
    console.log("or failed here", weeklyList);
    const objects = await Promise.all(
      weeklyList.Contents.filter((fItem) => fItem.Size).map((item) =>
        getObject(item.Key)
      )
    );

    const parsedObjects = objects.map((item, index) => {
      const itemToString = item.Body.toString("utf-8");
      const currentWeek = weeklyList.Contents[index] ;
      const inputString = currentWeek.Key
      // Split the string by '/' to get parts of the path
      const parts = inputString.split('/');

      // Get the last part, which is the JSON file name
      const jsonFileName = parts[parts.length - 1];

      // Remove the ".json" extension
      const fileNameWithoutExtension = jsonFileName.replace('.json', '');
      const parsed = JSON.parse(itemToString);
      return {
        members: parsed.data.members,
        date: fileNameWithoutExtension
      };
    });

    console.log("finish parsing");
    const membersOnly = await parseMembers(parsedObjects.members);
    parsedObjects.members = membersOnly
    
    response.body = JSON.stringify(parsedObjects);
    return response;
  } catch (error) {
    console.log("error", error);
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "Could not perform the operation, try again.",
      error: JSON.stringify(error),
    });
  }
  return response;
};

// const event = {
//   queryStringParameters: {
//     guildId: "60d09216ce4acb13323a1109",
//   },
// };
// handler(event);
