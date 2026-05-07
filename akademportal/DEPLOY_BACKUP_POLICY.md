# Backup and Restore Policy

## Scope
- PostgreSQL database (`DATABASE_URL`)
- User-uploaded work files (stored in DB as `Work.fileData`)

## Backup Schedule
- Daily full logical backup at 02:00 server time.
- Retention:
  - Daily backups: 14 days
  - Weekly backups: 8 weeks
  - Monthly backups: 6 months

## Restore Drill
- Run restore test at least once per month in staging.
- Success criteria:
  - Backup archive is readable.
  - App boots successfully with restored DB.
  - Random sample of 20 works can be downloaded.

## Operational Steps
1. Pause write traffic (maintenance mode).
2. Create DB dump (`pg_dump`) and store in encrypted bucket.
3. Verify checksum and backup metadata.
4. Resume traffic.

## Incident Recovery
1. Point service to standby DB.
2. Restore latest valid backup.
3. Replay incremental logs if available.
4. Run health endpoint `/api/health` and smoke checks.

## Ownership
- Primary owner: Platform Admin
- Secondary owner: DevOps/Infra backup operator
