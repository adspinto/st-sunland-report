import { useEffect } from "react";
import { useQuery } from "react-query";
import api from "../services/api";
import { guildData } from "../utils/mocks";
const useGuild = () => {
  const getGuild = async () =>
    new Promise((resolve) => {
      resolve(guildData);
    }); //api.get("/info/city/602c9314205dd81334f53da1");
  const query = useQuery({
    queryFn: getGuild,
    queryKey: "602c9314205dd81334f53da1",
    staleTime: 1000000,
  });
  console.log(query);
  return query;
};

export default useGuild;
