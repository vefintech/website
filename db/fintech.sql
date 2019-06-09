-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.1.38-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             10.1.0.5464
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Volcando estructura para tabla fintechve.ally
CREATE TABLE IF NOT EXISTS `ally` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(100) NOT NULL,
  `business_name` varchar(250) NOT NULL,
  `image` text,
  `dni` varchar(250) NOT NULL,
  `address` text,
  `phone` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `contact` varchar(50) NOT NULL,
  `activity` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ally_email` (`email`),
  UNIQUE KEY `UK_ally_dni` (`dni`),
  CONSTRAINT `FK_ally_user` FOREIGN KEY (`email`) REFERENCES `user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla fintechve.ally: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `ally` DISABLE KEYS */;
/*!40000 ALTER TABLE `ally` ENABLE KEYS */;

-- Volcando estructura para vista fintechve.asocciates
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `asocciates` (
	`type` VARCHAR(11) NOT NULL COLLATE 'utf8mb4_general_ci',
	`id` INT(11) NOT NULL,
	`uid` VARCHAR(100) NOT NULL COLLATE 'latin1_swedish_ci',
	`email` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',
	`names` VARCHAR(250) NOT NULL COLLATE 'latin1_swedish_ci',
	`phone` VARCHAR(20) NULL COLLATE 'latin1_swedish_ci',
	`nacionality` VARCHAR(250) NULL COLLATE 'latin1_swedish_ci',
	`city` VARCHAR(250) NOT NULL COLLATE 'latin1_swedish_ci',
	`address` TEXT NULL COLLATE 'latin1_swedish_ci',
	`activity` TEXT NOT NULL COLLATE 'latin1_swedish_ci',
	`created_at` TIMESTAMP NULL,
	`image` TEXT NULL COLLATE 'latin1_swedish_ci',
	`answer` TEXT NOT NULL COLLATE 'latin1_swedish_ci',
	`dni` VARCHAR(250) NOT NULL COLLATE 'latin1_swedish_ci',
	`birthdate` VARCHAR(10) NULL COLLATE 'utf8mb4_general_ci',
	`contact` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',
	`employees` VARCHAR(5) NOT NULL COLLATE 'latin1_swedish_ci',
	`phase` ENUM('Semilla','Pruebas','En Marcha') NULL COLLATE 'latin1_swedish_ci',
	`services` TEXT NOT NULL COLLATE 'latin1_swedish_ci'
) ENGINE=MyISAM;

-- Volcando estructura para tabla fintechve.entrepreneur
CREATE TABLE IF NOT EXISTS `entrepreneur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(100) NOT NULL,
  `names` varchar(250) NOT NULL,
  `image` text,
  `city` varchar(250) NOT NULL,
  `nationality` varchar(250) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `entrepreneurship` varchar(150) NOT NULL,
  `phase` enum('Semilla','Pruebas','En Marcha') NOT NULL DEFAULT 'Semilla',
  `services` text NOT NULL,
  `answer` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_entrepreneur_email` (`email`),
  CONSTRAINT `FK_entrepreneur_user` FOREIGN KEY (`email`) REFERENCES `user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla fintechve.entrepreneur: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `entrepreneur` DISABLE KEYS */;
/*!40000 ALTER TABLE `entrepreneur` ENABLE KEYS */;

-- Volcando estructura para tabla fintechve.legal
CREATE TABLE IF NOT EXISTS `legal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(100) NOT NULL,
  `business_name` varchar(250) NOT NULL,
  `image` text,
  `dni` varchar(250) NOT NULL,
  `address` text,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `contact` varchar(50) NOT NULL,
  `employees` enum('0','1-3','3-5','5-10','10-50','50+') NOT NULL DEFAULT '0',
  `activity` text NOT NULL,
  `answer` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_legal_email` (`email`),
  UNIQUE KEY `UK_legal_dni` (`dni`),
  CONSTRAINT `FK_legal_user` FOREIGN KEY (`email`) REFERENCES `user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla fintechve.legal: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `legal` DISABLE KEYS */;
/*!40000 ALTER TABLE `legal` ENABLE KEYS */;

-- Volcando estructura para tabla fintechve.personal
CREATE TABLE IF NOT EXISTS `personal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(100) NOT NULL,
  `names` varchar(250) NOT NULL,
  `city` varchar(250) NOT NULL,
  `nationality` varchar(250) NOT NULL,
  `birthdate` date DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `answer` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_personal_email` (`email`),
  CONSTRAINT `FK_personal_user` FOREIGN KEY (`email`) REFERENCES `user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla fintechve.personal: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `personal` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal` ENABLE KEYS */;

-- Volcando estructura para tabla fintechve.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `last_login` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('INACTIVE','ACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `rol` enum('ADMIN','USER') NOT NULL DEFAULT 'USER',
  `uid` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla fintechve.user: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `email`, `password`, `last_login`, `status`, `rol`, `uid`, `created_at`) VALUES
	(37, 'admin@admin.com', '$2b$10$mCYFErWgVkPT/5n8aR/J0O2z6YAVw9NXn1fIINe3cgXqFbmijRgJa', '2018-11-29 22:42:48', 'ACTIVE', 'ADMIN', '5465446', '2018-11-29 22:42:28');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

-- Volcando estructura para vista fintechve.asocciates
-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `asocciates`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `asocciates` AS SELECT 'PERSONAL' as type,u.id,p.uid, p.email, p.names, p.phone , 
'' as nacionality, p.city, '' as address, '' as activity, u.created_at, 
'' as image, p.answer, '' as dni,  DATE_FORMAT(p.birthdate, "%d-%m-%Y") as birthdate,
'' as contact, '' as employees, null as phase, '' as services
FROM personal p, user u
WHERE p.email = u.email AND u.rol='USER'
UNION
SELECT 'LEGAL' as type,u.id,l.uid, l.email, l.business_name, l.phone , 
'' as nacionality, '' as city, l.address, l.activity,u.created_at, 
l.image, l.answer, l.dni, null as birthdate,
l.contact as contact, l.employees as employees, null as phase, '' as services
FROM legal l, user u
WHERE l.email = u.email AND u.rol='USER'
UNION
SELECT 'ENTREPENEUR' as type,u.id,e.uid, e.email, e.names, e.phone , 
e.nationality, e.city, '' as address, e.entrepreneurship as activity,e.created_at,
e.image, e.answer, '' as dni, null as birthdate,
'' as contact, '' as employees, e.phase , e.services 
FROM entrepreneur e, user u
WHERE e.email = u.email AND u.rol='USER'
UNION
SELECT 'ALLY' as type,u.id,a.uid, a.email, a.business_name, a.phone ,
 '' as nacionality, '' as city, a.address, a.activity,u.created_at,
 a.image, '' as answer, a.dni, null as birthdate,
 a.contact as contact, '' as employees, null as phase, '' as services
FROM ally a, user u
WHERE a.email = u.email AND u.rol='USER' ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
