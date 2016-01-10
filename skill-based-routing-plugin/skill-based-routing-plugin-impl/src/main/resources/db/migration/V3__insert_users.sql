INSERT INTO ACT_ID_USER(ID_, REV_, FIRST_, LAST_, EMAIL_, PWD_, PICTURE_ID_) VALUES
('Jo', 1, 'Jo', 'E.', '', '{SHA}P+cLJJRgQRclbM5kZzkqER4FeXw=', NULL),
('Simon', 1, 'Simon', 'Z.', '', '{SHA}P+cLJJRgQRclbM5kZzkqER4FeXw=', NULL),
('Jan', 1, 'Jan', 'G.', '', '{SHA}P+cLJJRgQRclbM5kZzkqER4FeXw=', NULL),
('Ines', 1, 'Ines', NULL, '', '{SHA}P+cLJJRgQRclbM5kZzkqER4FeXw=', NULL),
('Herbert', 1, 'Herbert', NULL, '', '{SHA}P+cLJJRgQRclbM5kZzkqER4FeXw=', NULL),
('Andreas', 1, 'Andreas', NULL, '', '{SHA}P+cLJJRgQRclbM5kZzkqER4FeXw=', NULL),
('Emma', 1, 'Emma', NULL, '', '{SHA}P+cLJJRgQRclbM5kZzkqER4FeXw=', NULL),
('Sonja', 1, 'Sonja', NULL, '', '{SHA}P+cLJJRgQRclbM5kZzkqER4FeXw=', NULL),
('Xaver', 1, 'Xaver', NULL, '', '{SHA}P+cLJJRgQRclbM5kZzkqER4FeXw=', NULL),
('Hanna', 1, 'Hanna', NULL, '', '{SHA}P+cLJJRgQRclbM5kZzkqER4FeXw=', NULL),
('Bernd', 1, 'Bernd', NULL, '', '{SHA}P+cLJJRgQRclbM5kZzkqER4FeXw=', NULL),
('Tom', 1, 'Tom', NULL, '', '{SHA}P+cLJJRgQRclbM5kZzkqER4FeXw=', NULL);

INSERT INTO ACT_ID_GROUP(ID_) VALUES ('camunda-admin');

INSERT INTO ACT_ID_MEMBERSHIP(USER_ID_, GROUP_ID_) VALUES
('Jo', 'camunda-admin'),
('Simon', 'camunda-admin'),
('Jan', 'camunda-admin');

