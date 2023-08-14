import { useCallback } from "react";
import { useQuery } from "react-query";
import api from "../services/api";

const useGuild = () => {
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

    nextItem.invst_sofar = item.invst - item.invst_monday;
    nextItem.invst_sofar = moneyMask(nextItem.invst_sofar);
    nextItem.gld = moneyMask(nextItem.gld);
    nextItem.invst = moneyMask(item.invst);
    nextItem.invst_monday = moneyMask(item.invst_monday);
    nextItem.joined = formatDate(nextItem.joined);
    nextItem.activity = formatDate(nextItem.activity);
    if (nextItem.percent_invested) {
      nextItem.percent_invested = `${(nextItem.percent_invested * 100).toFixed(
        0
      )}%`;
    }
    return nextItem;
  }, []);

  const getGuild = async () => {
    const response = await api.get("/guild?guildId=602c9314205dd81334f53da1");

    return response.data;
  };

  const query = useQuery({
    queryFn: getGuild,
    queryKey: "602c9314205dd81334f53da1",
    refetchOnWindowFocus: false,
    select: useCallback((data) => data.map((item) => parseData(item)), []),
    // staleTime: 1000000,
  });
  return query;
};

export default useGuild;
