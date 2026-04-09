/*
 * cli/cli.extension.runner.ts
 *
 * CLI entry point for extensions that expose terminal features.
 * Only required if cliSupport: true in manifest.json.
 *
 * Invoked by: blackvideo-ext cli run {{extension-id}} [args...]
 */

export interface CliContext {
  args:   string[];
  extId:  string;
  log:    (msg: string) => void;
  error:  (msg: string) => void;
}

/**
 * Main CLI handler. Receives parsed arguments and a logging context.
 * Return false to signal failure (non-zero exit code).
 */
export default async function runCli(ctx: CliContext): Promise<boolean> {
  const { args, log, error } = ctx;

  if (args.length === 0 || args[0] === 'help') {
    log('Usage: bv-ext cli run {{extension-id}} <command> [options]');
    log('Commands:');
    log('  help     Show this help message');
    // Add your commands here
    return true;
  }

  switch (args[0]) {
    // case 'analyze':
    //   await runAnalysis(args.slice(1), log);
    //   return true;

    default:
      error(`Unknown command: "${args[0]}". Run with "help" to see available commands.`);
      return false;
  }
}
