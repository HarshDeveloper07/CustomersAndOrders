using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using CustomersAndOrders.Models;

namespace CustomersAndOrders.DataAccess
{
    public class CustomersDataAccess : BaseDataAccess
    {
        public CustomersDataAccess(IDbFactory dbFactory) : base(dbFactory) { 
        
        }    
        public List<Customer> GetAllCustomers()
        {
          

                using (var Customercontext = new CustomersAndOrdersDBEntities())
                {
                    return Customercontext.Customers.ToList();
                }
            
            
        }

        public Customer GetCustomer(int customerId)
        {
            using (var Customercontext = new CustomersAndOrdersDBEntities())
            {
                return Customercontext.Customers.Where(x=>x.CustomerId == customerId).Include(x=>x.Orders).FirstOrDefault();
            }
        }

        public Customer GetCustomerOnly(int customerId)
        {
            using (var Customercontext = new CustomersAndOrdersDBEntities())
            {
                return Customercontext.Customers.Where(x => x.CustomerId == customerId).FirstOrDefault();
            }
        }

    }

}