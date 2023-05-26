create database if not exists db_master_project;
use db_master_project;

create table if not exists user (
    username varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null,
    primary key (email)
);



create table if not exists book (
    title varchar(255) DEFAULT '' not null,
    owner varchar(255) not null,
    author varchar(255) DEFAULT '' not null,
    year varchar(255) DEFAULT '' not null,
    type varchar(255) DEFAULT '' not null,
    iban varchar(255) DEFAULT '' not null,
    nbBooks int DEFAULT 1,
    publisher varchar(255) not null,
    price_old varchar(255),
    price_new varchar(255),
    primary key (title, owner),
    constraint fk_book foreign key (owner) references user(email)
);