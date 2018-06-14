alter table people add column EmailAddr varchar(40);
alter table people add column Department varchar(40);
alter table people add column Division varchar(40);
alter table people add column SiteLocation varchar(40);
alter table people add column Building varchar(40);
alter table people add column Identifier1 varchar(40);
ALTER TABLE people ADD UNIQUE (iClassNumber);
alter table people add KEY (FirstName);
alter table people add KEY (LastName);
alter table people add column Phone varchar(20);
alter table people change EmpID EmpID VARCHAR(40);
alter table people change iClassNumber iClassNumber bigint(20);

alter table empbadge change iClassNumber iClassNumber bigint(20);
alter table empbadge change EmpID EmpID VARCHAR(40);
ALTER TABLE empbadge ADD PRIMARY KEY (iClassNumber);


alter table accesslevels change BadgeID BadgeID bigint(20);
alter table accesslevels change EmpID EmpID VARCHAR(40);
ALTER TABLE accesslevels ADD PRIMARY KEY (BadgeID);


alter table attendance add column DeviceAuthCode varchar(40);
alter table attendance add column CheckinType varchar(4);
alter table attendance change EventName EventName VARCHAR(65);
alter table attendance change EmpID EmpID VARCHAR(40);
alter table attendance change MobSSOperator MobSSOperator VARCHAR(40);

Create table AttendanceShadow like Attendance;
alter table attendanceshadow add column DeviceAuthCode varchar(40);
alter table attendanceShadow add column CheckinType varchar(4);
alter table attendanceshadow change EventName EventName VARCHAR(65);

Alter table events add TempID varchar(20);
Alter table events add InvitationListID int(11);

alter table events change EventName EventName VARCHAR(65);
alter table events change Longitude Longitude float(10,6);
alter table events change Latitude Latitude float(10,6);
update events set latitude=0;
update events set longitude=0;

alter table deviceheader add column name varchar(100);

alter table verifyrecords change ClientSWID ClientSWID VARCHAR(40);
alter table verifyrecords change ClientSWID ClientSWID VARCHAR(40);
Alter table verifyrecords add InOutType varchar(10);
alter table verifyrecords change EmpID EmpID VARCHAR(40);
alter table verifyrecords change MobSSOperator MobSSOperator VARCHAR(40);
alter table verifyrecords change BadgeID BadgeID bigint(20);

CREATE TABLE eventtickets (FirstName varchar(40) DEFAULT NULL, LastName varchar(40) DEFAULT NULL, EventID int(11) DEFAULT NULL, NumberofTickets varchar(10) DEFAULT NULL,  EmpID varchar(40) DEFAULT NULL, TicketType varchar(10) DEFAULT NULL, iClassNumber bigint(20) DEFAULT NULL);

CREATE TABLE evacuation (
  FirstName varchar(64) DEFAULT NULL,
  LastName varchar(64) DEFAULT NULL,
  iClassNumber bigint(20) NOT NULL,
  updateTime varchar(64) DEFAULT NULL,
  empID varchar(40) DEFAULT NULL,
  Status varchar(10) DEFAULT NULL,
 UserName varchar(25) DEFAULT NULL,
  image blob NOT NULL,
  title varchar(32) NOT NULL,
  imageName varchar(25) NOT NULL,
  hasImage varchar(5) NOT NULL,
  EmailAddress varchar(30) DEFAULT NULL,
  NotificationNumber varchar(20) DEFAULT NULL,
  NumberFormat varchar(40) DEFAULT NULL,
  EmergContactNumFormat varchar(40) DEFAULT NULL,
  EmergContactNumber varchar(20) DEFAULT NULL,
  PRIMARY KEY (iClassNumber)
);

alter table evacuation add column EmailAddress varchar(30);
alter table evacuation add column NotificationNumber bigint(20) unsigned;
alter table evacuation add column NumberFormat varchar(40);
alter table Evacuation add column EmergContactNumber bigint(20) unsigned;
alter table Evacuation add column EmergContactNumFormat varchar(40);

create table Unaccounted like evacuation;
alter table Unaccounted add column MusterID int(11);
ALTER TABLE unaccounted DROP PRIMARY KEY, ADD PRIMARY KEY( iClassNumber, MusterID);
alter table evacuation change NotificationNumber NotificationNumber VARCHAR(20);
alter table evacuation change EmergContactNumber EmergContactNumber VARCHAR(20);
alter table unaccounted change NotificationNumber NotificationNumber VARCHAR(20);
alter table unaccounted change EmergContactNumber EmergContactNumber VARCHAR(20);