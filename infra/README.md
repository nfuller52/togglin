# IMPORTANT

Ensure the user connecting to the db CAN NOT bypass RLS

```sql
ALTER ROLE togglin_db_user NOSUPERUSER NOBYPASSRLS;
```
