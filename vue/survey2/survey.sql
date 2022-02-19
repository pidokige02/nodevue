create table Survey (
  id int unsigned auto_increment not null,
  title varchar(127) not null comment '설문제목',
  state tinyint unsigned default 0 comment '0:준비, 1: 오픈, 8: 종료, 9: 삭제',
  primary key(id)
);
-- 1681 Integer display width is deprecated and will be removed in a future release.	0.157 sec
drop table Survey;

select * from Survey;

create table Surveyee (
  id int unsigned auto_increment not null,
  email varchar(255) not null,
  uname varchar(63) not null,
  primary key(id)
);

-- Survey : Surveyee 는  1 대 다임.
create table Question (
  id int unsigned auto_increment not null,
  survey int unsigned not null comment '설문ID',
  quest varchar(255) not null comment '질문',
  ismulti tinyint unsigned not null comment '1:객관식',
  item varchar(1023) null comment '객관식 문항',
  primary key(id)
);

create table Answer (
  id int unsigned auto_increment not null,
  question int unsigned not null comment '질문ID',
  surveyee int unsigned not null comment '설문자',
  answer varchar(1023) not null comment '답변',
  primary key(id)
);

-- Question : Answer 는  1 대 다임.