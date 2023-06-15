using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CustomersAndOrders.DataAccess;
using CustomersAndOrders.Entities;
using CustomersAndOrders.Models;

namespace CustomersAndOrders.Manager
{
    public class OrdersManager :BaseManager
    {
        private readonly OrdersDataAccess _ordersDataAccess;
        private readonly CustomersDataAccess _customersDataAccess;

        public OrdersManager(IDbFactory dbFactory) : base(dbFactory)
        {
            _ordersDataAccess = new OrdersDataAccess(DatabaseFactory);
            _customersDataAccess = new CustomersDataAccess(DatabaseFactory);
        }

        public CustomerOrderViewModel GetOrdersByCustomerId(int customerId)
        {
            var customerViewModels = new CustomerOrderViewModel();
            //var orders = _ordersDataAccess.GetOrdersByCustomerId(id);
            var customerObj = _customersDataAccess.GetCustomer(customerId);

            if (customerObj != null)
            {
                customerViewModels = new CustomerOrderViewModel()
                {
                    UserId = customerObj.UserId,
                    Name = $"{customerObj.FirstName} {customerObj.LastName}",
                    Address = customerObj.User_Address,
                    PhoneNumber = customerObj.User_PhoneNumber
                };
                if (customerObj.Orders != null && customerObj.Orders.Any())
                {
                    var orderViewModels = customerObj.Orders.Select(c => new OrderViewModel
                    {
                        OrderId = c.OrderId,
                        OrderPrice = c.OrderPrice,
                        OrderDate = c.OrderDate
                    }).ToList();
                    customerViewModels.Orders = orderViewModels;
                }
            }
            return customerViewModels;
        }
    }
}