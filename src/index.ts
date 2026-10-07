import { db } from "./db";
import { users } from "./db/schema";

(async () => {
  const res = await db.select().from(users);

  console.log(res);
  process.exit();
})();
