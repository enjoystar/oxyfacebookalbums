from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
import os.path
from google.appengine.ext.webapp import template


class MainPage(webapp.RequestHandler):
    
    
    def get(self):
        #self.response.headers['Content-Type'] = 'text/plain'
        #self.response.out.write('Hello, webapp World!')

        path = os.path.join(os.path.dirname(__file__), "index.html")
        #print path
        #args = dict(current_user=self.current_user)
        args=None
        self.response.out.write(template.render(path, args))


application = webapp.WSGIApplication([('/', MainPage)], debug=False)


def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
