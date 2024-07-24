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



-- -----------------------------------------------------
-- Table `address`
-- -----------------------------------------------------
CREATE TABLE `address` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `city` VARCHAR(255),
  `country` VARCHAR(255),
  `state` VARCHAR(255),
  `street` VARCHAR(255),
  `zip_code` VARCHAR(255)
);


-- -----------------------------------------------------
-- Table `customer`
-- -----------------------------------------------------
CREATE TABLE `customer` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(255),
  `last_name` VARCHAR(255),
  `email` VARCHAR(255) unique
);


-- -----------------------------------------------------
-- Table `orders`
-- -----------------------------------------------------
CREATE TABLE `orders` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `order_tracking_number` VARCHAR(255),
  `total_price` DECIMAL(19,2),
  `total_quantity` INT,
  `billing_address_id` BIGINT,
  `customer_id` BIGINT,
  `shipping_address_id` BIGINT,
  `status` VARCHAR(128),
  `date_created` TIMESTAMP,
  `last_updated` TIMESTAMP,
  UNIQUE (`billing_address_id`),
  UNIQUE (`shipping_address_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  FOREIGN KEY (`billing_address_id`) REFERENCES `address` (`id`),
  FOREIGN KEY (`shipping_address_id`) REFERENCES `address` (`id`)
);


-- -----------------------------------------------------
-- Table `order_item`
-- -----------------------------------------------------
CREATE TABLE `order_item` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `image_url` VARCHAR(255),
  `quantity` INT,
  `unit_price` DECIMAL(19,2),
  `order_id` BIGINT,
  `product_id` BIGINT,
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
);