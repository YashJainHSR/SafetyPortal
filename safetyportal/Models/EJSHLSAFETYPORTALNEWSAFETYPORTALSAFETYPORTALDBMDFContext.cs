using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace safetyportal.Models
{
    public partial class EJSHLSAFETYPORTALNEWSAFETYPORTALSAFETYPORTALDBMDFContext : DbContext
    {
        public EJSHLSAFETYPORTALNEWSAFETYPORTALSAFETYPORTALDBMDFContext()
        {
        }

        public EJSHLSAFETYPORTALNEWSAFETYPORTALSAFETYPORTALDBMDFContext(DbContextOptions<EJSHLSAFETYPORTALNEWSAFETYPORTALSAFETYPORTALDBMDFContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AgencyList> AgencyList { get; set; }
        public virtual DbSet<AssignToList> AssignToList { get; set; }
        public virtual DbSet<DepartmentList> DepartmentList { get; set; }
        public virtual DbSet<EmployeeList> EmployeeList { get; set; }
        public virtual DbSet<HodList> HodList { get; set; }
        public virtual DbSet<LoginCredentials> LoginCredentials { get; set; }
        public virtual DbSet<NodalList> NodalList { get; set; }
        public virtual DbSet<OnlineStatus> OnlineStatus { get; set; }
        public virtual DbSet<Requests> Requests { get; set; }
        public virtual DbSet<SectionList> SectionList { get; set; }
        public virtual DbSet<UserInfo> UserInfo { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Data Source=(LocalDB)\\MSSQLLocalDB;AttachDbFilename=E:\\JSHL\\SafetyPortal.mdf;Integrated Security=True;Connect Timeout=30");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.4-servicing-10062");

            modelBuilder.Entity<AgencyList>(entity =>
            {
                entity.Property(e => e.AgencyName)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<AssignToList>(entity =>
            {
                entity.Property(e => e.Agency).HasMaxLength(50);

                entity.Property(e => e.Department).HasMaxLength(50);

                entity.Property(e => e.EmployeeId).HasMaxLength(50);

                entity.Property(e => e.Section).HasMaxLength(50);
            });

            modelBuilder.Entity<DepartmentList>(entity =>
            {
                entity.Property(e => e.DepartmentName).HasMaxLength(50);

                entity.Property(e => e.Hod)
                    .HasColumnName("HOD")
                    .HasMaxLength(50);

                entity.Property(e => e.Nodal).HasMaxLength(50);
            });

            modelBuilder.Entity<EmployeeList>(entity =>
            {
                entity.HasKey(e => e.EmployeeId)
                    .HasName("PK__Employee__3214EC076CB9E01E");

                entity.Property(e => e.EmployeeId).ValueGeneratedNever();

                entity.Property(e => e.Area).HasMaxLength(50);

                entity.Property(e => e.Department).HasMaxLength(50);

                entity.Property(e => e.Email).HasMaxLength(50);

                entity.Property(e => e.Intercom).HasMaxLength(50);

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Phone).HasMaxLength(50);
            });

            modelBuilder.Entity<HodList>(entity =>
            {
                entity.Property(e => e.Email).HasMaxLength(50);

                entity.Property(e => e.Hodid)
                    .HasColumnName("HODId")
                    .HasMaxLength(50);

                entity.Property(e => e.Hodname)
                    .HasColumnName("HODName")
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<LoginCredentials>(entity =>
            {
                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Role)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<NodalList>(entity =>
            {
                entity.Property(e => e.Email).HasMaxLength(50);

                entity.Property(e => e.NodalId)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.NodalName).HasMaxLength(50);
            });

            modelBuilder.Entity<OnlineStatus>(entity =>
            {
                entity.Property(e => e.ActiveStatus).HasMaxLength(50);

                entity.Property(e => e.LastLogin).IsRowVersion();

                entity.Property(e => e.UserId).HasMaxLength(50);
            });

            modelBuilder.Entity<Requests>(entity =>
            {
                entity.HasKey(e => e.RequestNo)
                    .HasName("PK__tmp_ms_x__33A869A598529F29");
            });

            modelBuilder.Entity<SectionList>(entity =>
            {
                entity.Property(e => e.DepartmentName).HasMaxLength(50);

                entity.Property(e => e.SectionName).HasMaxLength(50);
            });

            modelBuilder.Entity<UserInfo>(entity =>
            {
                entity.HasKey(e => e.UserId)
                    .HasName("PK__tmp_ms_x__1788CC4C98190757");

                entity.Property(e => e.UserId).ValueGeneratedNever();

                entity.Property(e => e.Area).HasMaxLength(50);

                entity.Property(e => e.Department).HasMaxLength(50);

                entity.Property(e => e.Email).HasMaxLength(50);

                entity.Property(e => e.Hod)
                    .HasColumnName("HOD")
                    .HasMaxLength(50);

                entity.Property(e => e.Intercom).HasMaxLength(50);

                entity.Property(e => e.Mobile).HasMaxLength(50);

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Nodal).HasMaxLength(50);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(50);
            });
        }
    }
}
