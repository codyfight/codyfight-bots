CREATE TABLE bots (
    ckey VARCHAR(255) NOT NULL,
    player_id INT NOT NULL,
	environment VARCHAR(255) NOT NULL DEFAULT 'production',
    mode INT NOT NULL,
    move_strategy VARCHAR(255) NOT NULL,
    cast_strategy VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'stopped',
    PRIMARY KEY (ckey)
);
