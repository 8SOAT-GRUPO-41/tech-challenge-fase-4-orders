CREATE TYPE order_status AS ENUM (
    'AWAITING_PAYMENT',
    'PAID',
    'RECEIVED',
    'IN_PREPARATION',
    'READY',
    'COMPLETED'
);

CREATE TABLE orders (
    order_id      TEXT NOT NULL,
    customer_id   TEXT NOT NULL,
    total         DECIMAL(10, 2) NOT NULL,
    status        order_status NOT NULL,
    created_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT orders_pkey PRIMARY KEY (order_id)
);

CREATE TABLE order_products (
    order_id   TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity   INTEGER NOT NULL DEFAULT 1,
    price      DECIMAL(10, 2) NOT NULL,

    CONSTRAINT pk_order_products PRIMARY KEY (order_id, product_id),
    CONSTRAINT fk_order
        FOREIGN KEY (order_id)
        REFERENCES orders (order_id)
        ON DELETE CASCADE
);
