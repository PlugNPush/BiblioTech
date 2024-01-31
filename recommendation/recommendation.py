import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import recall_score
from scipy import stats
from scipy.sparse import csr_matrix
from scipy.sparse.linalg import svds

import ast
from sqlalchemy import create_engine, text
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from fuzzywuzzy import process, fuzz
from IPython.display import clear_output
import pickle
from data_db import user, mdp
import time


def book_recommendation_system():
    print("Training recommendation system start...")
    start_time = time.time()
    ## PREPROCESSING
    book_data = pd.read_csv("books_metadata_Amazon.csv", delimiter=',', on_bad_lines='skip')
    book_data = book_data[['Title', 'authors', 'categories']] # keep the Title, authors and categories from the columns
    # Function to convert a list into a string
    def list_to_string(list):
        return ', '.join(list)

    def str_to_list(list_str):
        if isinstance(list_str, str):
            return ast.literal_eval(list_str)
        else:
            return []

    # Replace NaN with empty strings
    book_data['authors'].fillna('[]', inplace=True)
    book_data['categories'].fillna('[]', inplace=True)

    # Convert strings that look like lists into actual lists
    book_data['authors'] = book_data['authors'].apply(str_to_list)
    book_data['categories'] = book_data['categories'].apply(str_to_list)

    # Convert the lists into strings
    book_data['authors'] = book_data['authors'].apply(list_to_string)
    book_data['categories'] = book_data['categories'].apply(list_to_string)
    # consider on user_id, book_id, and ratings
    df = pd.read_csv('Books_Amazon.csv')
    df = df[['Id','User_id','Title','review/score', 'review/time']]
    df.rename(columns={'Id':'ProductId','User_id':'UserId','review/time':'Time','Title':'title','review/score':'Score'},inplace=True)
    df.shape
    # FUSION DES DONNEES
    df['title'] = df['title'].str.strip().str.lower()
    book_data['Title'] = book_data['Title'].str.strip().str.lower()

    # Merge the DataFrames on the titles
    df = df.merge(book_data, how='left', left_on='title', right_on='Title')

    # Supprimez la colonne des titres en double
    df = df.drop(columns=['Title'])

    df
    # Data Preprocessing
    #lots of fields where user is NaN
    df = df.dropna(subset=['UserId'])
    print("Size of 'ProductId' column:", len(df['ProductId']))
    print("Size of 'UserId' column:", len(df['UserId']))

    # Define the threshold values
    product_id_threshold = 20 
    user_id_threshold = 10

    # Count the occurrences of ProductId and UserId
    product_id_counts = df['ProductId'].value_counts()
    user_id_counts = df['UserId'].value_counts()

    # Filter out rows below the threshold
    filtered_df = df[(df['ProductId'].isin(product_id_counts[product_id_counts >= product_id_threshold].index)) &
                    (df['UserId'].isin(user_id_counts[user_id_counts >= user_id_threshold].index))]

    print("Size of 'ProductId' column:", len(filtered_df['ProductId']))
    print("Size of 'UserId' column:", len(filtered_df['UserId']))

    def get_user_data(user_email):
        # Connect to the database
        engine = create_engine('mysql+pymysql://'+user+':'+mdp+'@localhost:3306/db_master_project') # Change the password accordingly !!!!

        # Load user's read and liked books from the database
        query = text(f"SELECT * FROM user WHERE email = '{user_email}';")
        user_data = pd.read_sql_query(query, engine)
        
        return user_data
    user_data = get_user_data('john.doe@example.com')
    def get_user_books(user_email):
        """ Récupère les livres d'un utilisateur à partir de la base de données """
        engine = create_engine('mysql+pymysql://'+user+':'+mdp+'@localhost:3306/db_master_project')
        user_books_query = text(f"SELECT * FROM book WHERE owner = '{user_email}';")
        user_books = pd.read_sql_query(user_books_query, engine)
        #user_books = user_books[user_books['rating'].between(0, 5)]
        # Prendre en compte la casse et les espaces supplémentaires
        user_books['title'] = user_books['title'].str.strip().str.lower()
        return user_books

    user_books = get_user_books('john.doe@example.com')
    def get_all_user_books():
        """ Récupère les livres d'un utilisateur à partir de la base de données """
        engine = create_engine('mysql+pymysql://'+user+':'+mdp+'@localhost:3306/db_master_project')
        user_books_query = text(f"SELECT * FROM book;")
        user_books = pd.read_sql_query(user_books_query, engine)
        #user_books = user_books[user_books['rating'].between(0, 5)]
        # Prendre en compte la casse et les espaces supplémentaires
        user_books['title'] = user_books['title'].str.strip().str.lower()
        return user_books

    all_user_books = get_all_user_books()
    all_user_books.head(1)
    filtered_df.head(1)
    # Grouper par titre et obtenir le premier ProductId pour chaque groupe
    product_ids_by_title = filtered_df.groupby('title')['ProductId'].first()
    # Sélection et renommage des colonnes dans all_user_books pour correspondre à filtered_df
    adapted_all_user_books = all_user_books[['title', 'owner', 'author', 'rating']].copy()
    adapted_all_user_books.rename(columns={'owner': 'UserId', 'author': 'authors', 'rating': 'Score'}, inplace=True)

    # Ajout des colonnes manquantes avec des valeurs par défaut ou vides
    adapted_all_user_books['ProductId'] = ''  # Ajout d'une colonne ProductId vide
    adapted_all_user_books['Time'] = None  # Vous pouvez remplacer None par une valeur par défaut si nécessaire
    adapted_all_user_books['categories'] = None  # Vous pouvez remplacer None par une valeur par défaut si nécessaire

    # Réorganiser les colonnes pour qu'elles correspondent à celles de filtered_df
    adapted_all_user_books = adapted_all_user_books[['ProductId', 'UserId', 'title', 'Score', 'Time', 'authors', 'categories']]

    # Concaténation de adapted_all_user_books avec filtered_df
    filtered_df = pd.concat([filtered_df, adapted_all_user_books], ignore_index=True)

    from fuzzywuzzy import process

    def find_closest_title(title, titles_list):
        closest_title, score = process.extractOne(title, titles_list)
        return closest_title if score > 90 else None  # Vous pouvez ajuster le seuil de score

    # Parcourir filtered_df pour trouver et associer les ProductId manquants
    for index, row in filtered_df.iterrows():
        if pd.isnull(row['ProductId']) or row['ProductId'] == '':
            closest_title = find_closest_title(row['title'], product_ids_by_title.index)
            if closest_title:
                filtered_df.at[index, 'ProductId'] = product_ids_by_title[closest_title]

    # filtered_df[filtered_df['UserId'] == 'john.doe@example.com']
    # filtered_df[filtered_df['ProductId'] == '1565119770']
    # Get unique UserIds and ProductIds
    unique_user_ids = filtered_df['UserId'].unique()
    unique_product_ids = filtered_df['ProductId'].unique() #unique ids for books are less

    user_id_to_index = {user_id: index for index, user_id in enumerate(unique_user_ids)}
    product_id_to_index = {product_id: index for index, product_id in enumerate(unique_product_ids)}

    # clean matrix
    matrix = np.zeros((len(unique_user_ids), len(unique_product_ids)))

    # users as rows, books as columns with their ratings
    for _, row in filtered_df.iterrows():
        user_id = row['UserId']
        product_id = row['ProductId']
        score = row['Score']
        
        user_index = user_id_to_index[user_id]
        product_index = product_id_to_index[product_id]
        
        if matrix[user_index][product_index] < score:
            matrix[user_index][product_index] = score
    print(matrix.shape)
    matrix
    # Z-Scoring
    matrix = stats.zscore(matrix, axis=0)
    # Evaluation
    def calculate_mse(predicted_matrix, test_matrix):
        num_users = min(predicted_matrix.shape[0], test_matrix.shape[0])
        num_items = min(predicted_matrix.shape[1], test_matrix.shape[1])
        mse = np.mean((predicted_matrix[:num_users, :num_items] - test_matrix[:num_users, :num_items]) ** 2)
        return mse

    def calculate_f1_score(recall, precision):
        if recall + precision == 0:
            return 0
        f1_score = 2 * (precision * recall) / (precision + recall)
        return f1_score

    def precision_at_k(actual_matrix, predicted_matrix, k, threshold):
        binary_predicted_matrix = predicted_matrix >= threshold
        
        precision = []
        for i in range(len(actual_matrix)):
            actual_indices = np.where(actual_matrix[i] >= threshold)[0]
            predicted_indices = np.argsort(~binary_predicted_matrix[i])[:k]
            common_indices = np.intersect1d(actual_indices, predicted_indices)
            precision.append(len(common_indices) / len(predicted_indices))
        
        return np.mean(precision)

    def recall_at_k(true_matrix, pred_matrix, k, threshold):
        pred_matrix_sorted = np.argsort(pred_matrix, axis=1)[:, ::-1][:, :k]
        recall_scores = []
        for i in range(len(true_matrix)):
            true_positives = len(set(pred_matrix_sorted[i]).intersection(set(np.where(true_matrix[i] >= threshold)[0])))
            actual_positives = len(np.where(true_matrix[i] >= threshold)[0])
            if actual_positives > 0:
                recall_scores.append(true_positives / actual_positives)
        recall = np.mean(recall_scores)
        return recall
    # SVD
    def split_train_test(matrix, test_size=0.2, random_state=42):
        train_matrix, test_matrix = train_test_split(matrix, test_size=test_size, random_state=random_state)
        return train_matrix, test_matrix

    def calculate_svd(train_matrix, k=600):
        train_sparse = csr_matrix(train_matrix)
        # Perform SVD on the sparse matrix
        U_train, S_train, VT_train = svds(train_sparse, k=k)
        # Reverse the singular values, columns of U_train, and rows of VT_train
        S_train_k = np.diag(S_train[::-1])
        U_train_k = U_train[:, ::-1]
        VT_train_k = VT_train[::-1, :]
        
        return U_train_k, S_train_k, VT_train_k

    train_matrix, test_matrix = split_train_test(matrix)

    # training set
    U_train, S_train, VT_train = calculate_svd(train_matrix)
    U_train_pred = np.dot(train_matrix, VT_train.T)
    train_pred_matrix = np.dot(U_train_pred, VT_train)

    # Make predictions for the test set
    U_test_pred = np.dot(test_matrix, VT_train.T)
    predicted_matrix = np.dot(U_test_pred, VT_train)

    # Calculate MSE 
    train_mse = calculate_mse(train_matrix, train_pred_matrix)
    test_mse = calculate_mse(test_matrix, predicted_matrix)

    print("Train Set Mean Squared Error (MSE):", train_mse)
    print("Test Set Mean Squared Error (MSE):", test_mse)
    # Calculate Precision at k for the test set
    precision = precision_at_k(test_matrix, predicted_matrix, k=10, threshold=3)

    # Calculate Recall at k for the test set
    recall = recall_at_k(test_matrix, predicted_matrix, k=10, threshold=3)

    # Calculate F1 score
    f1_score = calculate_f1_score(recall, precision)
    print("RMSE (training): ", np.sqrt(train_mse) )
    print("RMSE (test): ", np.sqrt(test_mse))
    print("Precision @ 10: ", precision)
    print("Recall @ 10:", recall)
    print("F1 Score:", f1_score)
    # Save Model
    # Enregistrement des matrices U, S, et VT
    with open('Model/U_matrix.pkl', 'wb') as f:
        pickle.dump(U_train, f)

    with open('Model/S_matrix.pkl', 'wb') as f:
        pickle.dump(S_train, f)

    with open('Model/VT_matrix.pkl', 'wb') as f:
        pickle.dump(VT_train, f)

    # Enregistrement des mappages
    with open('Model/user_id_to_index.pkl', 'wb') as f:
        pickle.dump(user_id_to_index, f)

    with open('Model/product_id_to_index.pkl', 'wb') as f:
        pickle.dump(product_id_to_index, f)

    # Enregistrement de la matrice d'origine
    with open('Model/original_matrix.pkl', 'wb') as f:
        pickle.dump(matrix, f)

    with open('Model/user_id_to_index.pkl', 'wb') as f:
        pickle.dump(user_id_to_index, f)
        
    with open('Model/U_train.pkl', 'wb') as f:
        pickle.dump(U_train, f)
        
    with open('Model/VT_train.pkl', 'wb') as f:
        pickle.dump(VT_train, f)
        
    filtered_df.to_pickle('Model/books_metadata.pkl')
    
    print("Recommendation system trained in %s seconds." % (time.time() - start_time))



book_recommendation_system()




def load_model_and_mappings():
    with open('Model/U_matrix.pkl', 'rb') as f:
        U_matrix = pickle.load(f)

    with open('Model/S_matrix.pkl', 'rb') as f:
        S_matrix = pickle.load(f)

    with open('Model/VT_matrix.pkl', 'rb') as f:
        VT_matrix = pickle.load(f)

    with open('Model/user_id_to_index.pkl', 'rb') as f:
        user_id_to_index = pickle.load(f)

    with open('Model/product_id_to_index.pkl', 'rb') as f:
        product_id_to_index = pickle.load(f)

    with open('Model/original_matrix.pkl', 'rb') as f:
        original_matrix = pickle.load(f)

    with open('Model/U_train.pkl', 'rb') as f:
        U_train = pickle.load(f)
        
    with open('Model/VT_train.pkl', 'rb') as f:
        VT_train = pickle.load(f)
        
    filtered_df = pd.read_pickle('Model/books_metadata.pkl')

    return U_matrix, S_matrix, VT_matrix, user_id_to_index, product_id_to_index, original_matrix, U_train, VT_train, filtered_df

# Utilisation de la fonction
U_matrix, S_matrix, VT_matrix, user_id_to_index, product_id_to_index, original_matrix, U_train, VT_train, filtered_df = load_model_and_mappings()


## TEST SUR UTILISATEUR DEJA PRÉSENT
def fetch_relevant_items_for_user(user_id, relevant_items=5):
    # Get the index of the user
    U_matrix, S_matrix, VT_matrix, user_id_to_index, product_id_to_index, original_matrix, U_train, VT_train, filtered_df = load_model_and_mappings()
    user_index = user_id_to_index[user_id]
    user_embedding = U_train[user_index, :]
    
    similarity_scores = VT_train.T.dot(user_embedding)

    sorted_indices = similarity_scores.argsort()[::-1]
    top_relevant_indices = sorted_indices[:relevant_items]
    
    relevant_items = [list(product_id_to_index.keys())[list(product_id_to_index.values()).index(idx)] for idx in top_relevant_indices]
    relevant_titles = filtered_df.loc[filtered_df['ProductId'].isin(relevant_items), 'title'].tolist()
    
    # Remove any duplicate titles
    unique_relevant_titles = list(set(relevant_titles))
    
    # Get the final set of relevant items without duplicate titles
    final_relevant_items = []
    for title in unique_relevant_titles:
        final_relevant_items.append(title)
    
    return final_relevant_items

def get_user_books(user_email):
    """ Récupère les livres d'un utilisateur à partir de la base de données """
    engine = create_engine('mysql+pymysql://'+user+':'+mdp+'@localhost:3306/db_master_project')
    user_books_query = text(f"SELECT * FROM book WHERE owner = '{user_email}';")
    user_books = pd.read_sql_query(user_books_query, engine)
    #user_books = user_books[user_books['rating'].between(0, 5)]
    # Prendre en compte la casse et les espaces supplémentaires
    user_books['title'] = user_books['title'].str.strip().str.lower()
    return user_books

def provide_recommendations_for_user(user_id, top_n=35):
    # Fetch relevant items for the user
    relevant_items = fetch_relevant_items_for_user(user_id, top_n)

    # Create a list to store the recommendations
    recommendations = [(title, user_id, '', '', '', '') for title in relevant_items]

    # Connect to the database
    engine = create_engine('mysql+pymysql://'+user+':'+mdp+'@localhost:3306/db_master_project')

    with engine.connect() as connection:
        # Delete old recommendations for this user
        delete_query = text("DELETE FROM recco_book WHERE owner = :owner")
        connection.execute(delete_query, {"owner": user_id})

        # Insert new recommendations
        insert_query = text("INSERT INTO recco_book (title, owner, author, year, type, publisher) VALUES (:title, :owner, :author, :year, :type, :publisher)")
        for rec in recommendations:
            connection.execute(insert_query, {"title": rec[0], "owner": rec[1], "author": rec[2], "year": rec[3], "type": rec[4], "publisher": rec[5]})

        # Commit the transaction
        connection.commit()

    # Return the list of recommendations (optional)
    return recommendations