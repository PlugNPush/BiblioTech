from http.server import SimpleHTTPRequestHandler, HTTPServer
import json

#import reccomendation_ml
import recommendation

# Define the request handler class
class RequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)
    def _set_response(self, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    # Handle GET requests
    def do_GET(self):
        self._set_response()
        self.wfile.write(b'Hello, World! This is the response.')

    # Handle POST requests
    

    def do_POST(self):
        self._set_response()
        content_length = int(self.headers['Content-Length'])
        data = self.rfile.read(content_length).decode('utf-8')

        try:
            json_data = json.loads(data)  # Convertir les données JSON en un objet Python
            mail = json_data.get('mail', '')  # Récupérer l'adresse e-mail de l'objet JSON
            print("mail:", mail)
            if mail:
                recommendation.get_user_books(mail)
                recommended_books = recommendation.provide_recommendations_for_user(mail, 35)
            self.wfile.write(b'OK')
        except json.JSONDecodeError as e:
            print("Erreur lors de la conversion JSON:", str(e))


    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Methods', 'GET, POST')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()


# Set up the server
def run_server():
    host = 'localhost'
    port = 8000
    server_address = (host, port)
    httpd = HTTPServer(server_address, RequestHandler)
    print(f'Starting server on {host}:{port}...')
    httpd.serve_forever()


# Run the server
if __name__ == '__main__':
    run_server()
