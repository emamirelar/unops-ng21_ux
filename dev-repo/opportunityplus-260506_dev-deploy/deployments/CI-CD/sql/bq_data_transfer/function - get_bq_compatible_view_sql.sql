CREATE OR REPLACE FUNCTION bq_data_transfer.get_bq_compatible_view_sql() 
RETURNS SETOF text 
LANGUAGE plpgsql 
AS
$$
DECLARE 
    tbl_name text; 
    view_name text; 
    dynamic_select_cols text; 
    create_view_sql text; 
-- The DECLARE section ends here.
BEGIN -- The function body starts here

    -- Iterate over all tables in the public schema 
    FOR tbl_name IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE' 
        AND table_name NOT IN ('sample_table1' , '__EFMigrationsHistory' , 'SomeOtherName' , 'someothername' , 'ErrorLogs', 'AspNetRoles', 'AspNetUsers', 'AspNetUserRoles', 'AspNetRoleClaims', 'AspNetUserClaims', 'AspNetUserLogins', 'AspNetUserTokens', 'RdatUserRole') 
    LOOP 
        -- view_name := tbl_name || '_bq_dts_view'; 
        view_name := tbl_name; 
        
        -- Generate the safe, BQ-compliant column selection SQL for the current table 
        SELECT 
        INTO dynamic_select_cols 
            STRING_AGG( 
                CASE 
                    WHEN data_type IN ('timestamp with time zone', 'timestamp without time zone') 
                    THEN -- Truncate to second precision and handle nulls/infinity/pre-1970 dates 
                    'CASE WHEN ' || quote_ident(column_name) || ' IS NULL THEN NULL WHEN NOT isfinite(' 
                        || quote_ident(column_name) || ') THEN NULL WHEN ' 
                        || quote_ident(column_name) || ' < ''1970-01-01 00:00:00''::timestamptz THEN NULL ELSE DATE_TRUNC(''second'', ' 
                        || quote_ident(column_name) || ') END AS ' 
                        || quote_ident(column_name) 
                        
                    WHEN data_type = 'date' 
                    THEN -- Handle nulls/infinity for date types 
                    'NULLIF(NULLIF(' || quote_ident(column_name) 
                        || ', ''infinity''::date), ''-infinity''::date) AS ' 
                        || quote_ident(column_name) 
                    ELSE quote_ident(column_name) 
                    END
                    , ', ' 
                    ORDER BY ordinal_position 
            ) 
        FROM information_schema.columns 
        WHERE table_name = tbl_name AND table_schema = 'public';                 
        
        -- Check if columns were found 
        IF dynamic_select_cols IS NOT NULL 
        THEN 
            -- Assemble the final CREATE VIEW statement 
            create_view_sql := 'CREATE OR REPLACE VIEW bq_data_transfer.' 
            || quote_ident(view_name) 
            || ' AS SELECT ' 
            || dynamic_select_cols 
            || ' FROM public.' 
            || quote_ident(tbl_name) 
            || ';'; 
            
            -- Instead of EXECUTE, RETURN the SQL string 
            RETURN NEXT create_view_sql; 
        END IF; 
    END LOOP;       
END;
$$