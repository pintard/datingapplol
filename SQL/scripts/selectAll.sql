-- SELECT ALL PUBLIC FRIENDLY USER REPRESENTATIONS
SELECT u.username, a.address, u.age, u.gender, u.hobbies, u.outgoing, u.pets
    FROM user_table u, address_table a
    WHERE u.id = a.id;