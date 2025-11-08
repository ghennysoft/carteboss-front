import { Link } from "react-router-dom"

const NavBar = () => {
  return (
    <>
        <nav className="flex justify-between items-center">
            <Link to={"/"}><img src="/logo.png" width={100} alt="logo ghenny" /></Link>
            <p>
                <span>Medi King's, </span>
                <span>
                    <Link to={"/"}>Déconnexion</Link>
                </span>
            </p>
        </nav>
        <hr className="border-gray-400 mb-5" />
    </>
  )
}

export default NavBar
