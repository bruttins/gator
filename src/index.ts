import { setUser, readConfig } from "./config.js";

function main() {
  const user = setUser('Rinin');
  const currentUserOnDisk = readConfig();
  console.log(currentUserOnDisk);
}

main();