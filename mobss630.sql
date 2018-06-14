-- MySQL dump 10.13  Distrib 5.7.20, for Win64 (x86_64)
--
-- Host: localhost    Database: mobss
-- ------------------------------------------------------
-- Server version	5.7.20-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accesslevels`
--

DROP TABLE IF EXISTS `accesslevels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accesslevels` (
  `BadgeID` bigint(20) NOT NULL DEFAULT '0',
  `AccsLvlID` int(11) NOT NULL,
  `AccsLvlName` varchar(64) NOT NULL,
  `EmpID` varchar(40) DEFAULT NULL,
  `updateTime` varchar(25) NOT NULL,
  PRIMARY KEY (`BadgeID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accesslevels`
--

LOCK TABLES `accesslevels` WRITE;
/*!40000 ALTER TABLE `accesslevels` DISABLE KEYS */;
INSERT INTO `accesslevels` VALUES (30584,1,'Main','46005','1515086401413'),(30587,1,'Main','46004','1515086401413'),(30588,1,'Main','46010','1515086401413'),(30586,1,'Main','46022','1515086401413'),(30582,1,'Main','46002','1515086401413'),(30583,1,'Main','46024','1515086401413'),(100,1,'Main','46003','1515086401413'),(42951,1,'Main','46006','1515086401413'),(42978,1,'Main','46001','1515086401413'),(42979,1,'Main','46023','1515086401413'),(171081160,1,'Main','46021','1515086401413'),(171081156,1,'Main','46020','1515086401413'),(171081159,1,'Main','46016','1515086401413'),(171081158,1,'Main','46025','1515086401413'),(171081157,1,'Main','46009','1515086401413'),(232927,1,'Main','46027','1515086401413'),(222161,1,'Main','46026','1515086401413'),(10000355331,1,'Main','46007','1515086401413'),(146522,1,'Main','46031','1515086401413'),(239452,1,'Main','46029','1515086401413'),(129473,1,'Main','46032','1515086401413'),(563,1,'Main','46008','1515086401413'),(207332,1,'Main','46044','1515086401413'),(566,1,'Main','46028','1515086401413'),(146907,1,'Main','46030','1515086401428'),(171078,1,'Main','46039','1515086401428'),(219040,1,'Main','46037','1515086401428'),(224815,1,'Main','46015','1515086401428'),(153796,1,'Main','46038','1515086401428'),(63376,1,'Main','46034','1515086401428'),(136681,1,'Main','46035','1515086401428'),(222822,1,'Main','46040','1515086401428'),(572,1,'Main','46000','1515086401428'),(204816,1,'Main','46033','1515086401428'),(587,1,'Main','46011','1515086401428'),(588,1,'Main','46014','1515086401428'),(171597,1,'Main','46041','1515086401428'),(215413,1,'Main','46019','1515086401428'),(136162,1,'Main','46012','1515086401428'),(191607,1,'Main','46013','1515086401428'),(189425,1,'Main','46036','1515086401444'),(250213,1,'Main','46018','1515086401444'),(223337,1,'Main','46042','1515086401444'),(136829,1,'Main','46043','1515086401444'),(144462,1,'Main','46045','1515086401444'),(203917,1,'Main','34775','1515086401444'),(58154,1,'Main','46017','1515086401444');
/*!40000 ALTER TABLE `accesslevels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attendance` (
  `MobSSID` int(11) DEFAULT NULL,
  `FirstName` varchar(25) DEFAULT NULL,
  `LastName` varchar(25) DEFAULT NULL,
  `InTIme` varchar(20) DEFAULT NULL,
  `OutTIme` varchar(20) DEFAULT NULL,
  `EventID` varchar(25) DEFAULT NULL,
  `EventName` varchar(65) DEFAULT NULL,
  `iClassNumber` bigint(20) DEFAULT NULL,
  `AttendDate` varchar(20) DEFAULT NULL,
  `InSeconds` varchar(20) DEFAULT NULL,
  `OutSeconds` varchar(20) DEFAULT NULL,
  `EmpID` varchar(40) DEFAULT NULL,
  `RecordStatus` varchar(10) DEFAULT NULL,
  `MobSSOperator` varchar(40) DEFAULT NULL,
  KEY `firstName` (`FirstName`),
  KEY `lastName` (`LastName`),
  KEY `id` (`iClassNumber`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendanceshadow`
--

DROP TABLE IF EXISTS `attendanceshadow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attendanceshadow` (
  `MobSSID` int(11) DEFAULT NULL,
  `FirstName` varchar(25) DEFAULT NULL,
  `LastName` varchar(25) DEFAULT NULL,
  `InTIme` varchar(20) DEFAULT NULL,
  `OutTIme` varchar(20) DEFAULT NULL,
  `EventID` varchar(25) DEFAULT NULL,
  `EventName` varchar(65) DEFAULT NULL,
  `iClassNumber` bigint(20) DEFAULT NULL,
  `AttendDate` varchar(20) DEFAULT NULL,
  `InSeconds` varchar(20) DEFAULT NULL,
  `OutSeconds` varchar(20) DEFAULT NULL,
  `EmpID` varchar(40) DEFAULT NULL,
  `RecordStatus` varchar(10) DEFAULT NULL,
  `MobSSOperator` varchar(40) DEFAULT NULL,
  KEY `firstName` (`FirstName`),
  KEY `lastName` (`LastName`),
  KEY `id` (`iClassNumber`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendanceshadow`
--

LOCK TABLES `attendanceshadow` WRITE;
/*!40000 ALTER TABLE `attendanceshadow` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendanceshadow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `connections`
--

DROP TABLE IF EXISTS `connections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `connections` (
  `AuthCode` varchar(40) DEFAULT NULL,
  `ConnectionAttemptTime` varchar(40) DEFAULT NULL,
  `Result` varchar(5) DEFAULT NULL,
  `Lat` float(10,6) DEFAULT NULL,
  `Lng` float(10,6) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `connections`
--

LOCK TABLES `connections` WRITE;
/*!40000 ALTER TABLE `connections` DISABLE KEYS */;
INSERT INTO `connections` VALUES ('123456789012347','2017-11-16 14:50:32','1',NULL,NULL),('123456789012347','2017-11-16 14:50:32','1',NULL,NULL),('123456789012347','2017-11-16 14:50:38','1',NULL,NULL),('123456789012347','2017-11-16 15:01:21','1',NULL,NULL),('123456789012347','2017-11-16 15:01:22','1',NULL,NULL),('123456789012347','2017-11-16 15:04:31','1',NULL,NULL),('123456789012347','2017-11-16 15:04:41','1',NULL,NULL),('123456789012347','2017-11-16 15:04:44','1',NULL,NULL),('123456789012347','2017-11-16 15:04:47','1',NULL,NULL),('123456789012347','2017-11-16 15:04:50','1',NULL,NULL),('123456789012347','2017-11-16 15:04:52','1',NULL,NULL),('123456789012347','2017-11-16 15:04:55','1',NULL,NULL),('123456789012347','2017-11-16 15:04:57','1',NULL,NULL),('123456789012347','2017-11-16 15:04:59','1',NULL,NULL),('123456789012347','2017-11-16 15:05:00','1',NULL,NULL),('123456789012347','2017-11-16 15:05:02','1',NULL,NULL),('123456789012347','2017-11-16 15:05:14','1',NULL,NULL),('123456789012347','2017-11-16 15:05:21','1',NULL,NULL),('123456789012347','2017-11-16 15:05:27','1',NULL,NULL),('123456789012347','2017-11-16 15:05:32','1',NULL,NULL),('123456789012347','2017-11-16 17:27:54','1',NULL,NULL),('123456789012347','2017-11-16 17:27:54','1',NULL,NULL),('123456789012347','2017-11-16 17:27:59','1',NULL,NULL),('123456789012347','2017-11-16 17:29:28','1',NULL,NULL),('123456789012347','2017-11-16 17:29:29','1',NULL,NULL),('123456789012347','2017-11-16 20:51:39','1',NULL,NULL),('123456789012347','2017-11-16 20:51:40','1',NULL,NULL),('123456789012347','2017-11-16 20:51:47','1',NULL,NULL),('123456789012347','2017-11-16 20:55:22','1',NULL,NULL),('123456789012347','2017-11-16 21:00:17','1',NULL,NULL),('123456789012347','2017-11-16 21:02:45','1',NULL,NULL),('123456789012347','2017-11-16 22:14:16','1',NULL,NULL),('123456789012347','2017-11-16 22:21:37','1',NULL,NULL),('123456789012347','2017-11-16 22:24:21','1',NULL,NULL),('123456789012347','2017-11-16 22:28:25','1',NULL,NULL),('123456789012347','2017-11-16 22:31:21','1',NULL,NULL),('123456789012347','2017-11-16 22:33:57','1',NULL,NULL),('123456789012347','2017-12-11 09:35:21','1',NULL,NULL),('123456789012347','2017-12-11 09:35:22','1',NULL,NULL),('123456789012347','2017-12-11 09:41:43','1',NULL,NULL),('123456789012347','2017-12-11 09:41:45','1',NULL,NULL),('123456789012347','2017-12-11 09:43:35','1',NULL,NULL),('MCEuU5sNyleawUAy39tIGOe9swGxDSwgqOWW','2017-12-11 09:46:00','0',NULL,NULL),('123456789012347','2017-12-11 09:46:45','1',NULL,NULL),('123456789012347','2017-12-11 09:46:47','1',NULL,NULL),('123456789012347','2017-12-11 09:48:05','1',NULL,NULL),('123456789012347','2017-12-11 09:50:51','1',NULL,NULL),('123456789012347','2017-12-11 09:51:18','1',NULL,NULL),('123456789012347','2017-12-11 09:52:53','1',NULL,NULL),('123456789012347','2017-12-11 09:58:35','1',NULL,NULL),('123456789012347','2017-12-11 10:06:24','1',NULL,NULL),('123456789012347','2017-12-11 10:11:30','1',NULL,NULL),('123456789012347','2017-12-11 10:12:41','1',NULL,NULL),('123456789012347','2017-12-11 10:14:55','1',NULL,NULL),('123456789012347','2017-12-11 10:15:52','1',NULL,NULL),('123456789012347','2017-12-11 10:17:02','1',NULL,NULL),('123456789012347','2018-03-05 09:24:45','1',NULL,NULL),('123456789012347','2018-03-05 09:24:46','1',NULL,NULL),('123456789012347','2018-03-05 09:25:56','1',NULL,NULL),('123456789012347','2018-03-05 09:27:45','1',NULL,NULL),('123456789012347','2018-03-05 09:32:40','1',NULL,NULL),('123456789012347','2018-03-05 09:32:40','1',NULL,NULL),('123456789012347','2018-03-05 09:34:05','1',NULL,NULL),('123456789012347','2018-03-05 10:38:56','1',NULL,NULL),('123456789012347','2018-03-05 11:23:05','1',NULL,NULL),('123456789012347','2018-03-05 13:58:41','1',NULL,NULL),('123456789012347','2018-03-05 13:58:41','1',NULL,NULL),('123456789012347','2018-03-05 13:58:47','1',NULL,NULL),('123456789012347','2018-03-05 13:58:47','1',NULL,NULL),('123456789012347','2018-03-05 13:58:47','1',NULL,NULL),('123456789012347','2018-03-05 14:04:15','1',NULL,NULL),('123456789012347','2018-03-05 14:04:16','1',NULL,NULL),('123456789012347','2018-03-05 14:04:16','1',NULL,NULL),('123456789012347','2018-03-05 14:10:59','1',NULL,NULL),('123456789012347','2018-03-05 14:10:59','1',NULL,NULL),('123456789012347','2018-03-05 14:11:00','1',NULL,NULL),('123456789012347','2018-03-05 14:19:07','1',NULL,NULL),('123456789012347','2018-03-05 14:19:07','1',NULL,NULL),('123456789012347','2018-03-05 14:19:08','1',NULL,NULL),('WH9k2ISMKHv2nMvlCkxUeqndD6UIjxCg24Ey','2018-03-05 14:31:37','0',NULL,NULL),('WH9k2ISMKHv2nMvlCkxUeqndD6UIjxCg24Ey','2018-03-05 14:32:22','1',NULL,NULL),('WH9k2ISMKHv2nMvlCkxUeqndD6UIjxCg24Ey','2018-03-05 14:32:25','1',NULL,NULL),('WH9k2ISMKHv2nMvlCkxUeqndD6UIjxCg24Ey','2018-03-05 14:33:00','1',NULL,NULL),('WH9k2ISMKHv2nMvlCkxUeqndD6UIjxCg24Ey','2018-03-05 14:34:33','1',NULL,NULL),('WH9k2ISMKHv2nMvlCkxUeqndD6UIjxCg24Ey','2018-03-05 14:34:36','1',NULL,NULL),('WH9k2ISMKHv2nMvlCkxUeqndD6UIjxCg24Ey','2018-03-05 14:34:39','1',NULL,NULL);
/*!40000 ALTER TABLE `connections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deviceheader`
--

DROP TABLE IF EXISTS `deviceheader`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deviceheader` (
  `AuthCode` varchar(40) DEFAULT NULL,
  `DateIssued` varchar(40) DEFAULT NULL,
  `ConnectionAttemptCount` int(8) DEFAULT NULL,
  `LastConnect` varchar(40) DEFAULT NULL,
  `CurrentStatus` varchar(5) DEFAULT NULL,
  `DeviceType` varchar(5) DEFAULT NULL,
  `MobssOperator` varchar(20) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  UNIQUE KEY `AuthCode` (`AuthCode`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deviceheader`
--

LOCK TABLES `deviceheader` WRITE;
/*!40000 ALTER TABLE `deviceheader` DISABLE KEYS */;
INSERT INTO `deviceheader` VALUES ('123456789012347','2017-11-09 01:00',0,'','1','','','FEB device 001'),('MCEuU5sNyleawUAy39tIGOe9swGxDSwgqOWW','2017-12-11 09:46:00',1,'2017-12-11 09:46:00','0','OB1','001',NULL),('WH9k2ISMKHv2nMvlCkxUeqndD6UIjxCg24Ey','2018-03-05 14:31:37',1,'2018-03-05 14:31:37','1','OB1','001',NULL);
/*!40000 ALTER TABLE `deviceheader` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devicehistory`
--

DROP TABLE IF EXISTS `devicehistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `devicehistory` (
  `AuthCode` varchar(40) DEFAULT NULL,
  `Status` varchar(5) DEFAULT NULL,
  `StatusDate` varchar(40) DEFAULT NULL,
  `StatusChangeComment` varchar(100) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devicehistory`
--

LOCK TABLES `devicehistory` WRITE;
/*!40000 ALTER TABLE `devicehistory` DISABLE KEYS */;
INSERT INTO `devicehistory` VALUES ('MCEuU5sNyleawUAy39tIGOe9swGxDSwgqOWW','0','2017-12-11 09:46:00','Device requesting activation'),('WH9k2ISMKHv2nMvlCkxUeqndD6UIjxCg24Ey','0','2018-03-05 14:31:37','Device requesting activation'),('WH9k2ISMKHv2nMvlCkxUeqndD6UIjxCg24Ey','1','2018-03-05 14:32:05','');
/*!40000 ALTER TABLE `devicehistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empbadge`
--

DROP TABLE IF EXISTS `empbadge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `empbadge` (
  `EmpID` varchar(40) DEFAULT NULL,
  `iClassNumber` bigint(20) NOT NULL,
  `StatusID` int(11) NOT NULL,
  `StatusName` varchar(32) NOT NULL,
  `updateTime` varchar(25) NOT NULL,
  PRIMARY KEY (`iClassNumber`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empbadge`
--

LOCK TABLES `empbadge` WRITE;
/*!40000 ALTER TABLE `empbadge` DISABLE KEYS */;
INSERT INTO `empbadge` VALUES ('46005',30584,1,'Active','1515086401163'),('46004',30587,1,'Active','1515086401163'),('46010',30588,1,'Active','1515086401163'),('46022',30586,1,'Active','1515086401163'),('46002',30582,1,'Active','1515086401163'),('46024',30583,1,'Active','1515086401163'),('46003',100,1,'Active','1515086401163'),('46006',42951,1,'Active','1515086401178'),('46001',42978,1,'Active','1515086401178'),('46023',42979,1,'Active','1515086401178'),('46021',171081160,1,'Active','1515086401178'),('46020',171081156,1,'Active','1515086401178'),('46016',171081159,1,'Active','1515086401178'),('46025',171081158,1,'Active','1515086401178'),('46009',171081157,1,'Active','1515086401178'),('46027',232927,1,'Active','1515086401178'),('46026',222161,1,'Active','1515086401178'),('46007',10000355331,1,'Active','1515086401178'),('46031',146522,1,'Active','1515086401178'),('46029',239452,1,'Active','1515086401178'),('46032',129473,1,'Active','1515086401178'),('46008',563,1,'Active','1515086401178'),('46044',207332,1,'Active','1515086401178'),('46028',566,1,'Active','1515086401178'),('46030',146907,1,'Active','1515086401178'),('46039',171078,1,'Active','1515086401178'),('46037',219040,1,'Active','1515086401178'),('46015',224815,1,'Active','1515086401178'),('46038',153796,1,'Active','1515086401194'),('46034',63376,1,'Active','1515086401194'),('46035',136681,1,'Active','1515086401194'),('46040',222822,1,'Active','1515086401194'),('46000',572,1,'Active','1515086401194'),('46033',204816,1,'Active','1515086401194'),('46011',587,1,'Active','1515086401194'),('46014',588,1,'Active','1515086401194'),('46041',171597,1,'Active','1515086401194'),('46019',215413,1,'Active','1515086401194'),('46012',136162,1,'Active','1515086401194'),('46013',191607,1,'Active','1515086401194'),('46036',189425,1,'Active','1515086401194'),('46018',250213,1,'Active','1515086401194'),('46042',223337,1,'Active','1515086401194'),('46043',136829,1,'Active','1515086401194'),('46045',144462,1,'Active','1515086401194'),('34775',203917,1,'Active','1515086401194'),('46017',58154,1,'Active','1515086401194');
/*!40000 ALTER TABLE `empbadge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evacuation`
--

DROP TABLE IF EXISTS `evacuation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `evacuation` (
  `FirstName` varchar(64) DEFAULT NULL,
  `LastName` varchar(64) DEFAULT NULL,
  `iClassNumber` bigint(20) NOT NULL,
  `updateTime` varchar(64) DEFAULT NULL,
  `empID` varchar(40) DEFAULT NULL,
  `Status` varchar(10) DEFAULT NULL,
  `UserName` varchar(25) DEFAULT NULL,
  `image` blob NOT NULL,
  `title` varchar(32) NOT NULL,
  `imageName` varchar(25) NOT NULL,
  `hasImage` varchar(5) NOT NULL,
  PRIMARY KEY (`iClassNumber`),
  KEY `firstName` (`FirstName`),
  KEY `lastName` (`LastName`),
  KEY `id` (`iClassNumber`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evacuation`
--

LOCK TABLES `evacuation` WRITE;
/*!40000 ALTER TABLE `evacuation` DISABLE KEYS */;
/*!40000 ALTER TABLE `evacuation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `EventID` int(11) NOT NULL AUTO_INCREMENT,
  `EventName` varchar(65) DEFAULT NULL,
  `EventDateTime` varchar(25) NOT NULL,
  `EventLocationName` varchar(40) NOT NULL,
  `EventSponsorName` varchar(40) NOT NULL,
  `DurationInMins` varchar(5) NOT NULL,
  `Latitude` varchar(20) DEFAULT NULL,
  `Longitude` varchar(20) DEFAULT NULL,
  `RecordStatus` varchar(10) NOT NULL,
  `Comments` varchar(256) NOT NULL,
  `updateTime` varchar(60) DEFAULT NULL,
  `EventsType` varchar(20) NOT NULL,
  `InvitationListID` int(11) NOT NULL,
  `TempID` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`EventID`),
  UNIQUE KEY `EventID_UNIQUE` (`EventID`)
) ENGINE=MyISAM AUTO_INCREMENT=107 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (101,'ftp tester','2017-12-04 00:30:00','','feb','30','null','null','null','','1512495075903','Training',0,''),(102,'TEst dates 2','2018-01-17 00:00:00','','feb','30','null','null','null','','1515275750180','Meeting',0,NULL),(103,'All date 3','2018-01-17 23:30:00','','feb','30','null','null','null','','1515275777483','Sales event',0,NULL),(104,'Get events tester','2018-01-16 23:30:00','','feb','30','null','null','null','','1515275812363','Enrollment',0,NULL),(105,'beyond the event horizon','2018-01-18 00:00:00','','feb','30','null','null','null','','1515275843297','Training',0,NULL),(106,'cè shì shì jiàn yì','2018-01-17 01:30:00','','bù lái','30','null','null','null','','1516034846014','Training',0,NULL);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventtickets`
--

DROP TABLE IF EXISTS `eventtickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eventtickets` (
  `FirstName` varchar(40) DEFAULT NULL,
  `LastName` varchar(40) DEFAULT NULL,
  `EventID` int(11) DEFAULT NULL,
  `NumberofTickets` varchar(10) DEFAULT NULL,
  `EmpID` varchar(40) DEFAULT NULL,
  `TicketType` varchar(10) DEFAULT NULL,
  `iClassNumber` bigint(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventtickets`
--

LOCK TABLES `eventtickets` WRITE;
/*!40000 ALTER TABLE `eventtickets` DISABLE KEYS */;
INSERT INTO `eventtickets` VALUES ('Sonia','Garg',20,'3','46007','FREEBIE',10000355331),('William','Papillon',20,'10','46005','COUPONS',30584),('Sonia','Garg',20,'3','46007','FREEBIE',10000355331),('William','Papillon',20,'10','46005','COUPONS',30584);
/*!40000 ALTER TABLE `eventtickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invitees`
--

DROP TABLE IF EXISTS `invitees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invitees` (
  `InvitationListID` int(11) NOT NULL,
  `BadgeNumber` bigint(20) DEFAULT NULL,
  `LastName` varchar(60) DEFAULT NULL,
  `FirstName` varchar(30) DEFAULT NULL,
  `EmailAddress` varchar(30) DEFAULT NULL,
  `NotificationNumber` bigint(20) unsigned NOT NULL,
  `NumberFormat` varchar(40) DEFAULT NULL,
  `UpdateTime` varchar(64) DEFAULT NULL,
  KEY `InvitationListID` (`InvitationListID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitees`
--

LOCK TABLES `invitees` WRITE;
/*!40000 ALTER TABLE `invitees` DISABLE KEYS */;
INSERT INTO `invitees` VALUES (174,4608,'Bligh','Philip','blighps@gmail.com',0,'','1517945904236');
/*!40000 ALTER TABLE `invitees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invitelist`
--

DROP TABLE IF EXISTS `invitelist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invitelist` (
  `InvitationListID` int(11) NOT NULL AUTO_INCREMENT,
  `ListName` varchar(100) DEFAULT NULL,
  `ListComment` varchar(100) DEFAULT NULL,
  `UpdateTime` varchar(64) DEFAULT NULL,
  KEY `InvitationListID` (`InvitationListID`)
) ENGINE=MyISAM AUTO_INCREMENT=178 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitelist`
--

LOCK TABLES `invitelist` WRITE;
/*!40000 ALTER TABLE `invitelist` DISABLE KEYS */;
INSERT INTO `invitelist` VALUES (171,'cc1','','1512681404602'),(172,'ccc6','','1512682180944'),(173,'Feb test alt S2','','1513185136132'),(174,'apiTEST001','A list created through the api','1515516030288'),(175,'apiTEST0099','A list created through the api 99','1517944134083'),(176,'','A list created through the api 99','1517944970148'),(177,'apiTEST001909','A list created through the api','1517950871041');
/*!40000 ALTER TABLE `invitelist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `muster`
--

DROP TABLE IF EXISTS `muster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `muster` (
  `BadgeID` bigint(20) NOT NULL,
  `DeviceID` varchar(40) DEFAULT NULL,
  `ScanTime` datetime DEFAULT NULL,
  `Zone` varchar(55) DEFAULT NULL,
  `LatLong` varchar(45) DEFAULT NULL,
  `ScanState` varchar(20) DEFAULT NULL,
  `musterID` varchar(25) DEFAULT NULL,
  `mobssOperator` varchar(45) DEFAULT NULL,
  `musterName` varchar(100) DEFAULT NULL,
  `musterPoint` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`BadgeID`),
  UNIQUE KEY `BadgeID_UNIQUE` (`BadgeID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `muster`
--

LOCK TABLES `muster` WRITE;
/*!40000 ALTER TABLE `muster` DISABLE KEYS */;
/*!40000 ALTER TABLE `muster` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mustermaster`
--

DROP TABLE IF EXISTS `mustermaster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mustermaster` (
  `musterID` int(11) NOT NULL AUTO_INCREMENT,
  `musterName` varchar(100) DEFAULT NULL,
  `Location` varchar(45) DEFAULT NULL,
  `dateTime` varchar(65) DEFAULT NULL,
  `musterCaptain` varchar(45) DEFAULT NULL,
  `Status` varchar(10) DEFAULT NULL,
  `Type` varchar(20) DEFAULT NULL,
  `Zones` varchar(20) DEFAULT NULL,
  `durationMinutes` varchar(10) DEFAULT NULL,
  KEY `musterID` (`musterID`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mustermaster`
--

LOCK TABLES `mustermaster` WRITE;
/*!40000 ALTER TABLE `mustermaster` DISABLE KEYS */;
/*!40000 ALTER TABLE `mustermaster` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `musterpoint`
--

DROP TABLE IF EXISTS `musterpoint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `musterpoint` (
  `PointID` varchar(40) NOT NULL,
  `lat` float(10,6) NOT NULL,
  `lng` float(10,6) NOT NULL,
  `Description` varchar(100) DEFAULT NULL,
  `Region` varchar(40) DEFAULT NULL,
  `Campus` varchar(40) DEFAULT NULL,
  `Building` varchar(40) DEFAULT NULL,
  `Location` varchar(40) DEFAULT NULL,
  `Warden` varchar(40) DEFAULT NULL,
  `DeviceAuthCode` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`PointID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `musterpoint`
--

LOCK TABLES `musterpoint` WRITE;
/*!40000 ALTER TABLE `musterpoint` DISABLE KEYS */;
/*!40000 ALTER TABLE `musterpoint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `people`
--

DROP TABLE IF EXISTS `people`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `people` (
  `FirstName` varchar(64) DEFAULT NULL,
  `LastName` varchar(64) DEFAULT NULL,
  `iClassNumber` bigint(20) DEFAULT NULL,
  `updateTime` varchar(64) DEFAULT NULL,
  `EmpID` varchar(40) DEFAULT NULL,
  `Status` varchar(10) DEFAULT NULL,
  `UserName` varchar(25) DEFAULT NULL,
  `Image` blob,
  `Title` varchar(32) DEFAULT NULL,
  `imageName` varchar(100) DEFAULT NULL,
  `hasImage` varchar(5) DEFAULT NULL,
  `EmailAddr` varchar(40) DEFAULT NULL,
  `Department` varchar(40) DEFAULT NULL,
  `Division` varchar(40) DEFAULT NULL,
  `SiteLocation` varchar(40) DEFAULT NULL,
  `Building` varchar(40) DEFAULT NULL,
  `Identifier1` varchar(40) DEFAULT NULL,
  UNIQUE KEY `iClassNumber` (`iClassNumber`),
  UNIQUE KEY `iClassNumber_2` (`iClassNumber`,`EmpID`,`Title`),
  KEY `firstName` (`FirstName`),
  KEY `lastName` (`LastName`),
  KEY `id` (`iClassNumber`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `people`
--

LOCK TABLES `people` WRITE;
/*!40000 ALTER TABLE `people` DISABLE KEYS */;
INSERT INTO `people` VALUES ('William','Papillon',30584,'1515086400835','46005',NULL,NULL,'','Technical Consultant IT','46005','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Robert','Moluc',30587,'1515086400835','46004',NULL,NULL,'','Mgr Design','46004','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Kenneth','Christenson',30588,'1515086400835','46010',NULL,NULL,'','Project Manager SD&C','46010','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('David','Siegfried',30586,'1515086400835','46022',NULL,NULL,'','Dir Purchasing Const','46022','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Barbara','Masters',30582,'1515086400850','46002',NULL,NULL,'','Compliance Engineer','46002','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Doreen','Todoa',30583,'1515086400850','46024',NULL,NULL,'','Business Syst Analyst','46024','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Alissa','Abigon',100,'1515086400850','46003',NULL,NULL,'','AVP Real Estate','46003','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Mia','Flannery',42951,'1515086400850','46006',NULL,NULL,'','Dir ETO','46006','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('John','Macker',42978,'1515086400850','46001',NULL,NULL,'','Sr Data Center Analyst','46001','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Diana','Williams',42979,'1515086400850','46023',NULL,NULL,'','Dir Human Resources HO','46023','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Sheila','Messi ',171081160,'1515086400850','46021',NULL,NULL,'','TAC Analyst','46021','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Carla ','Khan',171081156,'1515086400850','46020',NULL,NULL,'','Dir Business Services','46020','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Mark','Workman',171081159,'1515086400866','46016',NULL,NULL,'','Technical Consultant IT','46016','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Ella','Tipple',171081158,'1515086400866','46025',NULL,NULL,'','Procurement Agent','46025','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Weiping','Xie',171081157,'1515086400866','46009',NULL,NULL,'','SAP Developer 4','46009','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Kelly','Diehard',232927,'1515086400866','46027',NULL,NULL,'','Case Mgmt Consultant','46027','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Hayat','Sindi',222161,'1515086400866','46026',NULL,NULL,'','Mgr Audit','46026','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Sonia','Garg',10000355331,'1515086400866','46007',NULL,NULL,'','Mgr Project Store Ops','46007','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Linda','Sanders',146522,'1515086400866','46031',NULL,NULL,'','IT Infrastructure Analyst','46031','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Umm','Kulthum',239452,'1515086400866','46029',NULL,NULL,'','Exec Assistant to CEO/CFH','46029','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Marcie','Hedges',129473,'1515086400866','46032',NULL,NULL,'','Accountant','46032','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Enrique','Caruso ',563,'1515086400866','46008',NULL,NULL,'','Business Analyst BPM','46008','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Rafael','Pinot',207332,'1515086400866','46044',NULL,NULL,'','SAP Business Analyst 4','46044','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Ronald','Elston',566,'1515086400866','46028',NULL,NULL,'','Dir Controller','46028','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Haider','Mahmoud',146907,'1515086400881','46030',NULL,NULL,'','Sr System Engineer','46030','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('David','Weinberger',171078,'1515086400881','46039',NULL,NULL,'','Signals Engineer','46039','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('David','Von Trapp',219040,'1515086400881','46037',NULL,NULL,'','Assoc System Engineer','46037','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Jill','Galli',224815,'1515086400881','46015',NULL,NULL,'','Compliance Analyst 3','46015','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Katherine','Marko',153796,'1515086400881','46038',NULL,NULL,'','Guard','46038','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Gita','Sharma',63376,'1515086400881','46034',NULL,NULL,'','Cook I','46034','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Amy','Lagaston',136681,'1515086400897','46035',NULL,NULL,'','Mgr Sr Applications','46035','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Linn','Gonzalez',222822,'1515086400897','46040',NULL,NULL,'','DC Ops HR Clerical','46040','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Amy','Vasquez',572,'1515086400913','46000',NULL,NULL,'','Social Media Mkt Mgr.','46000','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Wendy','Chen',204816,'1515086400913','46033',NULL,NULL,'','Applications Consultant','46033','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Wendy','Li',587,'1515086400913','46011',NULL,NULL,'','Compliance Analyst 3','46011','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Donald','McIntyre',588,'1515086400913','46014',NULL,NULL,'','Mgr SD&C Brand Development','46014','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Nico','Mars',171597,'1515086400913','46041',NULL,NULL,'','Supv HR Operations','46041','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Tanya','Baxter',215413,'1515086400913','46019',NULL,NULL,'','VP Brand HR','46019','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Jeff','Boon Jr.',136162,'1515086400913','46012',NULL,NULL,'','Mgr Sr Applications','46012','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Brynn','Bunty',191607,'1515086400913','46013',NULL,NULL,'','Mgr Public Relations','46013','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Steve','Milla',189425,'1515086400913','46036',NULL,NULL,'','Sr Programmer Analyst','46036','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Akeem','Abboud',250213,'1515086400928','46018',NULL,NULL,'','Technical Consultant IT','46018','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Phil','Badinage',223337,'1515086400928','46042',NULL,NULL,'','SAM Analyst','46042','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Kevin','Beamer',136829,'1515086400928','46043',NULL,NULL,'','Sr Programmer Analyst','46043','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Mario','Mayberry',144462,'1515086400928','46045',NULL,NULL,'','Store Systems Implement Ld','46045','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('Andrew','Rink',203917,'1515086400928','34775',NULL,NULL,'','Mgr Tax','34775','Yes',NULL,NULL,NULL,NULL,NULL,NULL),('David','Wii',58154,'1515086400928','46017',NULL,NULL,'','Master Lead Maint Tech','46017','Yes',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `people` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `UserName` varchar(64) NOT NULL,
  `Password` varchar(140) DEFAULT NULL,
  `LastName` varchar(64) DEFAULT NULL,
  `FirstName` varchar(64) DEFAULT NULL,
  `EmpID` varchar(40) DEFAULT NULL,
  `UserEmail` varchar(64) DEFAULT NULL,
  `Status` varchar(4) NOT NULL,
  `UpdateTime` varchar(64) DEFAULT NULL,
  `PrivLevel` varchar(10) DEFAULT NULL,
  `RGen` varchar(20) DEFAULT NULL,
  KEY `UserName` (`UserName`)
) ENGINE=MyISAM AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('mobss','70cc61c093eef504c3e5e5311a1928075669e2a59845adcdd19f3c5a0ad62c9fefee4e834fe651a9773ba534dc6e7bc352b99fc19190856bfd38d61235f273ad','moby','dave','111','pbligh@mobss.com','1','2017-08-06 17:52:01','2','7d70f31427b66199'),('mobssdemo','544c0084f290662fec2c39a9073dfb4e4b5e0018aad2ba0eb3c22b5fee2a5d8c4ca41ec28f4f150165ce7323d8b3956ed050b94930962fccaea7c804f7a6b833','mobss','mister','132424','mm@mobss.com','2','2017-07-26 09:18:19','1','ccb0715e009a0dde'),('EventUser','688f00180f30d57bfc619719f114282f3af98358f4165b1d7541c4f29c92fd2a5ab56c1bd2ed155eb7e07489fdb8014335b8c5120c6ca24e9e5a64a03f273a48','McMeeting','','','','1','2017-10-29 08:04:46','4','2398ebd2a0f9b3c5');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verifyrecords`
--

DROP TABLE IF EXISTS `verifyrecords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verifyrecords` (
  `ScanDateTime` varchar(30) NOT NULL,
  `ScanDate` varchar(20) NOT NULL,
  `ScanTime` varchar(15) NOT NULL,
  `ScanSeconds` varchar(15) NOT NULL,
  `ClientSWID` varchar(20) NOT NULL,
  `MobSSOperator` varchar(40) DEFAULT NULL,
  `AcsLvlID` int(11) NOT NULL,
  `BadgeID` bigint(20) NOT NULL,
  `Result` varchar(3) NOT NULL,
  `BadgeStatusID` varchar(3) NOT NULL,
  `EmpID` varchar(40) DEFAULT NULL,
  `RecordStatus` varchar(10) NOT NULL,
  `InOutType` varchar(10) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verifyrecords`
--

LOCK TABLES `verifyrecords` WRITE;
/*!40000 ALTER TABLE `verifyrecords` DISABLE KEYS */;
INSERT INTO `verifyrecords` VALUES ('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','10','11','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,7,'9','1','11','Local','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,6,'99','1','1111','Local','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,5,'999','1','111111','Local','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,7,'9','1','11','Local','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,6,'99','1','1111','Local','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,5,'999','1','111111','Local','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,7,'9','1','11','Local','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,6,'99','1','1111','Local','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,5,'999','1','111111','Local','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,7,'9','1','11','Local','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,6,'99','1','1111','Local','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,5,'999','1','111111','Local','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,7,'9','1','11','Local','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,6,'99','1','1111','Local','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,5,'999','1','111111','Local','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,7,'9','1','11','Local','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,6,'99','1','1111','Local','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,5,'999','1','111111','Local','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,7,'9','1','11','Local','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,6,'99','1','1111','Local','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,5,'999','1','111111','Local','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,7,'9','1','11','Local','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,6,'99','1','1111','Local','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,5,'999','1','111111','Local','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,7,'9','1','11','Local','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,6,'99','1','1111','Local','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,5,'999','1','111111','Local','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,7,'9','1','11','Local','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,6,'99','1','1111','Local','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,5,'999','1','111111','Local','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,7,'9','1','11','Local','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,6,'99','1','1111','Local','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,5,'999','1','111111','Local','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,7,'9','1','11','Local','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,6,'99','1','1111','Local','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,5,'999','1','111111','Local','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS',''),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS',''),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS',''),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS',''),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS',''),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS',''),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS',''),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS',''),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS',''),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS',''),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS',''),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS',''),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS',''),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS',''),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS',''),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS',''),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS',''),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS',''),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS',''),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS',''),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS',''),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In'),('2018-01-22 10:00:00','2','3','4','5','6',7,144462,'9','1','11','MobSS','In'),('2017-02-22 10:00:00','22','33','44','55','66',77,572,'99','1','1111','MobSS','In'),('2017-01-22 10:00:00','222','333','444','555','666',777,888,'999','1','111111','MobSS','In');
/*!40000 ALTER TABLE `verifyrecords` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-03-05 16:20:41
