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
  `EventName` varchar(40) DEFAULT NULL,
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
  `EventName` varchar(40) DEFAULT NULL,
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
  UNIQUE KEY `AuthCode` (`AuthCode`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deviceheader`
--

LOCK TABLES `deviceheader` WRITE;
/*!40000 ALTER TABLE `deviceheader` DISABLE KEYS */;
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
  `iClassNumber` bigint(20) DEFAULT NULL,
  `StatusID` int(11) NOT NULL,
  `StatusName` varchar(32) NOT NULL,
  `updateTime` varchar(25) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empbadge`
--

LOCK TABLES `empbadge` WRITE;
/*!40000 ALTER TABLE `empbadge` DISABLE KEYS */;
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
  `EventName` varchar(40) NOT NULL,
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
) ENGINE=MyISAM AUTO_INCREMENT=96 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
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
) ENGINE=MyISAM AUTO_INCREMENT=171 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitelist`
--

LOCK TABLES `invitelist` WRITE;
/*!40000 ALTER TABLE `invitelist` DISABLE KEYS */;
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
/*!40000 ALTER TABLE `people` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `test` (
  `field0` varchar(100) DEFAULT NULL,
  `field1` varchar(60) DEFAULT NULL,
  `field2` varchar(60) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
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

-- Dump completed on 2017-11-01 10:03:57
