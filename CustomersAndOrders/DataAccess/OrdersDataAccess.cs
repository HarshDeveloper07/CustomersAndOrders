using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CustomersAndOrders.Models;

namespace CustomersAndOrders.DataAccess
{
    public class OrdersDataAccess :BaseDataAccess
    {
        public OrdersDataAccess(IDbFactory dbFactory) : base(dbFactory)
        {

        }
        public List<Order> GetOrdersByCustomerId(int id)
        {
            using (var OrderContext = new CustomersAndOrdersDBEntities())
            {
                return OrderContext.Orders.Where(x => x.CustomerId == id).ToList();
            }
        }
    }
}