using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Repository.Common
{
    public interface IUnitOfWorkRepository
    {

        /// <summary>
        /// Tạo transaction mới.
        /// </summary>
        IDbContextTransaction CreateTransaction();

        /// <summary>
        /// Lưu các thay đổi vào cơ sở dữ liệu.
        /// </summary>
        Task<int> Save();

        /// <summary>
        /// Ghi nhận (commit) các thay đổi đã lưu vào transaction.
        /// </summary>
        Task Commit();


        Task Dispose();

        /// <summary>
        /// Lấy đối tượng DbContext hiện tại.
        /// </summary>
        DbContext Context();
        Task RollBack();
    }
}
