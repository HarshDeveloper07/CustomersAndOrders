using System.Web.Mvc;
using CustomersAndOrders.DataAccess;
using Microsoft.Practices.Unity;
using Unity;
using Unity.Lifetime;
using Unity.Mvc5;

namespace MealsApp
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
			var container = new UnityContainer();
            
            // register all your components with the container here
            // it is NOT necessary to register your controllers
            
            // e.g. container.RegisterType<ITestService, TestService>();
            container.RegisterType<IDbFactory, DbFactory>(new TransientLifetimeManager());
            DependencyResolver.SetResolver(new UnityDependencyResolver(container));
        }
    }
}