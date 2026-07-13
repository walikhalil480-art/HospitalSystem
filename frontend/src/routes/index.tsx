import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuthStore } from "../store/authStore";
import Dashboard from "../pages/Dashboard";
import PatientsPage from "../pages/Patients";
import DoctorsPage from "../pages/Doctors";
import DoctorDetailsPage from "../pages/DoctorDetails";
import DoctorFormPage from "../pages/DoctorFormPage";
import DepartmentsPage from "../pages/Departments";
import DepartmentDetailsPage from "../pages/DepartmentDetails";
import DepartmentFormPage from "../pages/DepartmentFormPage";
import AppointmentsPage from "../pages/Appointments";
import AppointmentFormPage from "../pages/AppointmentFormPage";
import AppointmentDetailsPage from "../pages/AppointmentDetailsPage";
import MedicalRecordsPage from "../pages/MedicalRecords";
import MedicalRecordDetailsPage from "../pages/MedicalRecordDetails";
import PatientMedicalHistoryPage from "../pages/PatientMedicalHistory";
import PharmacyPage from "../pages/Pharmacy";
import BillingPage from "../pages/Billing";
import SettingsPage from "../pages/Settings";
import LaboratoryPage from "../pages/Laboratory";
import { MainLayout } from "../layouts/MainLayout";

const AuthRedirect = () => {
  const token = useAuthStore((state) => state.token);
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRedirect />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/patients",
            element: <PatientsPage />,
          },
          {
            path: "/doctors",
            element: <DoctorsPage />,
          },
          {
            path: "/doctors/new",
            element: <DoctorFormPage />,
          },
          {
            path: "/doctors/:id",
            element: <DoctorDetailsPage />,
          },
          {
            path: "/doctors/:id/edit",
            element: <DoctorFormPage />,
          },
          {
            path: "/departments",
            element: <DepartmentsPage />,
          },
          {
            path: "/departments/new",
            element: <DepartmentFormPage />,
          },
          {
            path: "/departments/:id",
            element: <DepartmentDetailsPage />,
          },
          {
            path: "/departments/:id/edit",
            element: <DepartmentFormPage />,
          },
          {
            path: "/appointments",
            element: <AppointmentsPage />,
          },
          {
            path: "/appointments/new",
            element: <AppointmentFormPage />,
          },
          {
            path: "/appointments/:id",
            element: <AppointmentDetailsPage />,
          },
          {
            path: "/appointments/:id/edit",
            element: <AppointmentFormPage />,
          },
          {
            path: "/emr",
            element: <MedicalRecordsPage />,
          },
          {
            path: "/emr/:id",
            element: <MedicalRecordDetailsPage />,
          },
          {
            path: "/emr/history/:patientId",
            element: <PatientMedicalHistoryPage />,
          },
          {
            path: "/pharmacy",
            element: <PharmacyPage />,
          },
          {
            path: "/billing",
            element: <BillingPage />,
          },
          {
            path: "/settings",
            element: <SettingsPage />,
          },
          {
            path: "/laboratory",
            element: <LaboratoryPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
