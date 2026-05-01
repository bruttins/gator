import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands.js";
import { handlerLogin } from "./commands/users.js";

function main() {
  const commandRegistry: CommandsRegistry = {};
  registerCommand(commandRegistry, 'login', handlerLogin);
  const argv = process.argv;
  const args = argv.slice(2);
  if (args.length === 0) {
    console.log("No command provided");
    process.exit(1);
  }
  const cmdName = args[0];
  const cmdArgs = args.slice(1);

  try {
    runCommand(commandRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    process.exit(1);
  }
}

main();