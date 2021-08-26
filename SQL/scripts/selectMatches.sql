-- SELECT MATCH TEST

SELECT
    a.username, b.value as address, a.age, a.gender,
    a.hobbies, a.outgoing, a.pets
FROM
    user_table a, address_table b
WHERE
    a.id!=3
    AND a.id=b.id
    AND age BETWEEN 18 and 20
    AND gender in ('man')
    AND hobbies='kayaking'
    AND outgoing='yes'
    AND pets='cat';

-- grab everything but "great" id 3