import { useEffect } from "react";
import { useQuery } from "react-query";
import api from "../services/api";
import { guildData } from "../utils/mocks";
const useGuild = () => {
  const getGuild = async () => {
    const response = await api.get("/guild?guildId=602c9314205dd81334f53da1");
    return response.data;
  };
  // useEffect(() => {
  //  ( async () => {
  //   const response = await getGuild();
  //   console.log(response);
  // })();
  // }, []);
  const query = useQuery({
    queryFn: getGuild,
    queryKey: "602c9314205dd81334f53da1",
    refetchOnWindowFocus: false,
    // staleTime: 1000000,
  });
  console.log(query);
  return query;
};

export default useGuild;
