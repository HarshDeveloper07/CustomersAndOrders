using CustomersAndOrders.Manager;
using System.Web.Mvc;
using CustomersAndOrders.Models;
using CustomersAndOrders.DataAccess;

namespace CustomersAndOrders.Controllers
{
    public class CustomersController : BaseController
    {
        
        private readonly CustomersManager _customerManager;
        private readonly OrdersManager _ordersManager;

        public CustomersController(IDbFactory dbFactory) : base(dbFactory) 
        {
            _customerManager = new CustomersManager(DatabaseFactory);
            _ordersManager = new OrdersManager(DatabaseFactory);
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetCustomerData()
        {
            // Logic to retrieve customer data and format it as needed
            var customerData = _customerManager.GetAllCustomers();

            // Return the customer data as JSON
            return Json(customerData, JsonRequestBehavior.AllowGet);
        }


        public ActionResult OrderList(int userId)
        {
            var customerOrderViewModel = _ordersManager.GetOrdersByCustomerId(userId);
            return PartialView("OrderList", customerOrderViewModel);
        }
        
    }
}
