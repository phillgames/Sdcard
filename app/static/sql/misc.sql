create table users
values ('user', 'email', 'pass', 'verify', verified);

insert into users (user, email, pass, verify)
values ('phill', 'phill@balls.com', 'uxcthis', '20d41098-19bf-450b-8e11-cf1260eaa335');

ALTER TABLE users MODIFY COLUMN user VARCHAR(50);

ALTER TABLE users MODIFY COLUMN pass VARCHAR(256);

ALTER TABLE users MODIFY COLUMN email VARCHAR(50);

ALTER TABLE users MODIFY COLUMN verify VARCHAR(40);

DROP TABLE users;

CREATE TABLE users(
    user VARCHAR(50),
    pass VARCHAR(256),
    verify VARCHAR(40),
    email VARCHAR(50),
    verified BOOLEAN
);




ALTER TABLE users ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY;

create table products
values ('prod', 'price', 'descr');

insert into products (prod, price, descr)
values ('apple', 20, 'red');

ALTER TABLE products MODIFY COLUMN prod VARCHAR(20);

ALTER TABLE products MODIFY COLUMN price INT;

ALTER TABLE products MODIFY COLUMN descr VARCHAR(150);

ALTER TABLE products ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY;


create table order_id
values ('user_id', 'prod_id', 'price');

insert into order_id (user_id, prod_id, price)
values (1, 1, 20);

ALTER TABLE order_id MODIFY COLUMN user_id INT;

ALTER TABLE order_id MODIFY COLUMN prod_id INT;

ALTER TABLE order_id MODIFY COLUMN price INT;



CREATE TABLE test(
    one VARCHAR(50),
    two int,
    three CHAR(50)
);