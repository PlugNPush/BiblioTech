# Important

Nécessaire d'ajouter un fichier *data_db.py* dans ce répertoire qui contient le texte suivant :
```py
user = "userBDD"
mdp = "mdpBDD"
```
Ce sont les mêmes informations que pour le server

Faut installer :
```zsh
pip install pandas
pip install sqlalchemy
pip install scikit-learn
pip install fuzzywuzzy
```
    

Ligne 10 il faut changer le mot de passe et le username : mysql://username:mdp@localhost:3306/db_master_project

Insert que j'ai utiliser pour l'exemple

```sql
INSERT into user (firstname, lastname, email, password) values ('john', 'doe', 'john.doe@example.com', 'test');

INSERT INTO book (title, owner, author, year, type, nbBooks, publisher, price_old, price_new, rating)
VALUES
('1984', 'john.doe@example.com', 'George Orwell', '1949', 'Dystopian', 1, 'Secker & Warburg', '10.00', '8.00', 5),
('To Kill a Mockingbird', 'john.doe@example.com', 'Harper Lee', '1960', 'Southern Gothic, Bildungsroman', 1, 'J. B. Lippincott & Co.', '12.00', '10.00', 5),
('The Great Gatsby', 'john.doe@example.com', 'F. Scott Fitzgerald', '1925', 'Tragedy', 1, 'Charles Scribner\'s Sons', '15.00', '12.00', 4),
('Moby Dick', 'john.doe@example.com', 'Herman Melville', '1851', 'Adventure', 1, 'Harper & Brothers', '20.00', '18.00', 4),
('War and Peace', 'john.doe@example.com', 'Leo Tolstoy', '1869', 'Historical Fiction', 1, 'The Russian Messenger', '25.00', '22.00', 5),
('Pride and Prejudice', 'john.doe@example.com', 'Jane Austen', '1813', 'Romance', 1, 'T. Egerton', '14.00', '12.00', 4),
('Ulysses', 'john.doe@example.com', 'James Joyce', '1922', 'Modernist', 1, 'Sylvia Beach', '18.00', '16.00', 4),
('The Catcher in the Rye', 'john.doe@example.com', 'J.D. Salinger', '1951', 'Realistic Fiction', 1, 'Little, Brown and Company', '12.00', '10.00', 4),
('The Hobbit', 'john.doe@example.com', 'J.R.R. Tolkien', '1937', 'Fantasy', 1, 'George Allen & Unwin', '20.00', '18.00', 5),
('Don Quixote', 'john.doe@example.com', 'Miguel de Cervantes', '1605', 'Adventure', 1, 'Francisco de Robles', '22.00', '20.00', 4);

INSERT INTO book (title, owner, author, year, type, publisher, rating) VALUES ('Rails Cookbook: Recipes for Rapid Web Development with Ruby', 'john.doe@example.com', 'Unknown', '2023', 'Fiction', 'Unknown Publisher', -1);
INSERT INTO book (title, owner, author, year, type, publisher, rating) VALUES ('Anna Karenina', 'john.doe@example.com', 'Leo Tolstoy', '2023', 'Fiction', 'Unknown Publisher', -1);
INSERT INTO book (title, owner, author, year, type, publisher, rating) VALUES ('CliffsNotes on Tolstoys Anna Karenina', 'john.doe@example.com', 'Leo Tolstoy', '2023', 'Fiction', 'Unknown Publisher', -1);
INSERT INTO book (title, owner, author, year, type, publisher, rating) VALUES ('Dinner with Anna Karenina', 'john.doe@example.com', 'Unknown', '2023', 'Fiction', 'Unknown Publisher', -1);
INSERT INTO book (title, owner, author, year, type, publisher, rating) VALUES ('Tolstoy: Anna Karenina', 'john.doe@example.com', 'Leo Tolstoy', '2023', 'Fiction', 'Unknown Publisher', -1);
INSERT INTO book (title, owner, author, year, type, publisher, rating) VALUES ('Untouchable', 'john.doe@example.com', 'Unknown', '2023', 'Fiction', 'Unknown Publisher', -1);
INSERT INTO book (title, owner, author, year, type, publisher, rating) VALUES ('The Untouchable', 'john.doe@example.com', 'Unknown', '2023', 'Fiction', 'Unknown Publisher', -1);
INSERT INTO book (title, owner, author, year, type, publisher, rating) VALUES ('The Untouchables', 'john.doe@example.com', 'Unknown', '2023', 'Fiction', 'Unknown Publisher', -1);
INSERT INTO book (title, owner, author, year, type, publisher, rating) VALUES ('Untouchables: My Familys Triumphant Journey Out of the Caste System in Modern India', 'john.doe@example.com', 'Unknown', '2023', 'Fiction', 'Unknown Publisher', -1);
INSERT INTO book (title, owner, author, year, type, publisher, rating) VALUES ('Dalit: The Black Untaouchables of India', 'john.doe@example.com', 'Unknown', '2023', 'Fiction', 'Unknown Publisher', -1);
INSERT INTO book (title, owner, author, year, type, publisher, rating) VALUES ('Growing Up Untouchable in India: A Dalit Autobiography', 'john.doe@example.com', 'Unknown', '2023', 'Fiction', 'Unknown Publisher', -1);
INSERT INTO book (title, owner, author, year, type, publisher, rating) VALUES ('The Evidence-Based Social Work Skills Book', 'john.doe@example.com', 'Unknown', '2023', 'Fiction', 'Unknown Publisher', -1);
INSERT INTO book (title, owner, author, year, type, publisher, rating) VALUES ('A Wrinkle in Time: A Guide for Using "A Wrinkle in Time" in the Classroom', 'john.doe@example.com', 'Madeleine LEngle', '2023', 'Fiction', 'Unknown Publisher', -1);
INSERT INTO book (title, owner, author, year, type, publisher, rating) VALUES ('Wrinkles in Time', 'john.doe@example.com', 'Unknown', '2023', 'Fiction', 'Unknown Publisher', -1);
INSERT INTO book (title, owner, author, year, type, publisher, rating) VALUES ('A Wrinkle in Time: With Related Readings (A Wrinkle in Time Quintet #1)', 'john.doe@example.com', 'Madeleine LEngle', '2023', 'Fiction', 'Unknown Publisher', -1);
INSERT INTO book (title, owner, author, year, type, publisher, rating) VALUES ('Literature Circle Guide: A Wrinkle in Time', 'john.doe@example.com', 'Madeleine LEngle', '2023', 'Fiction', 'Unknown Publisher', -1);
INSERT INTO book (title, owner, author, year, type, publisher, rating) VALUES ('Una arruga en el tiempo – A Wrinkle in Time', 'john.doe@example.com', 'Madeleine LEngle', '2023', 'Fiction', 'Unknown Publisher', -1);

commit;
```
