import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"

export default function Dashboard() {
    const { user, isAuthenticated } = useContext(AuthContext)
    console
    if (user) {
        return (
            <div>
                <h1>Hello, {user.email}</h1>
                <h2>Você está autenticado: <span>{isAuthenticated? 'True' : 'False'}</span></h2>
            </div>
        )
    } return (
        <div>
            <h1>Deslogado</h1>
        </div>
    )
}