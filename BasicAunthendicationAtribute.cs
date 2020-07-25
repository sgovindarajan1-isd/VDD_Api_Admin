using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Security.Principal;
using DAL;
using System.Web.Mvc;
using System.Web.Mvc.Filters;
using System.Web.Routing;
using System.Security.Cryptography;
using System.IO;

namespace eCAPDDApi
{
    public class BasicAuthenticationAttribute : AuthorizationFilterAttribute
    {
        static readonly string PasswordHash = "VDDP@@Sw0rd";
        static readonly string SaltKey = "VDDsecuredcode!laisd2016";
        static readonly string VIKey = "VDD@1B2c3D4e5F6g7H8";
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var header2 = HttpContext.Current.Request.Headers["Authorization"];

            if (actionContext.Request.Headers.Authorization == null)
            {
                actionContext.Response = actionContext.Request.CreateResponse(System.Net.HttpStatusCode.Unauthorized, "unauthorized");
            }
            else
            {
                string autendicataionToken = actionContext.Request.Headers.Authorization.Parameter;
                string decodedAutendicationToken = Encoding.UTF8.GetString(Convert.FromBase64String(autendicataionToken));


                string[] arr = decodedAutendicationToken.Split(':');
                string SecuredToken = string.Empty;
                string UserID = string.Empty;
                string TIN = string.Empty;

                SecuredToken = arr[0];

                if (SecuredToken == null || SecuredToken == "null" || SecuredToken == "" || SecuredToken == string.Empty)
                    SecuredToken = null;

                if (arr.Count() == 1)
                {
                    if ((SecuredToken == "contactus") || (SecuredToken == "status") || (SecuredToken == "admin") )
                    {
                        Thread.CurrentPrincipal = new GenericPrincipal(new GenericIdentity(Encrypt("VDDsecuredcode!laisd2016"), "securitytoken"), null);
                    }
                    else if ((SecuredToken != null ) && (Decrypt(SecuredToken) == "VDDsecuredcode!laisd2016") )
                    {
                        Thread.CurrentPrincipal = new GenericPrincipal(new GenericIdentity(Encrypt("VDDsecuredcode!laisd2016"), "securitytoken"), null);
                    }
                    
                    else
                    {
                        actionContext.Response = actionContext.Request.CreateResponse(System.Net.HttpStatusCode.Unauthorized, "unauthorized");
                    }
                }
                else
                {
                    UserID = arr[1];
                    TIN = arr[2];

                    if (VendorSecurity.Login(UserID, TIN))
                    {
                        Thread.CurrentPrincipal = new GenericPrincipal(new GenericIdentity(Encrypt("VDDsecuredcode!laisd2016"), "securitytoken"), null);
                    }
                    else
                    {
                        actionContext.Response = actionContext.Request.CreateResponse(System.Net.HttpStatusCode.Unauthorized, "unauthorized");
                    }
                }
            }
        }

        public static string Encrypt(string plainText)
        {
            byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);

            byte[] keyBytes = new Rfc2898DeriveBytes(PasswordHash, Encoding.ASCII.GetBytes(SaltKey)).GetBytes(256 / 8);
            var symmetricKey = new RijndaelManaged() { Mode = CipherMode.CBC, Padding = PaddingMode.Zeros };
            var encryptor = symmetricKey.CreateEncryptor(keyBytes, Encoding.ASCII.GetBytes(VIKey));

            byte[] cipherTextBytes;

            using (var memoryStream = new MemoryStream())
            {
                using (var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                {
                    cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
                    cryptoStream.FlushFinalBlock();
                    cipherTextBytes = memoryStream.ToArray();
                    cryptoStream.Close();
                }
                memoryStream.Close();
            }
            return Convert.ToBase64String(cipherTextBytes);
        }

        public static string Decrypt(string encryptedText)
        {
            byte[] cipherTextBytes = Convert.FromBase64String(encryptedText);
            byte[] keyBytes = new Rfc2898DeriveBytes(PasswordHash, Encoding.ASCII.GetBytes(SaltKey)).GetBytes(256 / 8);
            var symmetricKey = new RijndaelManaged() { Mode = CipherMode.CBC, Padding = PaddingMode.None };

            var decryptor = symmetricKey.CreateDecryptor(keyBytes, Encoding.ASCII.GetBytes(VIKey));
            var memoryStream = new MemoryStream(cipherTextBytes);
            var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
            byte[] plainTextBytes = new byte[cipherTextBytes.Length];

            int decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
            memoryStream.Close();
            cryptoStream.Close();
            return Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount).TrimEnd("\0".ToCharArray());
        }
    }

    

}