using CustomersAndOrders.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CustomersAndOrders.Controllers
{
    public class BaseController : Controller
    {
        protected IDbFactory DatabaseFactory;
        public BaseController(IDbFactory dbFactory)
        {
            DatabaseFactory = dbFactory;
        }
    }
}