-- Roles
INSERT INTO Role (IdRole, Name)
VALUES (1, 'Admin'),
       (2, 'User');

-- Users
INSERT INTO [User] (FirstName, LastName, PhoneNumber, Login, Password, IdRole)
VALUES ('Colt', 'Capperune', '605325123', 'coltcapperune', 'passwd', 2),
       ('Robert', 'James', '123325123', 'robertjames', 'passwd', 2),
       ('Tay', 'Keith', '789456123', 'taykeith', 'passwd', 2),
       ('Bob', 'Katz', '456123789', 'bobkatz', 'passwd', 2),
       ('Jan', 'Kowalski', '111222333', 'jankowalski', 'passwd', 2),
       ('Tomasz', N'Wróblewski', '555666777', 'tomaszwroblewski', 'passwd', 2),
       ('Emily', 'Carter', '555333888', 'emilycarter', 'passwd', 2),
       ('Jake', 'Smith', '222444555', 'jakesmith', 'passwd', 2),
       ('Anna', 'Brown', '111555222', 'annabrown', 'passwd', 2),
       ('Lucas', 'Johnson', '777888999', 'lucasjohnson', 'passwd', 2),
       ('Sophia', 'Garcia', '333444111', 'sophiagarcia', 'passwd', 2),
       ('Liam', 'Williams', '444555666', 'liamwilliams', 'passwd', 2),
       ('Mia', 'Martinez', '555666777', 'miamartinez', 'passwd', 2),
       ('Noah', 'Hernandez', '888999000', 'noahhernandez', 'passwd', 2),
       ('Oliver', 'Wilson', '222333444', 'oliverwilson', 'passwd', 2),
       ('Isabella', 'Moore', '666777888', 'isabellamoore', 'passwd', 2),
       ('Aiden', 'Taylor', '999000111', 'aidentaylor', 'passwd', 2),
       ('Charlotte', 'Anderson', '444888777', 'charlotteanderson', 'passwd', 2),
       ('James', 'Thomas', '777555444', 'jamesthomas', 'passwd', 2),
       ('Ethan', 'Martin', '333777555', 'ethanmartin', 'passwd', 2),
       ('Ava', 'Jackson', '555999111', 'avajackson', 'passwd', 2);

-- Skills
INSERT INTO Skill (IdSkill, Name)
VALUES (1, 'Audio restoration'),
       (2, 'Vocal tuning'),
       (3, 'Arrangement'),
       (4, 'Critical hearing');

-- User Skills
INSERT INTO UserSkill (IdUser, IdSkill)
VALUES (1, 2),
       (1, 3),
       (2, 3),
       (3, 1),
       (4, 2),
       (5, 3),
       (6, 1),
       (6, 4),
       (7, 1),
       (8, 2),
       (9, 3),
       (10, 4),
       (11, 1),
       (12, 3),
       (13, 2),
       (14, 4),
       (15, 1),
       (16, 2),
       (17, 3),
       (18, 4),
       (19, 1),
       (20, 2);

-- Types
INSERT INTO Type (IdType, Name)
VALUES (1, 'Mixing'),
       (2, 'Producing'),
       (3, 'Mastering');

-- Adverts
INSERT INTO Advert (Description, WaitTime, Price, IdType)
VALUES ('Grammy-winning engineer offering to mix audio for cheap! With years of experience, I bring professional skills, cutting-edge tools, and a passion for delivering high-quality mixes. Whether you are an indie artist or a seasoned musician, I am dedicated to making your tracks stand out. Let’s create something extraordinary together at an unbeatable price!',
        7, 200, 1),
       ('Awarded engineer, worked with many mainstream artists, offering unmatched expertise in mixing and producing. My credits include chart-topping albums and Grammy-nominated tracks. If you’re looking for someone who can understand your vision and elevate your music to industry standards, look no further. Collaborate with a trusted professional!',
        12, 150, 2),
       ('Multi-diamond-winning producer willing to collaborate with aspiring and established artists. My production style blends creativity with technical excellence. Whether you need beats, arrangements, or full production, I’ll help you bring your musical ideas to life. Work with a producer whose name has been on countless hits worldwide!',
        10, 300, 2),
       ('University professor in audio engineering, willing to work with artists of all levels. I bring decades of teaching, research, and studio experience. My expertise spans mixing, mastering, and production. Whether it’s a commercial track or an academic project, I’m committed to delivering results that exceed your expectations.',
        14, 400, 3),
       ('Top-notch arranger offering innovative ideas to transform your musical compositions into masterpieces. My arrangements span a variety of genres and styles, from orchestral to contemporary. I work closely with artists to ensure the final arrangement enhances their vision. Let’s craft something truly exceptional!',
        5, 250, 1),
       ('Best of the best, offering the most complex mixes in the industry! With unparalleled attention to detail and years of professional experience, I ensure every element of your track shines. I specialize in high-quality mixing for all genres, from pop to rock and beyond. Take your music to the next level with a world-class engineer!',
        14, 500, 1),
       ('Experienced mixing engineer for affordable rates. I specialize in bringing clarity, balance, and depth to your music. Using state-of-the-art equipment and industry-leading techniques, I deliver professional mixes that compete with today’s top tracks. Whether it’s a single or a full album, I’m here to make your music stand out!',
        7, 180, 1),
       ('Professional vocal producer specializing in pop vocals. I’ll ensure your vocal performance sounds polished, emotive, and ready for release. From pitch correction to vocal layering, I bring a wealth of knowledge and experience to enhance your tracks. Let’s make your vocals shine in the mix!',
        10, 220, 2),
       ('Creative sound designer with a focus on cinematic scoring. I craft immersive soundscapes and intricate audio designs for films, games, and commercials. If you need unique sound effects, atmospheres, or music compositions that captivate audiences, I’m the designer you’re looking for!',
        15, 350, 3),
       ('Audio mastering services with guaranteed industry standards. I focus on making your tracks sound professional, balanced, and ready for distribution across all platforms. With years of mastering experience, I ensure your music meets the highest quality benchmarks. Let’s finalize your project with excellence!',
        5, 400, 3),
       ('Music arranger offering unique orchestral arrangements that breathe life into your compositions. From classical pieces to modern hybrids, I create arrangements that bring out the best in your melodies. Let’s work together to transform your musical ideas into powerful, emotional experiences.',
        12, 300, 1),
       ('Affordable sound restoration services for podcasts and audio recordings. I specialize in cleaning up background noise, enhancing clarity, and repairing damaged audio. Whether it’s a podcast, interview, or archival recording, I’ll help ensure your content is crisp and professional!',
        6, 150, 1),
       ('Mix and mastering combo package with a fast turnaround. I offer seamless integration of mixing and mastering services to save you time and ensure consistency. With a focus on delivering quality and meeting tight deadlines, I’m your go-to engineer for all-in-one audio services!',
        10, 250, 1),
       ('Award-winning producer offering coaching for young talent. I provide one-on-one mentorship to help you hone your skills, understand the industry, and achieve your musical goals. Whether you’re just starting or looking to take your career to the next level, I’m here to guide you.',
        14, 500, 2),
       ('Specialized sound engineer for live performance recordings. I bring expertise in capturing the energy and emotion of live events. Whether it’s a concert, conference, or performance, I ensure high-quality recordings that preserve the essence of the moment. Let’s capture your event with precision and care!',
        9, 275, 2),
       ('Creative producer helping to craft your unique sound. I work closely with artists to develop their identity and refine their music. From pre-production to final mastering, I’m here to support your artistic vision and make your tracks unforgettable. Let’s create something truly original!',
        8, 320, 2);


-- Statuses
INSERT INTO Status (IdStatus, Name)
VALUES (1, 'Active'),
       (2, 'Inactive');

-- User Adverts
INSERT INTO UserAdvert (IdUser, IdAdvert, IdStatus)
VALUES (1, 1, 1),
       (2, 2, 1),
       (3, 3, 1),
       (4, 4, 1),
       (5, 5, 1),
       (6, 6, 1),
       (7, 7, 1),
       (8, 8, 1),
       (9, 9, 1),
       (10, 10, 1),
       (11, 11, 1),
       (12, 12, 1),
       (13, 13, 1),
       (14, 14, 1),
       (15, 15, 1),
       (16, 16, 1);