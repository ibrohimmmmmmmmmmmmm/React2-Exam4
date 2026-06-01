import { createHashRouter, RouterProvider } from "react-router-dom"
import { ChooseRole, CreateAccount, Login } from "./router/router"

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
    }
  ])
  return <RouterProvider router={router} />
}
