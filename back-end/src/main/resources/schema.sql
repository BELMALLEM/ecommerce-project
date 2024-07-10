-- -----------------------------------------------------
-- Table `product_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS product_category (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(255)
);

-- -----------------------------------------------------
-- Table `product`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS product (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(255),
  name VARCHAR(255),
  description VARCHAR(255),
  unit_price DECIMAL(13,2),
  image_url VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  units_in_stock INT,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  category_id BIGINT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES product_category(id)
);

-- -----------------------------------------------------
-- Table `country`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS country (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(2) NOT NULL,
  name VARCHAR(255) NOT NULL
);

-- -----------------------------------------------------
-- Table `state`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS state (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country_id INT NOT NULL,
  FOREIGN KEY (country_id) REFERENCES country(id)
);