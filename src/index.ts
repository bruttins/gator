import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands.js";
import { handlerLogin, handlerRegister, handlerReset, handlerUsers } from "./commands/users.js";

async function main() {
  const commandRegistry: CommandsRegistry = {};
  registerCommand(commandRegistry, 'login', handlerLogin);
  registerCommand(commandRegistry, 'register', handlerRegister);
  registerCommand(commandRegistry, 'reset', handlerReset);
  registerCommand(commandRegistry, 'users', handlerUsers);
  const argv = process.argv;
  const args = argv.slice(2);
  if (args.length === 0) {
    console.log("No command provided");
    process.exit(1);
  }
  const cmdName = args[0];
  const cmdArgs = args.slice(1);

  try {
    await runCommand(commandRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();