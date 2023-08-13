import AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();

const investPerLevel = [
  {
    levelRange: 40,
    value: 75,
  },
  {
    levelRange: 50,
    value: 150,
  },
  {
    levelRange: 60,
    value: 250,
  },
  {
    levelRange: 70,
    value: 400,
  },
];

function isMonday() {
  return new Date().getDay() === 1;
}

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

const batchWrite = async (res) => {
  const shouldWrite = isMonday();
  if (shouldWrite) {
    const data = res.data.members.map((item) => parseDynamoItem(item));
    const params = {
      RequestItems: {
        [process.env.TABLE_NAME]: data,
      },
    };

    await docClient.batchWrite(params).promise();
  }
};

const scan = async (res) => {
  const params = {
    TableName: process.env.TABLE_NAME,
  };
  const items = await docClient.scan(params).promise();
  return res.data.members.map((item) => {
    try {
      const find = items.Items.find((value) => value._id === item._id);
      const state = {
        ...item,
      };
      if (find) {
        state.invst_monday = find.invst;
        const diffInvest = item.invst - find.invst;
        const findLevel = investPerLevel.find(
          (value) => item.level - value.levelRange < 10
        );
        state.percent_invested = findLevel.value / diffInvest;
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
    body: JSON.stringify(apiUrl),
  };
  try {
    const apiRes = await fetch(`${apiUrl}/info/city/${guildId}`);
    const res = await apiRes.json();
    await batchWrite(res);
    const data = await scan(res);
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
