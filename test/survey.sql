create table Reply(
rno tinyint unsigned not null auto_increment,
bno tinyint unsigned not null,
replier varchar(31) not null,
regdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY(rno)
);

ALTER TABLE Reply ADD COLUMN replytext varchar(128);

insert into Reply(bno, replier, replytext) values ('65','user2','5555555'), ('65','user2','반가워요'), ('65','user2','7777777777'), ('65','user2', '88888888');

select * from Reply;