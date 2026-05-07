# Smoke Test Checklist (Phase 5-8)

Quick manual verification after `npm run db:push` and `npm run dev`.

## 1) Database and Build Baseline

- [ ] Run `npm run db:generate` without errors.
- [ ] Run `npm run db:push` and confirm new fields/models are applied.
- [ ] Run `npm run check` and ensure lint/type/test/build pass.

## 2) Bookmark Folders

- [ ] Login as student and open `Bookmarks` page.
- [ ] Create a new folder (e.g. `Research 2026`).
- [ ] Confirm folder appears as filter chip.
- [ ] Add bookmark from any approved work and verify bookmark list loads.
- [ ] Switch folder filter and verify visible cards update correctly.

## 3) Profile Enrichment

- [ ] Open student `Settings` and set `bio`, `socialLinks`, `interests`; save.
- [ ] Open student `Profile` and confirm new fields are displayed.
- [ ] Login as supervisor and repeat update in supervisor settings.
- [ ] Open supervisor `Profile` and confirm new fields are shown.

## 4) Supervisor Bulk Decision

- [ ] Login as supervisor and open `Supervisor -> Assigned`.
- [ ] Select multiple works via checkboxes.
- [ ] Enter review template text.
- [ ] Click bulk `approve`; verify selected rows disappear from queue.
- [ ] Repeat with bulk `return` and verify queue updates.
- [ ] Login as affected student and verify notification is created.

## 5) Admin Moderation + Audit + Health

- [ ] Login as admin and call moderation endpoint on a work:
  - `PATCH /api/admin/works/{id}/flag` with `{ "moderationFlag": true }`
- [ ] Confirm `GET /api/admin/works?flagged=true` returns flagged work.
- [ ] Open `Admin -> Reports` and verify:
  - [ ] health widget shows DB/ES status
  - [ ] audit list renders latest actions
- [ ] Ensure moderation flag action appears in `/api/admin/audit`.

## 6) Regression Safety

- [ ] Open `Search`, `Upload`, `Work detail`, and `Notifications` pages.
- [ ] Confirm no obvious UI break in light and dark modes.
- [ ] Verify existing auth roles still guard admin/supervisor routes correctly.

## Notes

- Existing ESLint warnings (`react-hooks/exhaustive-deps`, `no-img-element`) are pre-existing and non-blocking for build.
- Recommended before deployment: run this checklist against staging data with at least one admin, one supervisor, and one student account.
