BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[mis_consultas_vb] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [rtn] NVARCHAR(1000) NOT NULL,
    [nombreComercial] NVARCHAR(1000) NOT NULL,
    [anio] NVARCHAR(1000) NOT NULL,
    [importeTotalVentas] FLOAT(53) NOT NULL,
    [declaracionesAmdc] NVARCHAR(1000) NOT NULL,
    [diferencia] FLOAT(53) NOT NULL,
    [analisis] NVARCHAR(1000) NOT NULL,
    [fechaConsulta] DATETIME2 NOT NULL CONSTRAINT [mis_consultas_vb_fechaConsulta_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [mis_consultas_vb_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [mis_consultas_vb_userId_idx] ON [dbo].[mis_consultas_vb]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [mis_consultas_vb_rtn_idx] ON [dbo].[mis_consultas_vb]([rtn]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [mis_consultas_vb_anio_idx] ON [dbo].[mis_consultas_vb]([anio]);

-- AddForeignKey
ALTER TABLE [dbo].[mis_consultas_vb] ADD CONSTRAINT [mis_consultas_vb_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
