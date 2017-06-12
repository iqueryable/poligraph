using System;
using System.Configuration;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Konvention.Adsembler.Web.Microsites.Areas.Backoffice.Filters
{
    public class BasicAuthenticationFilterAttribute : AuthorizeAttribute
    {
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            if (filterContext == null) throw new ArgumentNullException("filterContext");

            if (!Authenticate(filterContext.HttpContext))
            {
                filterContext.Result = new HttpCustomBasicUnauthorizedResult();
            }
        }

        private bool Authenticate(HttpContextBase context)
        {
            if (!context.Request.Headers.AllKeys.Contains("Authorization")) return false;

            string authHeader = context.Request.Headers["Authorization"];

            IPrincipal principal;
            if (TryGetPrincipal(authHeader, context, out principal))
            {
                HttpContext.Current.User = principal;
                return true;
            }
            return false;
        }

        private bool TryGetPrincipal(string authHeader, HttpContextBase context, out IPrincipal principal)
        {
            var creds = ParseAuthHeader(authHeader);
            if (creds != null)
            {
                if (TryGetPrincipal(creds[0], creds[1], context, out principal)) return true;
            }

            principal = null;
            return false;
        }

        private static bool TryGetPrincipal(string username, string password, HttpContextBase context, out IPrincipal principal)
        {
            var domain = context.Request.Url?.Host ?? "";
            var basicUsername = ConfigurationManager.AppSettings[$"BasicAuthentication.Username.{domain}"];
            var basicPassword = ConfigurationManager.AppSettings[$"BasicAuthentication.Password.{domain}"];

            if (username != basicUsername || password != basicPassword)
            {
                principal = null;
                return false;
            }
            principal = new GenericPrincipal(new GenericIdentity(username, "Basic"), null);
            return true;
        }

        private static string[] ParseAuthHeader(string authHeader)
        {
            // Check this is a Basic Auth header
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Basic")) return null;

            // Pull out the Credentials with are seperated by ':' and Base64 encoded
            string base64Credentials = authHeader.Substring(6);
            string[] credentials = Encoding.ASCII.GetString(Convert.FromBase64String(base64Credentials)).Split(':');

            if (credentials.Length != 2 || string.IsNullOrEmpty(credentials[0]) || string.IsNullOrEmpty(credentials[0])) return null;

            // Okay this is the credentials
            return credentials;
        }
    }

    public class HttpCustomBasicUnauthorizedResult : HttpUnauthorizedResult
    {
        // the base class already assigns the 401.
        // we bring these constructors with us to allow setting status text
        public HttpCustomBasicUnauthorizedResult() : base() { }
        public HttpCustomBasicUnauthorizedResult(string statusDescription) : base(statusDescription) { }

        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null) throw new ArgumentNullException("context");

            // this is really the key to bringing up the basic authentication login prompt.
            // this header is what tells the client we need basic authentication
            context.HttpContext.Response.AddHeader("WWW-Authenticate", "Basic");
            base.ExecuteResult(context);
        }
    }
}