CREATE TABLE statuses (
                          status_id SERIAL PRIMARY KEY,
                          name VARCHAR(255) UNIQUE
);


CREATE TABLE transitions (
                             trans_id SERIAL PRIMARY KEY,
                             name VARCHAR(255) UNIQUE,
                             from_id INT,
                             to_id INT,
                             CONSTRAINT fk_from FOREIGN KEY(from_id) REFERENCES statuses(status_id),
                             CONSTRAINT fk_to FOREIGN KEY(to_id) REFERENCES statuses(status_id)
);
