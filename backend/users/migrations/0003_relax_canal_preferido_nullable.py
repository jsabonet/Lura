from django.db import migrations


SQL = r'''
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users_user' AND column_name = 'canal_preferido'
    ) THEN
        -- Allow NULLs so inserts that don't specify this legacy column succeed
        ALTER TABLE users_user ALTER COLUMN canal_preferido DROP NOT NULL;
    END IF;
END
$$;
'''


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_fix_alertas_ativados_default'),
    ]

    operations = [
        migrations.RunSQL(sql=SQL, reverse_sql=migrations.RunSQL.noop),
    ]
