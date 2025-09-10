from django.db import migrations


SQL = r'''
DO $$
BEGIN
    -- Check if the column exists
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users_user' AND column_name = 'alertas_ativados'
    ) THEN
        -- Backfill any NULLs to FALSE
        UPDATE users_user SET alertas_ativados = FALSE WHERE alertas_ativados IS NULL;
        -- Ensure a default value for future inserts
        ALTER TABLE users_user ALTER COLUMN alertas_ativados SET DEFAULT FALSE;
    END IF;
END
$$;
'''


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(sql=SQL, reverse_sql=migrations.RunSQL.noop),
    ]
