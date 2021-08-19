-- SELECT * FROM user_table WHERE

SELECT
    a.username, b.value as address, a.age, a.gender, a.hobbies, a.outgoing, a.pets
FROM
    user_table a, address_table b
WHERE
    a.id=b.id
    AND
    age BETWEEN 19 and 40
    AND
    gender in ('woman')
    AND
    hobbies='walking'
    AND
    outgoing='no'
    AND
    pets='cat';