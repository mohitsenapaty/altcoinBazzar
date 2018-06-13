CREATE TABLE user_login(
    user_id SERIAL UNIQUE NOT NULL,
    user_name VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    phone NUMERIC(10) UNIQUE NOT NULL,
    email VARCHAR(80) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    PRIMARY KEY (user_id)
);
CREATE INDEX user_id on user_login(user_id);
CREATE INDEX user_name on user_login(user_name);
CREATE INDEX email on user_login(email);

CREATE TABLE user_profile(
    id SERIAL,
    user_id INT UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    kyc_status BOOLEAN DEFAULT false,
    creation_time TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_login(user_id)
);
CREATE INDEX user_id_profile on user_profile(user_id);

CREATE TABLE login_status(
    id SERIAL,
    user_id INT NOT NULL,
    login_status BOOLEAN NOT NULL,
    login_ip VARCHAR(15),
    last_login TIMESTAMP,
    last_login_ip VARCHAR(15),
    PRIMARY KEY (id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_login(user_id)
);
CREATE INDEX user_id_login on login_status(user_id);

CREATE TABLE kyc(
    id SERIAL,
	user_id INT UNIQUE NOT NULL,
    aadhar_name VARCHAR(50) NOT NULL,
    aadhar NUMERIC(12) UNIQUE NOT NULL,
	pan VARCHAR(10) UNIQUE NOT NULL,
	dob date NOT NULL,
	address TEXT NOT NULL,
	city VARCHAR(30) NOT NULL,
	state VARCHAR(20) NOT NULL,
	pincode NUMERIC(6) NOT NULL,
	residential_status VARCHAR(10) NOT NULL,
    aadhar_image TEXT,
    pan_image TEXT,
    photograph TEXT,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_login(user_id)
);
CREATE INDEX user_id_kyc on kyc(user_id);

CREATE TABLE bank(
    id SERIAL,
    user_id INT UNIQUE NOT NULL,
    bank_name VARCHAR(50) NOT NULL,
    ifsc VARCHAR(20) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    account_no VARCHAR(30) NOT NULL,
    account_holder_name TEXT NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    account_mobile_no NUMERIC(10) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_login(user_id)
);
CREATE INDEX user_id_bank on bank(user_id);

CREATE TABLE imps_payment_method(
    payment_id SERIAL,
    bank_name VARCHAR(50) NOT NULL,
    ifsc VARCHAR(20) NOT NULL,
    account_no VARCHAR(30) NOT NULL,
    account_holder_name TEXT NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    status VARCHAR(1) NOT NULL,
    PRIMARY KEY (payment_id)
);
CREATE INDEX payment_id_imps on imps_payment_method(payment_id);

CREATE TABLE upi_payment_method(
    payment_id SERIAL,
    upi_address TEXT NOT NULL,
    status VARCHAR(1) NOT NULL,
    PRIMARY KEY (payment_id)
);
CREATE INDEX payment_id_upi on upi_payment_method(payment_id);

CREATE TABLE paytm_payment_method(
    payment_id SERIAL,
    paytm_number VARCHAR(12) NOT NULL,
    status VARCHAR(1) NOT NULL,
    PRIMARY KEY (payment_id)
);
CREATE INDEX payment_id_paytm on paytm_payment_method(payment_id);

CREATE TABLE general_payment_method(
    id SERIAL,
    user_id INT NOT NULL,
    payment_type VARCHAR(20) NOT NULL,
    payment_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_login(user_id)
);
CREATE INDEX user_id_gpm on general_payment_method(user_id);
CREATE INDEX payment_id_gpm on general_payment_method(payment_id);

/*
CREATE TABLE wallet(
    id SERIAL,
    user_id INT UNIQUE NOT NULL,
    inr FLOAT(12) NOT NULL,
    bitcoin FLOAT(12) NOT NULL,
    bitcoin_cash FLOAT(12) NOT NULL,
    litecoin FLOAT(12) NOT NULL,
    ripple FLOAT(12) NOT NULL,
    omisego FLOAT(12) NOT NULL,
    ethereum FLOAT(12) NOT NULL,
    request FLOAT(12) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_login(user_id)
);

CREATE INDEX user_id_wallet on wallet(user_id);
*/
CREATE TABLE quotes(
    id SERIAL,
    user_id INT UNIQUE NOT NULL,
    side VARCHAR(10) NOT NULL,
    order_type VARCHAR(10) NOT NULL,
    order_price FLOAT(20) NOT NULL,
    order_quantity FLOAT(20) NOT NULL,
    order_time TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_login(user_id)
);

CREATE INDEX user_id_quotes on quotes(user_id);


CREATE TABLE storage_wallet_test(
    id SERIAL,
    token_symbol VARCHAR(30) NOT NULL,
    token_name VARCHAR(300) NOT NULL,
    quant NUMERIC (10,6) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE quant_wallet_test_user(
    id SERIAL,
    user_id INT UNIQUE NOT NULL,
    token_symbol VARCHAR(30) NOT NULL,
    token_name VARCHAR(300) NOT NULL,
    quant NUMERIC(10,6) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_login(user_id)
);

CREATE INDEX user_id_quant_wallet_test_user on quant_wallet_test_user(user_id);
CREATE INDEX token_symbol_quant_wallet_test_user on quant_wallet_test_user(token_symbol);
CREATE INDEX token_name_quant_wallet_test_user on quant_wallet_test_user(token_name);


CREATE TABLE ether_wallet_test_master(
    wallet_id SERIAL,
    quant NUMERIC(10,6) NOT NULL,
    priv_key VARCHAR(300) NOT NULL,
    pub_key VARCHAR(300) NOT NULL,
    address VARCHAR(300) NOT NULL,
    PRIMARY KEY (wallet_id)
);

CREATE TABLE ether_wallet_test_deposit(
    deposit_id SERIAL,
    transaction_hash VARCHAR(300) NOT NULL,
    from_addr VARCHAR(300) NOT NULL,
    to_addr VARCHAR(300) NOT NULL,
    user_id INT NOT NULL,
    quant NUMERIC(10,6) NOT NULL,
    last_updated TIMESTAMP NOT NULL,
    status VARCHAR(30) NOT NULL,
    PRIMARY KEY (deposit_id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_login(user_id)
);

CREATE INDEX user_id_ether_wallet_test_deposit on ether_wallet_test_deposit(user_id);
CREATE INDEX transaction_hash_ether_wallet_test_deposit on ether_wallet_test_deposit(transaction_hash);
CREATE INDEX from_addr_ether_wallet_test_deposit on ether_wallet_test_deposit(from_addr);
CREATE INDEX to_addr_ether_wallet_test_deposit on ether_wallet_test_deposit(to_addr);

CREATE TABLE ether_wallet_test_withdrawal(
    withdrawl_id SERIAL,
    user_id INT NOT NULL,
    quant NUMERIC (10,6) NOT NULL,
    from_addr VARCHAR(300) NOT NULL,
    to_addr VARCHAR(300) NOT NULL,
    time_withdrawl TIMESTAMP NOT NULL,
    transaction_hash VARCHAR (300) NOT NULL,
    status VARCHAR (30),
    PRIMARY KEY (withdrawl_id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_login(user_id)
);

CREATE INDEX user_id_ether_wallet_test_withdrawal on ether_wallet_test_withdrawal(user_id);

CREATE INDEX transaction_hash_ether_wallet_test_withdrawal on ether_wallet_test_withdrawal(transaction_hash);
CREATE INDEX from_addr_ether_wallet_test_withdrawal on ether_wallet_test_withdrawal(from_addr);
CREATE INDEX to_addr_ether_wallet_test_withdrawal on ether_wallet_test_withdrawal(to_addr);

CREATE TABLE ether_wallet_test_user(
    id SERIAL,
    user_id INT UNIQUE NOT NULL,
    priv_key VARCHAR(300) NOT NULL,
    pub_key VARCHAR(300) NOT NULL,
    address VARCHAR(300) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_login(user_id)
);


CREATE INDEX user_id_ether_wallet_test_user on bitcoin_wallet_test_user(user_id);
CREATE INDEX address_ether_wallet_test_user on bitcoin_wallet_test_user(address);

CREATE TABLE bitcoin_wallet_test_user(
    id SERIAL,
    user_id INT UNIQUE NOT NULL,
    priv_key VARCHAR(300) NOT NULL,
    pub_key VARCHAR(300) NOT NULL,
    address VARCHAR(300) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_login(user_id)
);


CREATE INDEX user_id_bitcoin_wallet_test_user on bitcoin_wallet_test_user(user_id);
CREATE INDEX address_bitcoin_wallet_test_user on bitcoin_wallet_test_user(address);

CREATE TABLE bitcoin_wallet_test_master(
    wallet_id SERIAL,
    num_inputs INT NOT NULL,
    quant NUMERIC (10,6) NOT NULL,
    priv_key VARCHAR(300) NOT NULL,
    pub_key VARCHAR(300) NOT NULL,
    address VARCHAR(300) NOT NULL,
    PRIMARY KEY (wallet_id)
);

CREATE TABLE bitcoin_wallet_test_deposit(
    deposit_id SERIAL,
    transaction_hash VARCHAR(300) NOT NULL,
    from_addr VARCHAR(300) NOT NULL,
    to_addr VARCHAR(300) NOT NULL,
    user_id INT NOT NULL,
    quant NUMERIC(10,6) NOT NULL,
    last_updated TIMESTAMP NOT NULL,
    status VARCHAR(30) NOT NULL,
    PRIMARY KEY (deposit_id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_login(user_id)
);

CREATE INDEX transaction_hash_bitcoin_wallet_test_deposit on bitcoin_wallet_test_deposit(transaction_hash);
CREATE INDEX from_addr_bitcoin_wallet_test_deposit on bitcoin_wallet_test_deposit(from_addr);
CREATE INDEX to_addr_bitcoin_wallet_test_deposit on bitcoin_wallet_test_deposit(to_addr);
CREATE INDEX user_id_bitcoin_wallet_test_deposit on bitcoin_wallet_test_deposit(user_id);


CREATE TABLE bitcoin_wallet_test_withdrawal(
    withdrawl_id SERIAL,
    user_id INT NOT NULL,
    quant NUMERIC (10,6) NOT NULL,
    from_addr VARCHAR(300) NOT NULL,
    to_addr VARCHAR(300) NOT NULL,
    time_withdrawl TIMESTAMP NOT NULL,
    transaction_hash VARCHAR (300) NOT NULL,
    status VARCHAR (30),
    PRIMARY KEY (withdrawl_id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_login(user_id)
);

CREATE INDEX transaction_hash_bitcoin_wallet_test_withdrawal on bitcoin_wallet_test_withdrawal(transaction_hash);
CREATE INDEX from_addr_bitcoin_wallet_test_withdrawal on bitcoin_wallet_test_withdrawal(from_addr);
CREATE INDEX to_addr_bitcoin_wallet_test_withdrawal on bitcoin_wallet_test_withdrawal(to_addr);
CREATE INDEX user_id_bitcoin_wallet_test_withdrawal on bitcoin_wallet_test_withdrawal(user_id);

