import AWS from "aws-sdk";
// import fs from "fs"
const s3 = new AWS.S3();
// const docClient = new AWS.DynamoDB.DocumentClient();

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

const deriveResponse = (current, next) => {
  const currentMembers = current;
  const nextMembers = next;
  return nextMembers.map((item, index) => {
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
      if (index === 0) {
        console.log("derive", state);
      }

      return state;
    } catch (error) {
      console.log("error", error);
      item.invst_monday = find.invst;
      item.bount_week = item.bounty;
      return item;
    }
  });
};

const parseMembers = async (list = []) => {
  return Promise.all(
    list.map(async (item, index) => {
      try {
        // console.log("ittttem", item);
        const nextIndex = index + 1;
        console.log(index, nextIndex);
        if (nextIndex < list.length) {
          const next = deriveResponse(item.members, list[nextIndex].members);
          item.members = next;
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
    console.log("Starting process");
    const weeklyList = await listObjects(`${guildId}/weekly`);

    const objects = await Promise.all(
      weeklyList.Contents.filter((fItem) => fItem.Size).map((item) =>
        getObject(item.Key)
      )
    );

    const parsedObjects = objects.map((item, index) => {
      const itemToString = item.Body.toString("utf-8");
      const currentWeek = weeklyList.Contents[index];
      const inputString = currentWeek.Key;
      // Split the string by '/' to get parts of the path
      const parts = inputString.split("/");

      // Get the last part, which is the JSON file name
      const jsonFileName = parts[parts.length - 1];

      // Remove the ".json" extension
      const fileNameWithoutExtension = jsonFileName.replace(".json", "");
      const parsed = JSON.parse(itemToString);
      return {
        members: parsed.data.members,
        date: fileNameWithoutExtension,
      };
    });
    const members = await parseMembers(parsedObjects);
    response.body = JSON.stringify(members);
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
// const saveDynamo = async () => {
//   console.log("get dyanom");
//   const params = {
//     TableName: "6282e355ddc01812f52e04f3",
//   };
//   const response = await docClient.scan(params).promise();
//   console.log(response.Items);


//   fs.writeFile("date.json", JSON.stringify(response.Items), (err) => {
//     if (err) console.log(err);
//     else {
//       console.log("File written successfully\n");
//       console.log("The written has the following contents:");
//       // console.log(fs.readFileSync("books.txt", "utf8"));
//     }
//   });
// };
// await saveDynamo();
