import { lazy } from "react";

export const ChooseRole = lazy(() => import("../pages/ChooseRole/ChooseRole"));
export const Login = lazy(() => import("../pages/Login/Login"));
export const CreateAccount = lazy(() => import("../pages/createAccount/createAccount"));
export const Job = lazy(() => import("../pages/Job/Job"));
export const JobDetail = lazy(() => import("../pages/Job/JobDetail"));
export const Account = lazy(() => import("../pages/Account/Account"));
export const LayoutOrg = lazy(() => import("../Layout/LayoutOrg"));
export const OrgDashboard = lazy(() => import("../pages/OrgDashboard/OrgDashboard"));
export const NetWorkPage = lazy(() => import("../pages/Network/NetworkPage"));
export const MessagesPage = lazy(() => import("../pages/Messages/MessagesPage"));
export const AITools = lazy(() => import("../pages/AITools/AITools"));
export const NotificationsPage = lazy(() => import("../pages/Notifications/NotificationsPage"));

// Organization Pages
export const CompanyProfile = lazy(() => import("../pages/Organization/CompanyProfile"));
export const OrgJobs = lazy(() => import("../pages/Organization/OrgJobs"));
export const OrgCandidates = lazy(() => import("../pages/Organization/OrgCandidates"));
export const OrgCandidateDetail = lazy(() => import("../pages/Organization/OrgCandidateDetail"));
export const OrgApplications = lazy(() => import("../pages/Organization/OrgApplications"));
export const OrgMessages = lazy(() => import("../pages/Organization/OrgMessages"));
export const OrgAITools = lazy(() => import("../pages/Organization/OrgAITools"));