-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Jan 06, 2021 at 10:52 PM
-- Server version: 8.0.22
-- PHP Version: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `birouri`
--

CREATE TABLE `birouri` (
  `id` int NOT NULL,
  `nume` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `birouri`
--

INSERT INTO `birouri` (`id`, `nume`) VALUES
(1, 'birou 1'),
(2, 'birou 2'),
(3, 'birou 3'),
(4, 'birou 4');

-- --------------------------------------------------------

--
-- Table structure for table `birouri_departamente`
--

CREATE TABLE `birouri_departamente` (
  `id` int NOT NULL,
  `bid` int NOT NULL,
  `did` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `birouri_departamente`
--

INSERT INTO `birouri_departamente` (`id`, `bid`, `did`) VALUES
(1, 1, 1),
(2, 4, 1),
(3, 2, 2),
(4, 3, 2),
(5, 3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `departamente`
--

CREATE TABLE `departamente` (
  `id` int NOT NULL,
  `nume` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `departamente`
--

INSERT INTO `departamente` (`id`, `nume`) VALUES
(1, 'departament 1'),
(2, 'departament 2'),
(3, 'departament 3');

-- --------------------------------------------------------

--
-- Table structure for table `salariati`
--

CREATE TABLE `salariati` (
  `id` int NOT NULL,
  `nume` varchar(40) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `prenume` varchar(40) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `data_nasterii` date DEFAULT NULL,
  `departament` int NOT NULL DEFAULT '0',
  `birou` int NOT NULL DEFAULT '0',
  `manager` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `salariati`
--

INSERT INTO `salariati` (`id`, `nume`, `prenume`, `email`, `data_nasterii`, `departament`, `birou`, `manager`) VALUES
(1, 'nume1', 'prenume1', 'email@unu.com', '2021-01-01', 1, 1, 0),
(2, 'nume2', 'prenume2', 'email@doi.com', '2021-01-02', 2, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `utilizatori`
--

CREATE TABLE `utilizatori` (
  `id` int NOT NULL,
  `nume` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `parola` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `sesiune` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `utilizatori`
--

INSERT INTO `utilizatori` (`id`, `nume`, `parola`, `sesiune`) VALUES
(1, 'test', 'test', '6c58b5cdf156bd54401da1afd736f56d'),
(15, 'root', 'root', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `birouri`
--
ALTER TABLE `birouri`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `birouri_departamente`
--
ALTER TABLE `birouri_departamente`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departamente`
--
ALTER TABLE `departamente`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salariati`
--
ALTER TABLE `salariati`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `utilizatori`
--
ALTER TABLE `utilizatori`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `birouri`
--
ALTER TABLE `birouri`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `birouri_departamente`
--
ALTER TABLE `birouri_departamente`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `departamente`
--
ALTER TABLE `departamente`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `salariati`
--
ALTER TABLE `salariati`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `utilizatori`
--
ALTER TABLE `utilizatori`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
