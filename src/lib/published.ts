// An entry goes live once its `date` arrives, so scheduling is a matter of
// dating it in the future and letting the first build on or after that day pick
// it up. `draft: true` holds an entry back no matter what its date says.
//
// Shared by the site (src/lib/utils.ts) and scripts/sync-standard.js so the
// Standard records always match what production actually serves.
export function isLive(data: { date: string; draft?: boolean | undefined }, now: number = Date.now()): boolean {
  return data.draft !== true && Date.parse(data.date) <= now;
}
