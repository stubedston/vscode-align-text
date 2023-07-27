
CREATE TABLE `demo` (
	id BIGINT NOT NULL,
	full_name VARCHAR(64),
	flg SMALLINT,
	profile_details TEXT,
	created TIMESTAMP NOT NULL,
	dob date not null,
	PRIMARY KEY (id)
);


INSERT INTO schema.table
VALUES
("1B1V.", "C/O - panic attack", "Read codes v2", "Anxiety - Primary Care"),
("225J.", "O/E - panic attack", "Read codes v2", "Anxiety - Primary Care"),
("8CAZ0", "Patient given advice about management of anxiety", "Read codes v2", "Anxiety - Primary Care"),
("8G52.", "Antiphobic therapy", "Read codes v2", "Anxiety - Primary Care"),
("8G94.", "Anxiety management training", "Read codes v2", "Anxiety - Primary Care"),
("8HHp.", "Referral for guided self-help for anxiety", "Read codes v2", "Anxiety - Primary Care"),
("8IH53", "Referral for guided self-help for anxiety declined", "Read codes v2", "Anxiety - Primary Care"),
("E2001", "Panic disorder", "Read codes v2", "Anxiety - Primary Care"),
("E200111", "Panic attack", "Read codes v2", "Anxiety - Primary Care"),
("E202299", "Agoraphobia", "Read codes v2", "Anxiety - Primary Care"),
("E2023", "Social phobia; fear of eating in public", "Read codes v2", "Anxiety - Primary Care"),
("E2024", "Social phobia; fear of public speaking", "Read codes v2", "Anxiety - Primary Care"),
("E2025", "Social phobia; fear of public washing", "Read codes v2", "Anxiety - Primary Care"),
("E2026", "Acrophobia", "Read codes v2", "Anxiety - Primary Care"),
("E2028", "Claustrophobia", "Read codes v2", "Anxiety - Primary Care"),
("E202z", "Phobic disorder NOS", "Read codes v2", "Anxiety - Primary Care"),
("E202z98", "Needle phobia", "Read codes v2", "Anxiety - Primary Care"),
("E203.", "Obsessive-compulsive disorders", "Read codes v2", "Anxiety - Primary Care"),
("E203.11", "Anancastic neurosis", "Read codes v2", "Anxiety - Primary Care"),
("E2030", "Compulsive neurosis", "Read codes v2", "Anxiety - Primary Care"),
("E2031", "Obsessional neurosis", "Read codes v2", "Anxiety - Primary Care"),
("E203z", "Obsessive-compulsive disorder NOS", "Read codes v2", "Anxiety - Primary Care");
