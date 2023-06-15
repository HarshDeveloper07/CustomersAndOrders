using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CustomersAndOrders.Entities
{
    public class OrderViewModel
    {
        public string CustomerName { get; set; }
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public decimal OrderPrice { get; set; }
        public DateTime? OrderDate { get; set; }


    }
}