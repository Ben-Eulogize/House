# Workflow audit checkpointing — don't lose a fleet to a spend limit

## The failure mode

A Workflow `agent()` returns its result **only** when the subagent calls its final
`StructuredOutput` tool. If the agent is killed first (monthly spend limit, rate limit,
API error after retries), `agent()` returns `null` and **every finding it formed is lost**
— even though the tokens were already spent rendering crops, reading code, and reasoning.

The harness caches **completed** agents to `journal.jsonl` (a resume replays them for free),
so the gap is only agents that never finished. Observed twice on this project: a room audit
where 2 of 6 zones finished (26 findings recovered + applied) and 4 died young (nothing),
then a re-run where all 4 died instantly at the account-level cap (nothing).

## Fix 1 — incremental durable checkpointing (biggest win)

Instruct each agent, in its prompt, to append every finding to an on-disk JSONL **the moment
it forms it**, before moving on — via a Bash call:

    printf '%s\n' '{"room":"KITCHEN","aspect":"fixture","defect":"...","fix":"...","confidence":"high"}' >> "$SP/findings-<zone>.jsonl"

Then the final `StructuredOutput` is a convenience, not the only copy. On any failure,
harvest every `findings-*.jsonl` in the scratchpad and adjudicate in the main loop.

## Fix 2 — smaller units

One agent per ROOM (or per dimension), not per zone. A killed agent loses one room; every
finished room already flushed to the journal AND its checkpoint file.

## Fix 3 — pre-render crops in the main loop

The agents spend most of their tokens rendering PDF crops. Render them ONCE in the main
loop (cheap, no subagent), save to the scratchpad, and tell agents to READ the existing
crops. Cuts subagent burn so the fleet gets further per dollar and re-runs are near-free.

## The account-level cap is the real ceiling

"You've hit your monthly spend limit" is an **account** limit — it caps subagent fleets
regardless of model tier. Switching the main model to Opus keeps the interactive chat alive
(it has separate headroom) but does NOT refill the subagent pool. Until the limit resets or
is raised, the robust path is: main-loop work with cached crops + the checkpoint pattern for
when fleets run again.

## Harvest recipe (any partially-failed run)

    # 1. checkpoint files (if the agents were checkpoint-instructed)
    cat "$SP"/findings-*.jsonl
    # 2. otherwise, mine the per-agent transcripts for whatever they wrote before dying
    #    (agent-*.jsonl in the workflow transcript dir — assistant text + any StructuredOutput input)
    # 3. completed agents are already in journal.jsonl (resume replays them free)
