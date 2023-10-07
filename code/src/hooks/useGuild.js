import { useCallback, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import api from "../services/api";
import { Context } from "../context/AppContext";
import { useSearchParams } from "react-router-dom";

const useGuild = () => {
  const { user } = useContext(Context);
  const [searchParams] = useSearchParams();
  const [guild, setGuildId] = useState("");

  useEffect(() => {
    try {
      if (user["custom:guildId"]) {
        const guildIdfromParam = searchParams.get("guildId");
        const guildId = user["custom:guildId"].split(",");
        let currentGuildId = "";
        if (guildId.includes(guildIdfromParam)) {
          currentGuildId = guildIdfromParam;
        } else {
          currentGuildId = guildId[0];
        }

        setGuildId(currentGuildId);
      }
    } catch (error) {
      console.log("error no split", error, user);
    }
  }, [searchParams, user]);
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
    const response = await api.get(`/guild?guildId=${guild}`);

    return response.data;
  };

  const query = useQuery({
    queryFn: getGuild,
    queryKey: "602c9314205dd81334f53da1",
    refetchOnWindowFocus: false,
    select: useCallback((data) => data.map((item) => parseData(item)), []),
    enabled: !!guild,
  });
  return query;
};

export default useGuild;
