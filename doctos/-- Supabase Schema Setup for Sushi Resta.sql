-- Supabase Schema Setup for Sushi Restaurant Management System
-- Includes: Inventory, Billing, HR, Payroll, Website, Notifications

-- Enable Row Level Security by default
ALTER DATABASE current SET row_security TO ON;

-- 1. Branches Table
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Employees Table
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'manager', 'employee')) NOT NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  salary NUMERIC(10,2),
  contract_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Inventory Table
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  unit TEXT NOT NULL, -- e.g., kg, grams, units
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id UUID REFERENCES ingredients(id),
  branch_id UUID REFERENCES branches(id),
  quantity NUMERIC(10, 2) NOT NULL,
  low_stock_threshold NUMERIC(10, 2) DEFAULT 10,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Suppliers Table
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_info TEXT
);

CREATE TABLE ingredient_suppliers (
  ingredient_id UUID REFERENCES ingredients(id),
  supplier_id UUID REFERENCES suppliers(id),
  PRIMARY KEY (ingredient_id, supplier_id)
);

-- 5. Orders and Billing
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  phone TEXT
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  branch_id UUID REFERENCES branches(id),
  total NUMERIC(10,2),
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'mobile')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  menu_item TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

-- 6. Attendance and Payroll
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id),
  branch_id UUID REFERENCES branches(id),
  check_in TIMESTAMP,
  check_out TIMESTAMP
);

CREATE TABLE payroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id),
  period_start DATE,
  period_end DATE,
  gross_salary NUMERIC(10,2),
  deductions NUMERIC(10,2),
  net_salary NUMERIC(10,2),
  processed_at TIMESTAMP DEFAULT NOW()
);

-- 7. Website Content
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE
);

CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT,
  customer_email TEXT,
  date TIMESTAMP,
  branch_id UUID REFERENCES branches(id),
  notes TEXT
);

-- 8. Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('email', 'social')),
  trigger_event TEXT,
  payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 9. RLS: Enable and set basic policies
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Employees can access own record" ON employees
  USING (auth.uid() = id);

ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Employee can see own payroll" ON payroll
  USING (auth.uid() = employee_id);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Employee can see own attendance" ON attendance
  USING (auth.uid() = employee_id);


-- crear tabla para productos debe tener fecha de creación y vencimiento
-- y un campo para la cantidad de stock y un campo para saber a qué sucursal pertenece
-- y un campo para saber si está disponible o no  y el campo para saber que usuario lo agrega


CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  expiration_date TIMESTAMP,
  stock_quantity INTEGER NOT NULL,
  branch_id UUID REFERENCES branches(id),
  is_available BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES employees(id),
  updated_at TIMESTAMP DEFAULT NOW(),
  CHECK (stock_quantity >= 0),
  CHECK (expiration_date >= created_at)
);




-- Admins and managers policies should be extended using roles logic in Supabase Auth
-- Additional RLS policies should be added to stock, orders, and reservations based on roles and branch








// Supabase Edge Function: calculatePayroll.ts
// Calculates payroll for an employee between two dates
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const { employee_id, period_start, period_end } = await req.json();
  const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

  const { data: employee, error: employeeError } = await supabase
    .from("employees")
    .select("salary")
    .eq("id", employee_id)
    .single();

  if (employeeError || !employee) {
    return new Response(JSON.stringify({ error: "Employee not found" }), { status: 400 });
  }

  const gross = employee.salary;
  const deductions = gross * 0.13; // Example tax: 13%
  const net = gross - deductions;

  const { error: insertError } = await supabase.from("payroll").insert([
    {
      employee_id,
      period_start,
      period_end,
      gross_salary: gross,
      deductions,
      net_salary: net,
    },
  ]);

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, gross, deductions, net }), {
    headers: { "Content-Type": "application/json" },
  });
});

// Supabase Edge Function: notifyLowStock.ts
// Sends a notification when stock is below threshold
import { serve as serveLowStock } from "https://deno.land/std@0.168.0/http/server.ts";

serveLowStock(async (req) => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

  const { data: lowStockItems, error } = await supabase.rpc("get_low_stock_items");
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  const { error: notifError } = await supabase.from("notifications").insert(
    lowStockItems.map((item: any) => ({
      type: "email",
      trigger_event: "low_stock",
      payload: item,
    }))
  );

  if (notifError) {
    return new Response(JSON.stringify({ error: notifError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, count: lowStockItems.length }), {
    headers: { "Content-Type": "application/json" },
  });
});










-- Supabase SQL Function: get_low_stock_items
create or replace function get_low_stock_items()
returns table (
  ingredient_id uuid,
  ingredient_name text,
  branch_id uuid,
  branch_name text,
  quantity numeric,
  threshold numeric
)
language sql
as $$
  select
    i.id as ingredient_id,
    i.name as ingredient_name,
    b.id as branch_id,
    b.name as branch_name,
    inv.quantity,
    i.low_stock_threshold as threshold
  from inventory inv
  join ingredients i on inv.ingredient_id = i.id
  join branches b on inv.branch_id = b.id
  where inv.quantity < i.low_stock_threshold;
$$;



Requisitos previos:

La tabla ingredients debe tener una columna low_stock_threshold para definir el mínimo aceptable.

Asegúrate de tener una relación entre inventory.ingredient_id y ingredients.id, así como inventory.branch_id y branches.id.





/***********//
¿Quieres que ahora prepare la función para recibir webhooks desde n8n y manejarlos en Supabase?





// Supabase Edge Function: calculatePayroll.ts
// Calculates payroll for an employee between two dates
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const { employee_id, period_start, period_end } = await req.json();
  const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

  const { data: employee, error: employeeError } = await supabase
    .from("employees")
    .select("salary")
    .eq("id", employee_id)
    .single();

  if (employeeError || !employee) {
    return new Response(JSON.stringify({ error: "Employee not found" }), { status: 400 });
  }

  const gross = employee.salary;
  const deductions = gross * 0.13; // Example tax: 13%
  const net = gross - deductions;

  const { error: insertError } = await supabase.from("payroll").insert([
    {
      employee_id,
      period_start,
      period_end,
      gross_salary: gross,
      deductions,
      net_salary: net,
    },
  ]);

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, gross, deductions, net }), {
    headers: { "Content-Type": "application/json" },
  });
});

// Supabase Edge Function: notifyLowStock.ts
// Sends a notification when stock is below threshold
import { serve as serveLowStock } from "https://deno.land/std@0.168.0/http/server.ts";

serveLowStock(async (req) => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

  const { data: lowStockItems, error } = await supabase.rpc("get_low_stock_items");
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  const { error: notifError } = await supabase.from("notifications").insert(
    lowStockItems.map((item: any) => ({
      type: "email",
      trigger_event: "low_stock",
      payload: item,
    }))
  );

  if (notifError) {
    return new Response(JSON.stringify({ error: notifError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, count: lowStockItems.length }), {
    headers: { "Content-Type": "application/json" },
  });
});

// Supabase Edge Function: handleWebhook.ts
// Handles incoming n8n webhook payloads for events like social media or email
import { serve as serveWebhook } from "https://deno.land/std@0.168.0/http/server.ts";

serveWebhook(async (req) => {
  try {
    const body = await req.json();
    const { event_type, data } = body;

    const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

    const { error } = await supabase.from("notifications").insert([
      {
        type: event_type === "social" ? "social" : "email",
        trigger_event: event_type,
        payload: data,
      },
    ]);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
  }
});




Listo. Ahora tienes una función handleWebhook.ts para Supabase que acepta payloads desde n8n y los guarda en la tabla notifications, clasificando por tipo (social o email) según el event_type.

¿Quieres que prepare un ejemplo de flujo en n8n que envíe datos a esta función como webhook?







