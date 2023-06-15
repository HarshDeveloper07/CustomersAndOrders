using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity;
using System.Linq;
using System.Web;
using CustomersAndOrders.Models;

namespace CustomersAndOrders.DataAccess
{
    public interface IDbFactory : IDisposable
    {
        CustomersAndOrdersDBEntities Get();
        void Set(CustomersAndOrdersDBEntities value);
    }
    public class DbFactory : Disposable, IDbFactory
    {
        private CustomersAndOrdersDBEntities _dataContext;

        public DbFactory()
        {
            Database.SetInitializer<CustomersAndOrdersDBEntities>(null);
        }

        //implement method Get of IDBFactory interfece
        public CustomersAndOrdersDBEntities Get()
        {
            if (_dataContext != null)
                return _dataContext;
            else
            {
                _dataContext = new CustomersAndOrdersDBEntities();
                ((IObjectContextAdapter)_dataContext).ObjectContext.CommandTimeout = 600;
                //_dataContext.Configuration.AutoDetectChangesEnabled = false;
                //_dataContext.Configuration.ValidateOnSaveEnabled = false;
                return _dataContext;
            }
        }
        public void Set(CustomersAndOrdersDBEntities value)
        {
            if (value == null && _dataContext != null)
            {
                _dataContext.Dispose();
                _dataContext = null;
            }
        }

        protected override void DisposeCore()
        {
            if (_dataContext != null)
            {
                //  _dataContext.SaveChanges();
                _dataContext.Dispose();
            }
        }
    }

   

    public class Disposable : IDisposable
    {
        private bool _isDisposed;

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        ~Disposable()
        {
            Dispose(false);
        }

        private void Dispose(bool disposing)
        {
            if (!_isDisposed && disposing)
            {
                DisposeCore();
            }

            _isDisposed = true;
        }

        protected virtual void DisposeCore()
        {
        }
    }
}