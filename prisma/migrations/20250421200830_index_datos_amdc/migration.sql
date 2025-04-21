BEGIN TRY

BEGIN TRAN;

-- CreateIndex
CREATE NONCLUSTERED INDEX [datos_amdc_RTN_idx] ON [dbo].[datos_amdc]([RTN]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [datos_amdc_ICS_idx] ON [dbo].[datos_amdc]([ICS]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [datos_amdc_ANIO_idx] ON [dbo].[datos_amdc]([ANIO]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [datos_amdc_NOMBRE_idx] ON [dbo].[datos_amdc]([NOMBRE]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [datos_amdc_NOMBRE_COMERCIAL_idx] ON [dbo].[datos_amdc]([NOMBRE_COMERCIAL]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
