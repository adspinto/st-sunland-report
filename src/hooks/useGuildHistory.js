import { useCallback, useContext } from "react";
import { useQuery } from "react-query";
import api from "../services/api";
import { Context } from "../context/AppContext";
import { useQueryClient } from "react-query";

const useGuildHistory = () => {
  const { user } = useContext(Context);
  const guildId = user["custom:guildId"];
  const queryClient = useQueryClient();

  const formatDate = useCallback((date) => {
    try {
      const d = new Date(date);
      const day = d.getDate();
      const month = d.getMonth();
      const year = d.getFullYear();
      return `${day.toString().length <= 1 ? "0" + day : day}/${
        month.toString().length <= 1 ? "0" + month : month
      }/${year}`;
    } catch (error) {
      return date;
    }
  }, []);
  const moneyMask = useCallback((value) => {
    try {
      const stringvalue = value.toString();
      const tvalue = stringvalue.split("").reverse();

      const fvalue = tvalue.map((item, index) => {
        if (index % 3 === 0 && index !== 0) {
          return item + ",";
        }
        return item;
      });
      return fvalue.reverse().join("");
    } catch (error) {
      return value;
    }
  }, []);
  const parseData = useCallback((item) => {
    const nextItem = item;

    const invst_sofar = item.invst.map((sitem, index) => {
      if (item.invst?.[index - 1]) {
        return sitem - item.invst[index - 1];
      }
      return sitem;
    });
    console.log("guildData", invst_sofar);

    nextItem.invst_sofar = invst_sofar;
    // nextItem.invst_sofar = moneyMask(nextItem.invst_sofar);
    nextItem.gld = nextItem.gld.map((item) => moneyMask(item));
    nextItem.invst = nextItem.invst.map((item) => moneyMask(item));
    nextItem.invst_monday = nextItem.invst_monday.map((item) =>
      moneyMask(item)
    );

    return nextItem;
  }, []);

  const getGuildHistory = async () => {
    const response = await api.get(`/guild/history?guildId=${guildId}`);

    return response.data;

    // return [
    //   {
    //     _id: "60490ddb14b7281331a5b887",
    //     name: "LaisSouza#92353",
    //     level: [70],
    //     rank: 2,
    //     joined: 1615640193691,
    //     lot: 8,
    //     score: 93539,
    //     quEvComp: 1951,
    //     quEvId: "3d242b26-7855-4650-936b-6ddfe4fa80f2",
    //     activity: 1696096662855,
    //     gld: [61188563986],
    //     invst: [83574216200],
    //     help: [7708],
    //     prest: [73120],
    //     bounty: [5612],
    //     master: 253,
    //     ascendUpg: [474],
    //     collection: [5893],
    //     invst_monday: [81074216200],
    //     bount_week: [44],
    //     percent_invested: 6.25,
    //   },
    //   {
    //     _id: "604607d8b83956132b9a3f5e",
    //     name: "Zenan1999#85950",
    //     level: [71],
    //     rank: 1,
    //     joined: 1615991008225,
    //     lot: 5,
    //     score: 116145,
    //     quEvComp: 1424,
    //     quEvId: "3d242b26-7855-4650-936b-6ddfe4fa80f2",
    //     activity: 1696097295202,
    //     gld: [63470257277],
    //     invst: [33391616200],
    //     help: [8075],
    //     prest: [94050],
    //     bounty: [2924],
    //     master: 467,
    //     ascendUpg: [736],
    //     collection: [10842],
    //     invst_monday: [33391616200],
    //     bount_week: [13],
    //     percent_invested: 0,
    //   },
    // ];
  };

  const query = useQuery({
    queryFn: getGuildHistory,
    queryKey: ["history", guildId],
    refetchOnWindowFocus: false,
    select: useCallback((data) => data.map((item) => parseData(item)), []),
    enabled: !!guildId,
  });
  return query;
};

export default useGuildHistory;
