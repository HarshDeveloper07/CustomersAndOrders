using CustomersAndOrders.Models;
using CustomersAndOrders.DataAccess;

namespace CustomersAndOrders.DataAccess
{
    public class BaseDataAccess
    {
        public IDbFactory DatabaseFactory { get; private set; }

        public CustomersAndOrdersDBEntities DataContext
        {
            get { return DatabaseFactory.Get(); }
            set { DatabaseFactory.Set(value); }
        }

        public BaseDataAccess(IDbFactory databaseFactory)
        {
            DatabaseFactory = databaseFactory;
        }
    }
}