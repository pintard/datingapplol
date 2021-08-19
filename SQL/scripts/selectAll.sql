SELECT
    a.username,
    b.value as address,
    a.age,
    a.gender,
    a.hobbies,
    a.outgoing,
    a.pets
FROM
    user_table a, address_table b
WHERE
    a.id=b.id;