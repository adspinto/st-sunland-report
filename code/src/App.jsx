window.global ||= window;
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import Router from "./Route";
import { Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";

Auth.configure({
  region: "us-east-2",
  userPoolId: "us-east-2_gNlKBV2Io",
  userPoolWebClientId: "3blk1m5ddm5huff5h5qlr7b9r5",
  authenticationFlowType: "USER_PASSWORD_AUTH",
});

const queryClient = new QueryClient();
const configurationOptions = {
  hideSignUp: true,
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default withAuthenticator(App, configurationOptions);
