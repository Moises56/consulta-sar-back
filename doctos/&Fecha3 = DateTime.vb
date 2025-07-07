&Fecha3 = DateTime.Now()
&Hora = DateTime.Now()

for each CLAVES_RUTAS order CLAVE_CATASTRAL
    WHERE CLAVES_RUTASRUTA = &Clave
    &count += 1
    &UMAPS = UMAPS
    &ART_ID_DOC = CLAVE_CATASTRAL
    
    for each MORA
        where ART_ID_DOC = &ART_ID_DOC
        &NOMBRE = NOMBRE
        &ACT_ID_CARD = ACT_ID_CARD
        &ART_ID_DOC = ART_ID_DOC
        &NOMBRE_COLONIA = NOMBRE_COLONIA
        &Impuestos1 += IMPUESTO
        &TasaBomberos1 += TASA_BOMBEROS
        &TrenDeAseo1 += TREN_DE_ASEO
        &Interes3 += INTERES
        &Total1 = &Impuestos1 + &TasaBomberos1 + &TrenDeAseo1 + &Interes3
        &existe = 1 
    when none 
        &existe = 2
    endfor 

    // Inicialización de valores
    &Impuestos1 = 0
    &TasaBomberos1 = 0
    &TrenDeAseo1 = 0
    &Interes3 = 0
    &Interes4 = 0
    &Cant1 = 0
    &Totaltot = 0

    // Totales generales
    &Impuestostot = 0
    &TrenDeAseotot = 0
    &TasaBomberostot = 0
    &Interestot = 0
    &Interestot2 = 0

    // Limpiar las variables iniciales
    if &existe = 1
        print Datos
		
        // Inicialización de valores
        &Impuestos1 = 0
        &TasaBomberos1 = 0
        &TrenDeAseo1 = 0
        &Interes3 = 0
        &Interes4 = 0
        &Cant1 = 0
        &Totaltot = 0
		
        // Totales generales
        &Impuestostot = 0
        &TrenDeAseotot = 0
        &TasaBomberostot = 0
        &Interestot = 0
        &Interestot2 = 0
		
        // Año inicial para el ciclo de cálculo
        &Anio23 = DateTime.Now().AddYears(-10).Year()
        
        For &Count5 = &Anio23 to 2025 step 1  // Año 2025
            &Anio = &Count5
            
            // Ajuste de la fecha de referencia
            if &Anio = DateTime.Now().Year()  // 2025
                &Fecha = DateTime.Now()  // Fecha actual (05/05/2025)
                &FechaLimite = date.New(&Anio, 4, 1)  // 01 de abril de 2025
                if &Fecha <= &FechaLimite
                    &Dias = 0  // No hay recargo hasta el 01/04/2025
                else
                    // Cálculo manual de días
                    &DiasAnio = Year(&Fecha) - Year(&FechaLimite)
                    &DiasMes = Month(&Fecha) - Month(&FechaLimite)
                    &DiasDia = Day(&Fecha) - Day(&FechaLimite)
                    &Dias = (&DiasAnio * 365) + (&DiasMes * 30) + &DiasDia  // Aproximación simple
                    if &Dias < 0
                        &Dias = 0
                    endif
                endif
            else
                &Fecha = date.New(&Anio, 8, 31)  // 31 de agosto para años anteriores
                &Fecha4 = DateTime.Now()  // Fecha actual
                // Cálculo manual de días
                &DiasAnio = Year(&Fecha4) - Year(&Fecha)
                &DiasMes = Month(&Fecha4) - Month(&Fecha)
                &DiasDia = Day(&Fecha4) - Day(&Fecha)
                &Dias = (&DiasAnio * 365) + (&DiasMes * 30) + &DiasDia  // Aproximación simple
                if &Dias < 0
                    &Dias = 0  // Evitar días negativos
                endif
            endif
            
            // Reseteo de variables para cada iteración anual
            &Impuestos1 = 0
            &TasaBomberos1 = 0
            &TrenDeAseo1 = 0
            &Interes3 = 0
            &Total1 = 0
            
            for each MORA 
                where ART_ID_DOC = &ART_ID_DOC
                where OBL_YEAR = &Anio
                
                // Variables de cada registro
                &NOMBRE = NOMBRE
                &ACT_ID_CARD = ACT_ID_CARD
                &ART_ID_DOC = ART_ID_DOC
                &NOMBRE_COLONIA = NOMBRE_COLONIA
                &Impuestos1 = IMPUESTO
                &TasaBomberos1 = TASA_BOMBEROS
                &TrenDeAseo1 = TREN_DE_ASEO
                &Interes3 = INTERES
                
                &Subtotal = &Impuestos1 + &TasaBomberos1 + &TrenDeAseo1
                
                // Cálculo de intereses basado en los días
                &Interes4 = ((&Subtotal * &Dias) * 0.22) / 360
                &Interes5 = &Interes4.Round(2)
                
                // Calcular descuento de amnistía si el año es anterior a 2024
                if &Anio < 2024
                    &Cant1 += &Impuestos1 * 0.20
                endif
                
                // Suma total con intereses y subtotal
                &Total1 = &Subtotal.Round(2) + &Interes5.Round(2)
                   
            endfor 
            
            // Actualizar totales generales
            &Impuestostot += &Impuestos1
            &TrenDeAseotot += &TrenDeAseo1
            &TasaBomberostot += &TasaBomberos1
            &Interestot += &Interes3
            &Interestot2 += &Interes4
            &Totaltot += &Total1
            
            print Datos1
        endfor 
        
        // Calcular total final después de aplicar el descuento de amnistía
        &Totalfinal = &Totaltot - &Cant1
        
        &Mensaje2 = "Datos actualizados al 01 de Abril del 2025. Para mayor información llamar al 2220-6086"
        print Datos3
    endif

//if &count > 1 
//	exit
//endif 
endfor 


