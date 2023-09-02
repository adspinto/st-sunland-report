import AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();
const investPerLevel = [
  {
    levelRange: "4",
    value: 75000000,
  },
  {
    levelRange: "5",
    value: 150000000,
  },
  {
    levelRange: "6",
    value: 250000000,
  },
  {
    levelRange: "7",
    value: 400000000,
  },
  {
    levelRange: "8",
    value: 5000000000,
  },
];

const parseDynamoItems = (res, guildId) => {
  const items = res.data.members.map((member) => {
    return {
      playerId: member._id,
      playerName: member.name,
    };
  });

  return {
    RequestItems: {
      [guildId]: {
        Keys: items,
      },
    },
    ConsistentRead: false,
  };
};
// "error": "{\"message\":\"Missing required key 'TableName' in params\",\"code\":\"MissingRequiredParameter\",\"time\":\"2023-08-16T13:41:34.150Z\"}"

const query = async (res, guildId) => {
  const params = parseDynamoItems(res, guildId);
  const items = await docClient.batchGet(params).promise();
  return res.data.members.map((item) => {
    try {
      const find = items.Responses[process.env.TABLE_NAME].find((value) => value._id === item._id);
      const state = {
        ...item,
      };
      if (find) {
        state.invst_monday = find.invst;
        const diffInvest = item.invst - find.invst;
        state.bount_week = item.bounty - find.bounty;
        const findLevel = investPerLevel.find(
          (value) => item.level.toString().split("")[0] === value.levelRange
        );
        state.percent_invested = diffInvest / findLevel.value;
      }

      return state;
    } catch (error) {
      console.log("error", error);
      return item;
    }
  });
};

export const handler = async (event) => {
  const apiUrl = process.env.SMARTY_API_URL;
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
    const apiRes = await fetch(`${apiUrl}/info/city/${guildId}`);
    const res = await apiRes.json();
    const data = await query(res, guildId);
    response.body = JSON.stringify(data);
  } catch (error) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "Could not perform the operation, try again.",
      error: JSON.stringify(error),
    });
  }
  return response;
};
