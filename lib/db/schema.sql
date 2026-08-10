CREATE TABLE IF NOT EXISTS web_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  discord_id VARCHAR(32) NOT NULL UNIQUE,
  username VARCHAR(64) NOT NULL,
  avatar VARCHAR(255) NULL,
  email VARCHAR(255) NULL,
  twitch_id       VARCHAR(32)  NULL,
  twitch_username VARCHAR(64)  NULL,
  twitch_avatar   VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS whitelist_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  discord_id VARCHAR(32) NOT NULL UNIQUE,
  playtime_hours SMALLINT UNSIGNED NULL,
  age TINYINT UNSIGNED NULL,
  character_firstname VARCHAR(64) NULL,
  character_lastname VARCHAR(64) NULL,
  character_age TINYINT UNSIGNED NULL,
  character_background TEXT NULL,
  quiz_attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
  quiz_score TINYINT UNSIGNED NULL,
  quiz_passed BOOLEAN NOT NULL DEFAULT FALSE,
  quiz_seen_ids JSON NULL,
  status ENUM('draft', 'pending', 'talk', 'accepted', 'rejected_quiz', 'rejected_talk') NOT NULL DEFAULT 'draft',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
