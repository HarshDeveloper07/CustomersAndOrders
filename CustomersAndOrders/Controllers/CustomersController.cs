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
            var customerViewModels = _customerManager.GetAllCustomers();
            return View(customerViewModels);
        }


        public ActionResult OrderList(int userId)
        {
            var customerOrderViewModel = _ordersManager.GetOrdersByCustomerId(userId);
            return PartialView("OrderList", customerOrderViewModel);
        }
        
    }
}
