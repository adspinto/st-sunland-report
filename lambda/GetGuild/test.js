console.log("running node to test func");
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
console.log(investPerLevel);
const item = {
  level: 69,
  invst: 15772366200,
};

const find = {
  level: 69,
  invst: 15225066200,
};

const t = () => {
  if (find) {
    const diffInvest = item.invst - find.invst;
    console.log("diffInvest", diffInvest);
    const findLevel = investPerLevel.find(
      (value) => item.level.toString().split("")[0] === value.levelRange
    );
    console.log("findLevel", findLevel);
    console.log(" diffInvest / findLevel.value", diffInvest / findLevel.value);
  }
};

t();
