export { user, type User, type NewUser } from "./user";
export { session, type Session, type NewSession } from "./session";
export { account, type Account, type NewAccount } from "./account";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export {
  verification,
  type Verification,
  type NewVerification,
} from "./verification";
export { guest, type Guest, type NewGuest } from "./guest";
