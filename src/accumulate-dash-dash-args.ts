export type DashDashArgs = {
  [argName: string]: string[] | undefined;
};

const DASH_DASH_REG_EXP = /^--(.*)/;

export function accumulateDashDashArgs(...args: string[]) {
  const nonDashDashArgs: string[] = [];
  const dashDashArgs: DashDashArgs = {};
  let accumulator = nonDashDashArgs;
  for (const arg of args) {
    const dashDashMatches = arg.match(DASH_DASH_REG_EXP);
    if (dashDashMatches) {
      const argName = dashDashMatches[1].trim();
      const existingDashDashArg = dashDashArgs[argName];
      if (existingDashDashArg) {
        accumulator = existingDashDashArg;
      } else {
        dashDashArgs[argName] = accumulator = [];
      }
    } else {
      accumulator.push(arg);
    }
  }
  return {
    nonDashDashArgs,
    dashDashArgs,
  };
}
