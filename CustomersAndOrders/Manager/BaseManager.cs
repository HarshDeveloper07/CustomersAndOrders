using CustomersAndOrders.DataAccess;
using CustomersAndOrders.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CustomersAndOrders.Manager
{
    public class BaseManager
    {
        protected IDbFactory DatabaseFactory;
        public BaseManager(IDbFactory dbFactory)
        {
            DatabaseFactory = dbFactory;
        }

    }
}