import { createHashRouter, RouterProvider } from "react-router-dom"
import { ChooseRole, CreateAccount, Job, Login, LayoutOrg, OrgDashboard } from "./router/router"
import Layout from "./Layout/Layout"
import ErrorPage from "./components/ErrorPage/ErrorPage"
import { Suspense } from "react"
import Loading from "./components/Loading/Loading"

export default function App() {
  const router = createHashRouter([
    {
      path : "/",
      element : <ChooseRole />
    },
    {
      path : "/login",
      element : <Login />
    },
    {
      path : "/create-account",
      element : <CreateAccount />
    },
    {
      path : "candidate-page",
      element : <Layout />,
      errorElement: <ErrorPage />,
      children : [
        {
          index: true,
          element : (
            <Suspense fallback={<Loading />}>
              <Job />
            </Suspense>
          )
        },
      ]
    },
    {
      path : "organization-page",
      element : (
        <Suspense fallback={<Loading />}>
          <LayoutOrg />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
      children : [
        {
          index: true,
          element : (
            <Suspense fallback={<Loading />}>
              <OrgDashboard />
            </Suspense>
          )
        },
      ]
    }
  ])
  return <RouterProvider router={router} />
}
