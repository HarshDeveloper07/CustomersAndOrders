using CustomersAndOrders.DataAccess;
using CustomersAndOrders.Entities;
using CustomersAndOrders.Models;
using System.Collections.Generic;
using System.Data.Odbc;
using System.Linq;
using System.Net;
using System.Xml.Linq;

namespace CustomersAndOrders.Manager
{
    public class CustomersManager : BaseManager
    {
        private readonly CustomersDataAccess _customersDataAccess;

        public CustomersManager(IDbFactory dbFactory) : base(dbFactory)
        {
            _customersDataAccess = new CustomersDataAccess(DatabaseFactory);   
        }

        public List<CustomersViewModel> GetAllCustomers()
        {
            var customers = _customersDataAccess.GetAllCustomers();

            var customerViewModels = customers.Select(c => new CustomersViewModel
            {
                CustomerId = c.CustomerId,
                Name = $"{c.FirstName} {c.LastName}",
                Address = c.Customer_Address,
                PhoneNumber = c.Customer_Address
            }).ToList();

            return customerViewModels;
        }

        public CustomersViewModel GetCustomerById(int customerId)
        {
            var customerViewModel = new CustomersViewModel();
            var customerObj = _customersDataAccess.GetCustomerOnly(customerId);

            if(customerObj != null)
            {
                customerViewModel = new CustomersViewModel()
                {
                    CustomerId = customerObj.CustomerId,
                    Name = $"{customerObj.FirstName} {customerObj.LastName}",
                    Address = customerObj.Customer_Address,
                    PhoneNumber = customerObj.Customer_PhoneNumber
                };
            }
            return customerViewModel;
        }

    }
}