﻿using CustomersAndOrders.DataAccess;
using CustomersAndOrders.Entities;
using System.Collections.Generic;
using System.Data.Odbc;
using System.Linq;

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

    }
}