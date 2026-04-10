# Lead Management UI Prototype

This prototype translates `lead_management_redesign.sql` into a simple front-end structure.

## What it includes

- A lead intake form for `customers`, `tenders`, and `bidding_process`
- A stage board based on `bidding_process.current_stage`
- A selected lead detail panel
- Basic stage movement with local in-browser sample data

## Recommended production screens

1. Create Lead
2. Lead List / Stage Board
3. Lead Detail
4. Stage Checklist
5. Stage History
6. Alerts Dashboard

## Suggested API flow

- `POST /customers`
- `POST /tenders`
- `POST /bidding-process`
- `GET /leads/stage-board`
- `PATCH /bidding-process/:id/stage`
- `GET /leads/:id`

## Important schema insight

The main stage board should be driven by `bidding_process`, not directly by `tenders`.
`tenders` stores opportunity data, while `bidding_process` stores the live stage, owner, priority, due date, and stage health.
