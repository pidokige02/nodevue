drop table User;

create table User(
id tinyint unsigned not null auto_increment,
uid varchar(31) not null,
upw varchar(31) not null,
uname varchar(31) not null,
PRIMARY KEY(id)
);

create table User(
id tinyint unsigned not null auto_increment,
lastlogin DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
uid varchar(31) not null,
upw varchar(31) not null,
uname varchar(31) not null,
PRIMARY KEY(id)
);

ALTER TABLE User ADD COLUMN lastlogin DATETIME;

insert into User(uid, upw, uname) values ('go','0','황규성'), ('google','0','황규영'), ('gosang','0','황진하'), ('naver','0','권소현');

insert into User(uid, upw, uname) values ('user1','0','김일수'), ('user2','0','김이수');

update User set lastlogin=now() where uid='user1';
update User set lastlogin=now() where uid='user2';

select * from User where uid='user2';

select * from User;

select uid, lastlogin from User where uid in ('user1', 'user2');  -- js test\mysqltest2.js 의 유효성 검증에 사용한 code 임.

select * from User where uid='user1';