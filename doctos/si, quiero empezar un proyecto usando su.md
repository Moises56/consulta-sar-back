si, quiero empezar un proyecto usando supabase para el backend y para el frontend usando angular19 con tailwind, el proyecto es para llevar toda la gestion para un restaurante de suhi, donde ya se tiene tres sucursales, y 40 empleados, lo que se quiere es implementar todo el control, de inventario, facturacion, pagina web, recursos humanos, planilla de pagos, notificaciones de las redes sociales, email debe ser automatizado usando tambien n8n,
con este contexto, crea un promt detallado para que la ia cree todo


**Prompt for Creating a Sushi Restaurant Management System**

**Objective**: Develop a comprehensive web application for managing a sushi restaurant chain with three branches and 40 employees. The system must handle inventory, billing, a public website, human resources (HR), payroll, social media notifications, and automated email workflows. Use Supabase for the backend, Angular 19 with Tailwind CSS for the frontend, and n8n for workflow automation.

**Project Requirements**:

1. **Backend (Supabase)**:
   - **Database**: Use Supabase's PostgreSQL database to store data for:
     - **Inventory**: Track ingredients (e.g., rice, fish, seaweed), quantities, suppliers, and stock levels across three branches. Include low-stock alerts.
     - **Billing**: Manage orders, invoices, payments, and discounts. Support multiple payment methods (cash, card, mobile apps).
     - **HR and Payroll**: Store employee details (name, role, branch, salary, contact info), attendance, and payroll calculations (including taxes and deductions).
     - **Website Content**: Manage dynamic content for the public website (menu, branch locations, promotions, contact forms).
     - **Social Media and Email Logs**: Store notification triggers and email campaign data.
   - **Authentication**: Implement Supabase Auth for user roles:
     - Admin: Full access to all modules (inventory, billing, HR, payroll).
     - Manager: Access to inventory, billing, and branch-specific HR data.
     - Employee: Limited access to personal HR details and payroll.
     - Customer: Access to public website features (menu, reservations, contact).
   - **Storage**: Use Supabase Storage for:
     - Menu images, promotional banners, and employee documents (e.g., contracts, IDs).
   - **Edge Functions**: Create serverless functions for:
     - Processing payroll calculations.
     - Sending low-stock notifications.
     - Handling webhook responses from n8n for social media and email automation.
   - **Security**: Implement Row-Level Security (RLS) to restrict data access based on user roles and branch. Ensure API keys are secured and not exposed in the frontend.

2. **Frontend (Angular 19 with Tailwind CSS)**:
   - **Architecture**:
     - Create a modular Angular application with lazy-loaded modules for each feature (inventory, billing, HR, payroll, website).
     - Use Angular CLI to scaffold the project with routing and SCSS support.
     - Integrate Tailwind CSS for responsive and modern UI styling.
   - **Components and Features**:
     - **Dashboard**: A role-based dashboard for admins, managers, and employees, displaying relevant metrics (e.g., stock levels, daily sales, pending payroll).
     - **Inventory Module**:
       - Display stock levels with filters by branch and ingredient.
       - Forms for adding/updating stock and suppliers.
       - Alerts for low stock (visual indicators using Tailwind classes).
     - **Billing Module**:
       - Order creation with menu item selection and real-time total calculation.
       - Invoice generation and payment processing UI.
       - History of transactions with search and filter options.
     - **HR and Payroll Module**:
       - Employee management (CRUD operations for employee data).
       - Attendance tracking with calendar view.
       - Payroll calculation interface showing salaries, taxes, and deductions.
     - **Public Website**:
       - Responsive homepage with menu, branch locations, and promotions.
       - Reservation form integrated with Supabase for storing bookings.
       - Contact form with validation and submission to Supabase.
     - **Authentication UI**:
       - Login/signup pages using Supabase Auth UI components, styled with Tailwind.
       - Role-based redirects after login (e.g., admin to dashboard, customer to website).
   - **Styling**:
     - Use Tailwind CSS for consistent, responsive design.
     - Implement a sushi-themed color palette (e.g., soft greens, whites, reds).
     - Ensure mobile-first design for accessibility across devices.
   - **State Management**:
     - Use Angular services and RxJS for managing state (e.g., user session, inventory data).
     - Integrate Supabase JavaScript client for real-time data updates (e.g., stock changes, new orders).

3. **Automation (n8n)**:
   - **Workflows**:
     - **Social Media Notifications**:
       - Trigger posts to Twitter/X and Instagram when new menu items or promotions are added to Supabase.
       - Schedule posts for upcoming events or discounts.
     - **Email Automation**:
       - Send confirmation emails to customers after reservations or orders.
       - Notify employees about payroll updates or schedule changes.
       - Send low-stock alerts to managers with a summary of items to reorder.
     - **Inventory Sync**:
       - Automate stock updates when orders are placed (e.g., deduct ingredients from inventory).
       - Sync supplier orders when stock reaches a threshold.
   - **Integration**:
     - Use n8n’s Supabase node to interact with the database (e.g., query stock levels, insert notifications).
     - Connect to social media APIs (Twitter/X, Instagram) for posting.
     - Use SMTP or email service nodes (e.g., SendGrid) for email automation.
     - Authenticate n8n with Supabase using API keys and ensure secure connections.
   - **Scheduling**:
     - Run daily workflows for payroll summaries and weekly reports for inventory.
     - Schedule social media posts based on a content calendar stored in Supabase.

4. **Technical Requirements**:
   - **Environment Setup**:
     - Provide a `README.md` with instructions for setting up the project locally and deploying to a hosting platform (e.g., Vercel for frontend, Supabase for backend, n8n Cloud or self-hosted).
     - Include environment variable configurations for Supabase URL, API key, and n8n credentials.
   - **Dependencies**:
     - Backend: `@supabase/supabase-js` for client integration.
     - Frontend: Angular 19, Tailwind CSS, `@supabase/auth-ui-angular` for authentication.
     - Automation: n8n with nodes for Supabase, HTTP requests, and email/social media services.
   - **Testing**:
     - Write unit tests for Angular components and services using Jasmine/Karma.
     - Test Supabase Edge Functions using Deno’s testing framework.
     - Validate n8n workflows to ensure triggers and actions work as expected.
   - **Performance**:
     - Optimize Angular app for fast loading (e.g., lazy loading, AOT compilation).
     - Use Supabase’s real-time subscriptions for live updates (e.g., stock changes, new orders).
     - Ensure n8n workflows are efficient to avoid excessive API calls.

5. **Deliverables**:
   - **Code**:
     - Backend: Supabase database schema (SQL scripts for tables, RLS policies), Edge Functions (TypeScript).
     - Frontend: Angular 19 project with components, services, and Tailwind CSS styles.
     - Automation: n8n workflow JSON files for social media, email, and inventory automation.
   - **Documentation**:
     - Database schema diagram and explanation.
     - API endpoints for Supabase interactions (e.g., REST and real-time).
     - Setup guide for running the project locally and deploying.
     - User guide for admins, managers, employees, and customers.
   - **Sample Data**:
     - Prepopulate Supabase with sample data (e.g., 10 menu items, 40 employees, 3 branches, 50 orders).
   - **Artifacts**:
     - `docker-compose.yml` for local Supabase and n8n setup (optional for self-hosting).
     - `.env.example` file with required environment variables.
     - Tailwind configuration file (`tailwind.config.js`) with custom themes.

6. **Constraints**:
   - Ensure the system is scalable to handle additional branches in the future.
   - Support multi-language content for the website (e.g., English and Spanish).
   - Comply with data privacy regulations (e.g., GDPR for customer data).
   - Keep the free tier of Supabase and n8n viable for initial deployment, with notes on upgrading for higher usage.

7. **Success Criteria**:
   - Admins can manage inventory, billing, HR, and payroll across all branches.
   - Managers can view and update branch-specific data.
   - Employees can access their payroll and attendance records.
   - Customers can browse the website, make reservations, and receive email confirmations.
   - Social media posts and emails are automated and triggered correctly.
   - The system is responsive, secure, and user-friendly.

**Instructions for the AI**:
- Generate the complete project structure, including:
  - Supabase SQL scripts for database schema and RLS policies.
  - Angular 19 project files (components, services, modules, Tailwind setup).
  - n8n workflow JSON files for automation.
  - Configuration files (e.g., `angular.json`, `tailwind.config.js`, `.env.example`).
- Provide a step-by-step setup guide in the `README.md`.
- Include comments in code to explain functionality.
- Ensure all artifacts are wrapped in appropriate `<xaiArtifact>` tags with unique UUIDs for each file.
- Use modern best practices (e.g., TypeScript in Angular, secure Supabase auth, efficient n8n workflows).
- If multiple artifacts are generated, ensure each has a unique `artifact_id` and appropriate `contentType` (e.g., `text/html`, `text/javascript`, `text/plain`).
- Do not mention `<xaiArtifact>` tags or related metadata in the response outside of the tags themselves.

**Additional Notes**:
- Refer to Supabase documentation for Angular integration (e.g., user management tutorials) and n8n documentation for workflow setup.
- Use Tailwind CSS for rapid prototyping and consistent styling.
- Ensure the system is intuitive for non-technical restaurant staff.
- Provide a basic sushi-themed design for the frontend to enhance user engagement.

**Output Format**:
- Deliver all code and documentation within `<xaiArtifact>` tags.
- Organize artifacts by type (e.g., backend, frontend, automation, documentation).
- Include a high-level overview of the project structure before the artifacts.