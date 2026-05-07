DO $$
DECLARE
	v_user_id INTEGER;
	v_role_id INTEGER;
BEGIN
	-- Get the user ID for tafazzulm@unops.org if it exists
	SELECT "Id" INTO v_user_id
	FROM public."AspNetUsers"
	WHERE LOWER("Email") = LOWER('tafazzulm@unops.org') OR LOWER("UserName") = LOWER('tafazzulm@unops.org')
	LIMIT 1;
	
	-- Only proceed if user exists
	IF v_user_id IS NOT NULL THEN
		-- Get the SYSTEM_ADMIN role ID
		SELECT "Id" INTO v_role_id
		FROM public."AspNetRoles"
		WHERE UPPER("Name") = UPPER('SYSTEM_ADMIN')
		LIMIT 1;
		
		-- Only proceed if role exists
		IF v_role_id IS NOT NULL THEN
			-- Check if the user already has the role
			IF NOT EXISTS (
				SELECT 1 
				FROM public."AspNetUserRoles" 
				WHERE "UserId" = v_user_id AND "RoleId" = v_role_id
			) THEN
				-- Add user to SYSTEM_ADMIN role
				INSERT INTO public."AspNetUserRoles" ("UserId", "RoleId")
				VALUES (v_user_id, v_role_id);
				
				RAISE NOTICE 'Successfully granted SYSTEM_ADMIN role to tafazzulm@unops.org';
			ELSE
				RAISE NOTICE 'User tafazzulm@unops.org already has SYSTEM_ADMIN role';
			END IF;
		ELSE
			RAISE NOTICE 'SYSTEM_ADMIN role not found in database';
		END IF;
	ELSE
		RAISE NOTICE 'User tafazzulm@unops.org not found in database';
	END IF;
END $$;