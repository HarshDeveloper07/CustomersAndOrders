using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CustomersAndOrders.Entities
{
    public class CustomerOrderViewModel : CustomersViewModel
    {
        public CustomerOrderViewModel() {

            Orders = new List<OrderViewModel>();
        }
        public List<OrderViewModel> Orders { get; set; }
    }
}