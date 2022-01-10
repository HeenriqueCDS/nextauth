import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"

export default function Dashboard() {
    const { user, isAuthenticated } = useContext(AuthContext)
    console
        return (
            <div>
                <h1>Dashboard: {user?.email}</h1>
                <h2>Você está autenticado: <span>{isAuthenticated? 'sim!' : 'não!'}</span></h2>
            </div>
        )
}