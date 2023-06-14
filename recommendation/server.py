import json
from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse
import recommendation


# Define the request handler class
class RequestHandler(BaseHTTPRequestHandler):
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
        t = data.split(":")[1].replace('"', '').replace('}', '').replace('\n', '')
        recco = recommendation.recommend_books(t)
        response_data = '-'.join(recco).encode('utf-8')
        self.wfile.write(response_data)


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
