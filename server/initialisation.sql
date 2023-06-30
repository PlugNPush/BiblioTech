#drop database db_master_project;
create database if not exists db_master_project;
use db_master_project;

create table if not exists user (
    firstname varchar(255) not null,
    lastname varchar(255) not null,
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
    nbBooks int DEFAULT 1,
    publisher varchar(255) not null,
    price_old varchar(255),
    price_new varchar(255),
    rating DECIMAL(2,1) DEFAULT -1,
    primary key (title, owner),
    constraint fk_book foreign key (owner) references user(email)
);

create table if not exists recco_book (
    title varchar(255) DEFAULT '' not null,
    owner varchar(255) not null,
    author varchar(255) DEFAULT '' not null,
    year varchar(255) DEFAULT '' not null,
    type varchar(255) DEFAULT '' not null,
    publisher varchar(255) not null,
    primary key (title, owner),
    constraint fk_recco_book foreign key (owner) references user(email)
);

create table if not exists boite_aux_livres (
    nom_gare varchar(255) DEFAULT '' not null,
    title varchar(255) DEFAULT '' not null,
    author varchar(255) DEFAULT '' not null,
    type varchar(255) DEFAULT '' not null,
    year varchar(255) DEFAULT '' not null,
    nbBooks int DEFAULT 1,
    publisher varchar(255) not null,
    primary key (nom_gare, title)
);