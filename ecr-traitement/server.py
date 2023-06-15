from http.server import SimpleHTTPRequestHandler, HTTPServer
import recommendation


# Define the request handler class
class RequestHandler(SimpleHTTPRequestHandler):
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
        self.wfile.write(bytes("Message recu"))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', 'http://localhost:3000')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()


# Set up the server
def run_server():
    host = 'localhost'
    port = 8080
    server_address = (host, port)
    httpd = HTTPServer(server_address, RequestHandler)
    print(f'Starting server on {host}:{port}...')
    httpd.serve_forever()


# Run the server
if __name__ == '__main__':
    run_server()
