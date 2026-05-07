-- ILIKE fallback for when similarity search returns no rows (e.g. "UN WOMEN" in "UN WOMEN United Nations Entity...")
DROP FUNCTION IF EXISTS public.retrieve_like_search(TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.retrieve_like_search(
    entity_name text,
    search_text text,
    extra_where text DEFAULT NULL
) RETURNS TABLE(entityid integer, score real, search_type text)
LANGUAGE plpgsql AS
$BODY$
DECLARE
    like_sql TEXT := '';
BEGIN
    -- Build dynamic SQL for ILIKE search across searchable columns (same table/column discovery as similarity)
    SELECT string_agg(
        format(
            'SELECT "%s"::INT AS EntityId,
                    1.0::REAL AS score,
                    %L AS search_type
             FROM public.%I
             WHERE "%s" ILIKE %L%s',
            primary_key, 'like',
            table_name, searchable_column, '%' || search_text || '%',
            CASE WHEN extra_where IS NOT NULL THEN ' AND ' || extra_where ELSE '' END
        ),
        ' UNION ALL '
    )
    INTO like_sql
    FROM (
        SELECT c.table_name, c.column_name AS searchable_column, pk.column_name AS primary_key
        FROM information_schema.columns c
        JOIN (
            SELECT tc.table_name, kc.column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kc
            ON tc.constraint_name = kc.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
        ) pk ON c.table_name = pk.table_name
        WHERE c.data_type IN ('text', 'character varying')
          AND c.column_name IN ('Name', 'Title', 'Details', 'Description', 'UserEmail')
          AND (c.table_name NOT LIKE '%Asp%' OR c.table_name = 'AspNetRoles')
          AND c.table_name NOT LIKE '%Ai%'
          AND c.table_name = entity_name
    ) search_tables;

    IF like_sql IS NOT NULL AND like_sql != '' THEN
        like_sql := like_sql || ' ORDER BY EntityId LIMIT 1';
        RETURN QUERY EXECUTE like_sql;
    END IF;
END;
$BODY$;
