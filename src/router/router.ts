import { lazy } from "react";

export const ChooseRole = lazy(() => import("../pages/ChooseRole/ChooseRole"));
export const Login = lazy(() => import("../pages/Login/Login"));
export const CreateAccount = lazy(() => import("../pages/createAccount/createAccount"));
export const Job = lazy(() => import("../pages/Job/Job"));
export const JobDetail = lazy(() => import("../pages/Job/JobDetail"));
export const Account = lazy(() => import("../pages/Account/Account"));
export const LayoutOrg = lazy(() => import("../Layout/LayoutOrg"));
export const OrgDashboard = lazy(() => import("../pages/OrgDashboard/OrgDashboard"));