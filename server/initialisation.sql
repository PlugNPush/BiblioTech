create database if not exists db_master_project;
use db_master_project;

create table if not exists users (
    username varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null,
    primary key (email)
);

create table if not exists book (
    title varchar(255) not null,
    author varchar(255) not null,
    year varchar(255) not null,
    primary key (title)
)

create table if not exists library (
    email_owner varchar(255) not null,
    book varchar(255) not null,
    primary key (owner, book),
    foreign key (owner) references users(email),
    foreign key (book) references book(title)
)

select * from users;
select * from user_cart;
select * from reservations;