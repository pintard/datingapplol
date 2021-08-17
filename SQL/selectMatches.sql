-- SELECT * FROM user_table WHERE

SELECT
    interest, hobbies
FROM
    user_table
WHERE
    EXISTS (
        SELECT 
    )