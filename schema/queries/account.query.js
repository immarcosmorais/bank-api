import { GraphQLList } from "graphql";
import Account from "./types/Account.js";
import AccountService from "../../services/account.service.js";

const accountQueries = {
  allAccounts: {
    type: new GraphQLList(Account),
    resolve: () => AccountService.all(),
  },
};

export default accountQueries;
