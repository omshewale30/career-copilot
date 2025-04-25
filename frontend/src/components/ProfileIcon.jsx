import { User } from "lucide-react"
import { Link } from "react-router-dom"

const ProfileIcon = () => {
  return (
    <Link
      to="/profile"
      className="relative p-3 w-12 h-12 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
      aria-label="Go to profile"
    >
      <User className="h-8 w-8 text-gray-700" />
    </Link>
  )
}

export default ProfileIcon
