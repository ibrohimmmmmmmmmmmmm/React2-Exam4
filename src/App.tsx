import { createHashRouter, RouterProvider } from "react-router-dom";
import { ChooseRole, CreateAccount, Job, JobDetail, Login, LayoutOrg, OrgDashboard, NetWorkPage, MessagesPage, AITools, NotificationsPage,
  CompanyProfile, OrgJobs, OrgCandidates, OrgCandidateDetail, OrgApplications, OrgMessages, OrgAITools, Account
} from "./router/router";
import Layout from "./Layout/Layout";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import { Suspense } from "react";
import Loading from "./components/Loading/Loading";

export default function App() {
  const router = createHashRouter([
    {
      path: "/",
      element: <ChooseRole />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/create-account",
      element: <CreateAccount />,
    },
    {
      path: "candidate-page",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<Loading />}>
              <Job />
            </Suspense>
          ),
        },
        {
          path: "account",
          element: (
            <Suspense fallback={<Loading />}>
              <Account />
            </Suspense>
          ),
        },
        {
          path: "network",
          element: (
            <Suspense fallback={<Loading />}>
              <NetWorkPage />
            </Suspense>
          ),
        },
        {
          path: "job/:jobId",
          element: (
            <Suspense fallback={<Loading />}>
              <JobDetail />
            </Suspense>
          ),
        },
        {
          path: "messages",
          element: (
            <Suspense fallback={<Loading />}>
              <MessagesPage />
            </Suspense>
          ),
        },
        {
          path: "ai-tools",
          element: (
            <Suspense fallback={<Loading />}>
              <AITools />
            </Suspense>
          ),
        },
        {
          path: "notifications",
          element: (
            <Suspense fallback={<Loading />}>
              <NotificationsPage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "organization-page",
      element: (
        <Suspense fallback={<Loading />}>
          <LayoutOrg />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<Loading />}>
              <OrgDashboard />
            </Suspense>
          ),
        },
        {
          path: "company-profile",
          element: (
            <Suspense fallback={<Loading />}>
              <CompanyProfile />
            </Suspense>
          ),
        },
        {
          path: "jobs",
          element: (
            <Suspense fallback={<Loading />}>
              <OrgJobs />
            </Suspense>
          ),
        },
        {
          path: "candidates",
          element: (
            <Suspense fallback={<Loading />}>
              <OrgCandidates />
            </Suspense>
          ),
        },
        {
          path: "candidate/:id",
          element: (
            <Suspense fallback={<Loading />}>
              <OrgCandidateDetail />
            </Suspense>
          ),
        },
        {
          path: "applications",
          element: (
            <Suspense fallback={<Loading />}>
              <OrgApplications />
            </Suspense>
          ),
        },
        {
          path: "messages",
          element: (
            <Suspense fallback={<Loading />}>
              <OrgMessages />
            </Suspense>
          ),
        },
        {
          path: "ai-tools",
          element: (
            <Suspense fallback={<Loading />}>
              <OrgAITools />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
