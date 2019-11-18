# //aTICLE TABLES
create table articles(title VARCHAR(250),body VARCHAR(2000),user INT,aid INT PRIMARY KEY AUTO_INCREMENT);
# //COMMENT TABLE
create table artcom(aid INT, comment VARCHAR(250), cid INT PRIMARY KEY AUTO_INCREMENT);