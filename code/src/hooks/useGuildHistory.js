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
      const d = new Date(date * 1000);
      const day = d.getDate();
      const month = d.getMonth() + 1;
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
  const parseKeyData = useCallback((item) => {
    const nextItem = item;

    nextItem.parsed = formatDate(nextItem.key / 1000);
    // nextItem.invst_sofar = invst_sofar;
    // nextItem.invst_sofar = nextItem.invst_sofar.map((item) => moneyMask(item));
    // nextItem.gld = nextItem.gld.map((item) => moneyMask(item));
    // nextItem.invst = nextItem.invst.map((item) => moneyMask(item));
    // nextItem.invst_monday = nextItem.invst.map((item) => moneyMask(item));
    // nextItem.updatedAt = nextItem.updatedAt.map((item) => formatDate(item));

    return nextItem;
  }, []);

  const getGuildHistory = async () => {
    const response = await api.get(`/guild/history?guildId=${guildId}`);

    return response.data;
  };

  const getGuildHistoryObject = async () => {
    
  }

  const query = useQuery({
    queryFn: getGuildHistory,
    queryKey: ["history", guildId],
    refetchOnWindowFocus: false,
    select: useCallback((data) => data.map((item) => parseKeyData(item)), []),
    enabled: !!guildId,
  });
  return {
    historyKeys: query.data,
  };
};

export default useGuildHistory;
